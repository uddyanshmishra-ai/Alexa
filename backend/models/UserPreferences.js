const mongoose = require("mongoose");

const UserPreferencesSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      default: "en"
    },
    voice_enabled: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ["dark", "light", "system"],
      default: "dark"
    },
    permissions: {
      microphone: { type: Boolean, default: false },
      notifications: { type: Boolean, default: false },
      navigation: { type: Boolean, default: true },
      messaging: { type: Boolean, default: false }
    },
    tts_voice: {
      type: String,
      default: "default"
    },
    quick_commands: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPreferences", UserPreferencesSchema);
