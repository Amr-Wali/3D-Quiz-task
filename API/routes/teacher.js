const express = require("express"),
    mongoose = require("mongoose"),
    bcrypt = require('bcryptjs');

const teacherRoutes = express.Router(),
    Teacher = require("../models/teacher"),
    authenticate = require("../middleware/jwt");

teacherRoutes.post("/signup", (req, res, next) => {
    let teacher = new Teacher();
    teacher.fullName = req.body.fullName;
    teacher.email = req.body.email;
    teacher.password = req.body.password;
    teacher.save((err, teacher) => {
        if (!err)
            res.status(200).json({ "token": teacher.generateJwt() });
        else {
            if (err.code == 11000)
                res.status(422).send(['This email address already exist']);
            else
                return next(err);
        }
    });
})

teacherRoutes.post("/signin", (req, res) => {
    console.log(req.body);
    Teacher.findOne({ email: req.body.email },
        (err, teacher) => {
            if (err)
                res.status(404).json(err);
            // unknown teacher
            else if (!teacher)
                res.status(401).json({ message: 'No such account' });
            // wrong password
            else if (!teacher.verifyPassword(req.body.password))
                res.status(401).json({ message: 'Wrong password' });
            // authentication succeeded
            else
                res.status(200).json({ "token": teacher.generateJwt() });
        });
});

teacherRoutes.use(authenticate);
teacherRoutes.get("/", (req, res) => {
    Teacher.findById(req._id, (err, user) => {
        if (err) {
            console.log(err);
            res.status(404).send(err);
        }
        else {
            res.status(200).send(user);
        }
    })
})

module.exports = teacherRoutes;