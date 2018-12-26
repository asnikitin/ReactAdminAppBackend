const register = require('../models/register.model.js');
const models = require('../models/role.model.js');
const Role = models.Role;
const UserInRole = models.UserInRole;
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
                            //var token = jwt.encode(req.body.email, process.env.SECRET);
                            var Encryptpassword = jwt.encode(req.body.password, process.env.SECRET);

                            var registerdata = register({
                                username: req.body.username,
                                email: req.body.email,
                                password: Encryptpassword,
                                //token: token,
                                isemailverified: false
                            });

                            registerdata.save((err, data) => {
                                if (err) return res.status(500).send(err);

                                //Create User Role for New Register User
                                Role.findOne({
                                    "rolename": {
                                        $regex: new RegExp("User", "i")
                                    }
                                }, (err, responce) => {

                                    var objUserInRole = UserInRole({
                                        userId: data.id,
                                        roleId: responce.id
                                    });

                                    objUserInRole.save((err, resuerinrole) => {

                                        var obj = {
                                            exp: moment().add(1, 'days').valueOf(),
                                            email: req.body.email
                                        }

                                        var token_email = jwt.encode(obj, process.env.SECRET);

                                        var hostUrl = process.env.HostUrl;
                                        var to = req.body.email;

                                        var href = `${hostUrl}/verification?token=${token_email}&email=${to}`;

                                        var mailOptions = {
                                            from: 'multipz.jaimin@gmail.com',
                                            to: to,
                                            subject: "Verify Your Email",
                                            html: `Click on this link to verify your email <a href=${href} target="_blank">Click here</a>`,
                                        };

                                        //Send Mail;
                                        transporter.sendMail(mailOptions, (error, info) => {
                                            if (error) {
                                                return console.log(error);
                                            }
                                            console.log('Message sent: %s', info.messageId);
                                            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                            res.status(200).json('Registration created successfully');
                                        });

                                    });

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

                UserInRole.find({
                    "userId": ObjectId(objUser.id)
                }, {
                    roleId: 1
                }, (err, docs) => {

                    // Map the docs into an array of just the _ids
                    var ids = docs.map(function (doc) {
                        return doc.roleId;
                    });

                    // Get the companies whose founders are in that set.
                    Role.find({
                        _id: {
                            $in: ids
                        }
                    }, function (err, docs) {
                        // docs contains your answer
                        let lstRole = [];
                        for (var i = 0; i < docs.length; i++) {
                            var objRole = docs[i].rolename;
                            lstRole.push(objRole);
                        }

                        var obj = {
                            username: user.username,
                            password: Encryptpassword,
                            Role: lstRole
                        }

                        var token = jwt.encode(obj, process.env.SECRET)

                        res.json({
                            token: token,
                            username: objUser.username,
                            email: objUser.email,
                            isemailverified: objUser.isemailverified
                        });

                    });
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

                    if (user) {
                        if (user.isemailverified) {
                            var html = `<br/><center><h2>Your Email Already Verified</h2></center>`;
                            res.status(202).send(html);
                        } else {

                            try {
                                var token_data = jwt.decode(req.query.token, process.env.SECRET);
                                var CurrentDate = moment().valueOf();
                                var expdate = token_data.exp;
                                var isbefore = moment(CurrentDate).isBefore(expdate);

                                if (isbefore) {

                                    if (token_data.email == req.query.email) {
                                        user.isemailverified = true;
                                        user.save((err) => {
                                            if (err) res.status(404).json(`Your Verification failed`);
                                            var html = `<br/><center><h2>Your ${user.email} has been verified</h2></center>`;
                                            res.status(403).send(html);
                                        });
                                    } else {
                                        var html = `<br/><center><h2>Invalid Token</h2></center>`;
                                        res.status(404).send(html);
                                    }

                                } else {
                                    var html = `<br/><center><h2>Your Token expired</h2></center>`;
                                    res.status(404).send(html);
                                }
                            } catch (error) {
                                // handle query error
                                var html = `<br/><center><h2>Invalid Token</h2></center>`;
                                res.status(404).send(html);
                            }
                        }
                    } else {
                        var html = `<br/><center><h2>Invalid Email or Token</h2></center>`;
                        res.status(404).send(html);
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

exports.GetAllUsers = (req, res) => {

    register.find({}, (err, objUser) => {
        if (objUser) {

            var i = 0;
            var lstUsers = [];

            function uploader(i) {

                if (i < objUser.length) {

                    var obj = new Object();
                    obj._id = objUser[i].id;
                    obj.username = objUser[i].username;
                    obj.email = objUser[i].email;
                    obj.createddate = objUser[i].createddate;
                    obj.userrole = [];

                    UserInRole.find({
                        "userId": ObjectId(obj._id)
                    }, {
                        roleId: 1
                    }, (err, docs) => {

                        let getRole = (data) => {
                            return new Promise(
                                (resolve, reject) => {

                                    Role.find({
                                        _id: {
                                            $in: data
                                        }
                                    }, {
                                        rolename: 1,
                                        _id: 1
                                    }, function (err, docs) {
                                        //if (error) reject(error);
                                        var lstRole = [];
                                        for (var i = 0; i < docs.length; i++) {
                                            var objRole = docs[i];
                                            lstRole.push(objRole);
                                        }
                                        resolve(lstRole);
                                    });

                                }
                            );
                        };

                        var ids = docs.map(function (doc) {
                            return doc.roleId;
                        });

                        getRole(ids).then((role) => {

                            obj.userrole = role;
                            lstUsers.push(obj);

                            if ((i + 1) == objUser.length) {
                                res.json(lstUsers);
                            } else {
                                uploader(i + 1);
                            }

                        }).catch(
                            error => console.log(error)
                        );

                    });

                }

            }
            uploader(i);

        }
    });

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