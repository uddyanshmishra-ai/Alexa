const Command = require("../models/Command");

// CREATE command
exports.createCommand = async (req, res) => {
  try {
    const command = await Command.create(req.body);
    res.status(201).json(command);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all commands (filterable)
exports.getCommands = async (req, res) => {
  try {
    const commands = await Command.find(req.query);
    res.json(commands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single command
exports.getCommandById = async (req, res) => {
  try {
    const command = await Command.findById(req.params.id);
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
    const updated = await Command.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE command
exports.deleteCommand = async (req, res) => {
  try {
    await Command.findByIdAndDelete(req.params.id);
    res.json({ message: "Command deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
