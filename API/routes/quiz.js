const express = require("express"),
    mongoose = require("mongoose");

const quizRoutes = express.Router(),
    Quiz = require("../models/quiz"),
    Question = require("../models/question");


quizRoutes.post("/", (req, res, next) => {
    let quiz = new Quiz();
    quiz.teacher = req._id;
    quiz.title = req.body.title;
    quiz.save((err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            if (err.code == 11000)
                res.status(401).json({ message: "Quiz with the same title already exist" });
            else
                return next(err);
        }
    });
});



// All quizes for current teacher
quizRoutes.get("/", (req, res, next) => {
    let allResult = {};
    Quiz.find({ teacher: req._id, published: true }, (err, result) => {
        if (err) {
            return next(err);
        }
        else {
            allResult.published = result;
            Quiz.find({ teacher: req._id, published: false }, (err, result) => {
                if (err) {
                    return next(err);
                }
                else {
                    allResult.unpublished = result;
                    res.status(200).send(allResult);
                }
            });
        }
    });
});

// All unpublished quizes for current teacher
// quizRoutes.get("/unpublished", (req, res, next) => {
//     Quiz.find({ teacher: req._id, published: false }, (err, result) => {
//         if (err) {
//             return next(err);
//         }
//         else {
//             res.status(200).send(result);
//         }
//     });
// });

// Get a quiz questions 
quizRoutes.get("/:id", (req, res, next) => {
    let quiz = {};
    Quiz.findOne({ _id: req.params.id }, (err, result) => {
        if (!err) {
            if (!result) {
                res.status(404).send({ message: "No such a quiz" });
            }
            quiz.quiz = result;
            Question.find({ quiz: req.params.id }, (err, result) => {
                if (err) {
                    return next(err);
                }
                else {
                    quiz.questions = result;
                    res.status(200).send(quiz);
                }
            });
        }
        else {
            return next(err);
        }
    })

});

// Puplish a quiz
quizRoutes.put("/publish/:id", (req, res, next) => {
    Question.findOne({ quiz: req.params.id }, (err, result) => {
        console.log(result)
        if (!result) {
            res.status(401).json({ message: "Quiz must have at least one question to be published" });
        }
        else if (!err) {
            Quiz.updateOne({ _id: req.params.id },
                { published: true },
                (err) => {
                    if (!err) {
                        Quiz.findById(req.params.id, (err, result) => {
                            if (!err) {
                                res.status(200).send(result);
                            }
                            else {
                                return next(err);
                            }
                        })
                    } else {
                        return next(err);
                    }
                });
        }
        else {
            return next(err);
        }
    })
});

// Delete a quiz ant its questions
quizRoutes.delete("/:id", (req, res, next) => {
    Quiz.findByIdAndDelete(req.params.id,
        (err, result) => {
            if (!err) {
                if (result) {
                    Question.deleteMany({ quiz: req.params.id }, (err) => {
                        if (!err) {
                            res.status(200).send(result);
                        }
                        else {
                            return next(err);
                        }
                    })
                }
                else {
                    res.status(401).json({ message: "Could not find this quiz" });
                }
            } else {
                return next(err);
            }
        });
});

module.exports = quizRoutes;