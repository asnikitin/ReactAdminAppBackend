const register = require('../models/register.model.js');
var nodemailer = require('nodemailer');

//https://codeburst.io/sending-an-email-using-nodemailer-gmail-7cfa0712a799

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '<your-email>',
        pass: '<your-password>'
    }
});

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
                                token: token,
                                isemailverified: false
                            });

                            registerdata.save((err, data) => {
                                if (err) return res.status(500).send(err);
                                var obj = {
                                    exp: moment().add(1, 'days').valueOf(),
                                    email: req.body.email
                                }

                                var token = jwt.encode(obj, process.env.SECRET);

                                var hostUrl = process.env.HostUrl;
                                var to = req.body.email;

                                var href = `${hostUrl}/verification?token=${token}&email=${to}`;

                                var mailOptions = {
                                    from: 'multipz.jaimin@gmail.com',
                                    to: to,
                                    subject: "Verify Your Email",
                                    html: `Click on this link to verify your email <a href=${href} target="_blank">Click here</a>`,
                                };

                                //console.log(mailOptions.html);
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent: %s', info.messageId);
                                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                    res.status(200).json('Registration created successfully');
                                });

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

                let user = {
                    "isemailverified": objUser.isemailverified,
                    "username": objUser.username,
                    "email": objUser.email,
                };
                res.send({
                    token: objUser.token,
                    user: user
                });

            } else {
                res.send(401, 'Wrong user or password');
            }
        });

}

exports.VerificationController = (req, res) => {

    if (req.query.email != null && req.query.email != '' && req.query.email != undefined) {

        if (req.query.token != null && req.query.token != '' && req.query.token != undefined) {

            register.findOne({
                    "email": req.query.email
                },
                (err, user) => {
                    if (user.isemailverified) {
                        var html = `<br/><center><h2>Your Email Already Verified</h2></center>`;
                        res.status(202).send(html);
                    } else {

                        var token_data = jwt.decode(req.query.token, process.env.SECRET);
                        var CurrentDate = moment().valueOf();
                        var expdate = token_data.exp;
                        var isbefore = moment(CurrentDate).isBefore(expdate);

                        if (isbefore) {
                            user.isemailverified = true;
                            user.save((err) => {
                                if (err) res.status(404).json(`Your Verification failed`);
                                var html = `<br/><center><h2>Your ${user.email} has been verified</h2></center>`;
                                res.status(403).send(html);
                            });
                        } else {
                            var html = `<br/><center><h2>Your Token expired</h2></center>`;
                            res.status(404).send(html);
                        }
                    }
                });

        } else {
            var html = `<br/><center><h2>Token not found</h2></center>`;
            res.status(404).send(html);
        }

    } else {
        var html = `<br/><center><h2>Email not found</h2></center>`;
        res.status(404).send(html);
    }

}

// --------- smtpTransport -------
// var smtpTransport = require('nodemailer-smtp-transport');
// var transporter = nodemailer.createTransport(smtpTransport({
//     host: 'smtp.mail.yahoo.com',
//     port: 465,
//     service: 'yahoo',
//     secure: false,
//     auth: {
//         user: 'test',
//         pass: 'test'
//     },
//     debug: false,
//     logger: true
// }));
//------- End smtpTransport ----------