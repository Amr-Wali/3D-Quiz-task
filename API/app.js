const port = 3000;
const express = require("express"),
    path = require("path"),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    teacherRoutes = require("./routes/teacher"),
    questionRoutes = require("./routes/question"),
    quizRoutes = require("./routes/quiz");

const authenticate = require("./middleware/jwt");
const app = express();

mongoose.connect(
    "mongodb://localhost:27017/api",
    { useNewUrlParser: true },
    error => {
        if (error) {
            console.log("DB Connection Error " + error);
            next(error);
        }
    }
);

app.use(morgan("short"));
app.use(cors({ origin: true }));
app.use(bodyParser.json());





app.use("/teacher", teacherRoutes);

// Authentication midleware
app.use(authenticate);
app.get('/', (req, res) => {
    // console.log(req._id);
    res.send("hello world");
});
app.use("/question", questionRoutes);
app.use("/quiz", quizRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else if (err.name === 'CastError') {

        res.status(404).send({ message: "Invalid id" })
    }
    else {
        console.log(err)
        res.status(401).json({ message: "Something went wrong" })
    }
});

app.listen(port, () => {
    console.log(`I am Listening on port ${port}`);
});