const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let quizSchema = mongoose.Schema({
    title: { type: String, required: "There must be title for the quiz" },
    teacher: { type: ObjectId, ref: "Teacher", required: "There must be teacher for this quiz" },
    published: { type: Boolean, default: false }
})


quizSchema.index({ title: 1, teacher: 1 }, { unique: true });
module.exports = mongoose.model('Quiz', quizSchema);