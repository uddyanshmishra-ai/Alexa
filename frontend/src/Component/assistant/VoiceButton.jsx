import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function VoiceButton({ 
  onTranscript, 
  onListeningChange, 
  isProcessing,
  language = 'en-US',
  disabled = false 
}) {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      setHasPermission(false);
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        const isFinal = event.results[event.results.length - 1].isFinal;
        
        if (isFinal) {
          onTranscript?.(transcript, true);
          stopListening();
        } else {
          onTranscript?.(transcript, false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setHasPermission(false);
        } else if (event.error === 'no-speech') {
          console.log('No speech detected, stopping...');
        } else if (event.error === 'aborted') {
          // Ignore aborted errors
          return;
        }
        stopListening();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        onListeningChange?.(false);
        stopAudioVisualization();
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
      };
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setHasPermission(false);
    }

    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      } catch (e) {
        console.error('Error aborting recognition:', e);
      }
      stopAudioVisualization();
    };
  }, [language]);

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const updateLevel = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 128);
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
      setHasPermission(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setHasPermission(false);
    }
  };

  const stopAudioVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  const startListening = async () => {
    if (!recognitionRef.current || disabled || isProcessing) return;
    
    try {
      // First request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      
      // Start audio visualization
      await startAudioVisualization();
      
      // Update language and start recognition
      recognitionRef.current.lang = language;
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
        onListeningChange?.(true);
      } catch (startError) {
        if (startError.message.includes('already started')) {
          // Recognition already running, stop and restart
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListening(true);
            onListeningChange?.(true);
          }, 100);
        } else {
          throw startError;
        }
      }
    } catch (err) {
      console.error('Failed to start recognition:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setHasPermission(false);
      }
      stopListening();
    }
  };

  const stopListening = () => {
    try {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    } catch (err) {
      console.error('Error stopping recognition:', err);
    }
    stopAudioVisualization();
    setIsListening(false);
    onListeningChange?.(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const pulseRings = [1, 2, 3, 4];

  return (
    <div className="relative flex items-center justify-center">
      {/* Audio visualization rings */}
      <AnimatePresence>
        {isListening && pulseRings.map((ring) => (
          <motion.div
            key={ring}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ 
              scale: 1 + (audioLevel * 0.5 * ring),
              opacity: 0.6 - (ring * 0.12)
            }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute rounded-full border-2 border-blue-500/30"
            style={{
              width: `${80 + ring * 24}px`,
              height: `${80 + ring * 24}px`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={toggleListening}
        disabled={disabled || isProcessing || hasPermission === false}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative z-10 w-20 h-20 rounded-full flex items-center justify-center",
          "transition-all duration-300 shadow-2xl",
          isListening 
            ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30" 
            : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30",
          "hover:shadow-xl",
          (disabled || hasPermission === false) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <MicOff className="w-8 h-8 text-white" />
          </motion.div>
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}

        {/* Glow effect */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-40 -z-10",
            isListening ? "bg-red-500" : "bg-blue-500"
          )} 
        />
      </motion.button>

      {/* Permission denied message */}
      {hasPermission === false && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 text-xs text-red-400 whitespace-nowrap"
        >
          Microphone access denied
        </motion.p>
      )}
    </div>
  );
}