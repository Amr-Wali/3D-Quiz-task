const express = require("express"),
    mongoose = require("mongoose");

const questionRoutes = express.Router(),
    Question = require("../models/question");


questionRoutes.post("/", (req, res, next) => {
    if (req.body.answers && !req.body.answers.includes(req.body.correctAnswer)) {
        return res.status(401).json({ message: "The correct answer doesn't exist among answers" });
    }
    let question = new Question(req.body);
    question.save((err, question) => {
        if (!err)
            res.status(200).send(question);
        else {
            if (err.code == 11000)
                res.status(401).json({ message: "This question already exist" });
            else
                return next(err);
        }
    });
})

questionRoutes.put("/:id", (req, res, next) => {
    if (req.body.answers && !req.body.answers.includes(req.body.correctAnswer)) {
        return res.status(401).json({ message: "The correct answer doesn't exist among answers" });
    }
    Question.updateOne({ _id: req.params.id }, req.body, (err) => {
        if (!err)
            Question.findById(req.params.id, (err, result) => {
                if (!err) {
                    res.status(200).send(result);
                }
                else {
                    return next(err);
                }
            })
        else {
            return next(err);
        }
    });
})

questionRoutes.delete("/:id", (req, res, next) => {
    Question.findByIdAndDelete(req.params.id, (err, question) => {
        if (!err) {
            if (question) {
                res.status(200).send(question);
            }
            else {
                res.status(401).json({ message: "Could not find this question" });
            }
        }
        else {
            return next(err);
        }
    });
})

module.exports = questionRoutes;
