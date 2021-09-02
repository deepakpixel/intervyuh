var mongoose = require('mongoose');
var InterviewSchema = mongoose.Schema(
  {
    owner: { type: mongoose.SchemaTypes.ObjectId, required: true },
    title: { required: true, type: String },
    candidateName: { required: true, type: String },
    interviewerName: { required: true, type: String },
    note: { type: String, default: '' },
    isEnded: { type: Boolean, default: false },
    endTime: { type: Date, default: 0 },
    // startTime: { required: true, type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('interview', InterviewSchema);
