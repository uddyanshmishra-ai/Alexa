const UserPreferences = require("../models/UserPreferences");

// CREATE / SET preferences
exports.createPreferences = async (req, res) => {
  try {
    const prefs = await UserPreferences.create(req.body);
    res.status(201).json(prefs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET preferences
exports.getPreferences = async (req, res) => {
  try {
    const prefs = await UserPreferences.find();
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE preferences
exports.updatePreferences = async (req, res) => {
  try {
    const updated = await UserPreferences.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
