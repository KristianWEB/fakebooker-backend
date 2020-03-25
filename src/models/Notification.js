const { model, Schema } = require("mongoose");

const NotificationSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  notifier: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  action: { type: String, required: true },
  actionId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  createdAt: { type: Number, default: Date.now() },
});

const Notification = model("Notification", NotificationSchema);

module.exports = Notification;
