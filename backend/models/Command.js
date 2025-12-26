const mongoose = require("mongoose");

const CommandSchema = new mongoose.Schema(
  {
    utterance: {
      type: String,
      required: true
    },
    intent: {
      type: String
    },
    entities: {
      type: Object,
      default: {}
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "executed", "failed", "cancelled"],
      default: "pending"
    },
    response: {
      type: String
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    language: {
      type: String,
      default: "en"
    },
    execution_details: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Command", CommandSchema);
