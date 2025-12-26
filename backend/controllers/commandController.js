const Command = require("../models/Command");

// Mock storage
let mockCommands = [];

// CREATE command
exports.createCommand = async (req, res) => {
  try {
    const command = { id: Date.now().toString(), ...req.body, created_date: new Date() };
    mockCommands.push(command);
    res.status(201).json(command);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all commands (filterable)
exports.getCommands = async (req, res) => {
  try {
    // Basic filtering logic if needed (e.g. by utterance)
    let commands = [...mockCommands];
    if (req.query.utterance) {
        commands = commands.filter(c => c.utterance === req.query.utterance);
    }
    // Simple sort (descending date)
    commands.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    res.json(commands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single command
exports.getCommandById = async (req, res) => {
  try {
    const command = mockCommands.find(c => c.id === req.params.id);
    if (!command) {
      return res.status(404).json({ message: "Command not found" });
    }
    res.json(command);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE command
exports.updateCommand = async (req, res) => {
  try {
    const index = mockCommands.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Command not found" });
    }

    mockCommands[index] = { ...mockCommands[index], ...req.body };
    res.json(mockCommands[index]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE command
exports.deleteCommand = async (req, res) => {
  try {
    const index = mockCommands.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Command not found" });
    }

    mockCommands.splice(index, 1);
    res.json({ message: "Command deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
