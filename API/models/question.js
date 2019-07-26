let mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

let QuestionSchema = new mongoose.Schema({
    body: { type: String, required: "There must be body for this question" },
    answers: {
        type: [
            {
                type: String
            }
        ], required: "There must be answers"
    },
    correctAnswer: { type: String, required: "You forgot to provide the correct answer" },
    quiz: { type: ObjectId, ref: "Quiz", required: "There must be quiz for this question" }
});

QuestionSchema.index({ body: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model("Question", QuestionSchema);
