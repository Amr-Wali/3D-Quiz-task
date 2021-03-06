const secret = "AmrWali_Task_3D",
    Jwt_expireTime = "24hr";

const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');

var teacherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: "Full name can't be empty"
    },
    email: {
        type: String,
        required: "Email can't be empty",
        unique: true
    },
    password: {
        type: String,
        required: "Password can't be empty",
        minlength: [4, 'Password must be atleast 4 character long']
    },
    saltSecret: String
});

// Custom validation for email
teacherSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,13}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// PreSaving Event for generating salt & hashing pass 
teacherSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

// Methods
teacherSchema.methods.generateJwt = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.fullName
        }, secret,
        {
            expiresIn: Jwt_expireTime
        }
    );
}

teacherSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;