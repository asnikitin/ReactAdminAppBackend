const register = require('../models/register.model.js');

exports.registration = (req, res) => {

    register.findOne({
            "email": req.body.email
        },
        (err, objuseremail) => {
            if (!objuseremail) {

                register.findOne({
                        "username": req.body.username
                    },
                    (err, objusername) => {

                        if (!objusername) {
                            var token = jwt.encode(req.body.email, process.env.SECRET);
                            var password = jwt.encode(req.body.password, process.env.SECRET);

                            var registerdata = register({
                                username: req.body.username,
                                email: req.body.email,
                                password: password,
                                token: token
                            });

                            registerdata.save((err, data) => {
                                if (err) return res.status(500).send(err);
                                res.status(200).json('Registration created successfully');
                            });

                        } else {
                            res.status(409).json('Username already exists!');
                        }
                    });
            } else {
                res.status(409).json('Email already exists!');
            }
        });

}

exports.login = (req, res) => {

    let user = req.body;
    var Encryptpassword = jwt.encode(user.password, process.env.SECRET);
    register.findOne({
            "username": user.username,
            "password": Encryptpassword
        },
        (err, objUser) => {
            if (objUser) {
                res.send({
                    token: objUser.token
                });
            } else {
                res.send(401, 'Wrong user or password');
            }
        });

}