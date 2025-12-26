const UserPreferences = require("../models/UserPreferences");

let mockPreferences = [];

// CREATE / SET preferences
exports.createPreferences = async (req, res) => {
  try {
    const preferences = { id: Date.now().toString(), ...req.body, created_date: new Date() };
    mockPreferences.push(preferences);
    // const preferences = await UserPreferences.create(req.body);
    res.status(201).json(preferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET preferences
exports.getPreferences = async (req, res) => {
  try {
    // const preferences = await UserPreferences.find(req.query);
    res.json(mockPreferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE preferences
exports.updatePreferences = async (req, res) => {
  try {
    const index = mockPreferences.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        mockPreferences[index] = { ...mockPreferences[index], ...req.body };
        res.json(mockPreferences[index]);
    } else {
        res.status(404).json({ message: "Not found" });
    }
    // const updated = await UserPreferences.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   { new: true }
    // );
    // res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
