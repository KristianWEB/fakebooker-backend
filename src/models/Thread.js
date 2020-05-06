const { model, Schema } = require("mongoose");

const ThreadSchema = new Schema({
  participantsIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Thread = model("Thread", ThreadSchema);

module.exports = Thread;
