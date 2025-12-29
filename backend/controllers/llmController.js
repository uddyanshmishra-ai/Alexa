// Mock LLM Controller
exports.invokeLLM = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Simple mock logic based on prompt content
    let responseText = "I understand. I am processing your request.";
    let action = null;
    let actionData = null;
    let intent = "unknown";

    // Very basic keyword matching for demonstration
    if (prompt.toLowerCase().includes("open")) {
        intent = "navigation.open";
        responseText = "Opening the website for you.";
        action = "open";
        // Extract url roughly
        const urlMatch = prompt.match(/open (https?:\/\/[^\s]+|[\w.]+)/i);
        if (urlMatch) {
            let capturedUrl = urlMatch[1];
            // If it doesn't start with http/https
            if (!capturedUrl.match(/^https?:\/\//)) {
                // If it looks like a bare word (no dot), assume .com
                if (!capturedUrl.includes('.')) {
                    capturedUrl += '.com';
                }
                capturedUrl = `https://${capturedUrl}`;
            }
            actionData = { url: capturedUrl };
        }
    } else if (prompt.toLowerCase().includes("search")) {
        intent = "navigation.search";
        responseText = "Searching for that.";
        action = "search";
        const query = prompt.replace(/search (for )?/i, "").trim();
        actionData = { query };
    }

    // Response structure matching what frontend expects
    const response = {
      response: responseText,
      action: action,
      actionData: actionData,
      intent: intent,
      entities: actionData || {},
      requiresConfirmation: false,
      confidence: 0.9
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
