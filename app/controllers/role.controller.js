const models = require('../models/role.model.js');
const Register = require('../models/register.model.js');
const Role = models.Role;
const UserInRole = models.UserInRole;
var UserPermission = models.UserPermission;

exports.GetAllRole = (req, res) => {

    Role.find({})
        .then(data => {
            //res.setHeader('X-Total-Count', count);
            res.json(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Roles."
            });
        });

};

exports.CreateRole = (req, res) => {

    Role.findOne({
        "rolename": {
            $regex: new RegExp(req.body.rolename, "i")
        }
    }, (err, responce) => {

        if (responce) {
            res.status(404).json(`Role is already Exist...`);
        } else {

            var newRole = Role({
                rolename: req.body.rolename,
                description: req.body.description,
            });
            newRole.save((err, data) => {
                if (err) return res.status(500).send(err);
                Role.findOne(data)
                    .then(data => {
                        res.send(data);
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while retrieving Role."
                        });
                    });
            });
        }

    });

}

exports.DeleteRole = (req, res) => {

    UserInRole.findOne({
        roleId: ObjectId(req.params.Id)
    }, (err, resUserInRole) => {
        if (resUserInRole == null) {

            Role.deleteOne({
                _id: ObjectId(req.params.Id)
            }, (err, resp) => {
                if (err) return res.status(500).send(err);
                res.json({
                    _id: ObjectId(req.params.Id),
                    message: "Role deleted successfully..."
                });
            });

        } else {
            res.status(202).json("This Record Can't Deleted, It Contain References to other data...");
        }

    });

};

exports.ChangePermission = (req, res) => {

    var idPermission = 0;
    UserPermission.findOne({
        "ModuleName": {
            $regex: new RegExp(req.body.modulename, "i")
        },
        "RoleName": {
            $regex: new RegExp(req.body.rolename, "i")
        }
    }, (err, objUserPermissionExist) => {

        if (objUserPermissionExist != null) {
            idPermission = objUserPermissionExist.id;
        }
        if (idPermission != 0) {
            //update
            UserPermission.findOneAndUpdate({
                _id: ObjectId(idPermission),
                "ModuleName": {
                    $regex: new RegExp(req.body.modulename, "i")
                }
            }, {
                $set: {
                    Show: req.body.show,
                }
            }, (err, data) => {
                if (err) return res.status(500).send(err);
                res.json(data);
            });

        } else {
            //create
            var newUserPermission = UserPermission({
                ModuleName: req.body.modulename,
                RoleName: req.body.rolename,
                Show: req.body.show
            });

            newUserPermission.save((err, data) => {
                if (err) return res.status(500).send(err);
                UserPermission.findOne(data)
                    .then(data => {
                        res.send(data);
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while retrieving Role."
                        });
                    });
            });
        }
    });

};

exports.GetAllPermissionByRole = (req, res) => {

    if (req.query.rolename != null && req.query.rolename != undefined && req.query.rolename != '') {

        UserPermission.find({
            "RoleName": {
                $regex: new RegExp(req.query.rolename, "i")
            }
        }, (err, response) => {

            if (response != null) {
                res.json(response);
            } else {
                res.status(404).json({
                    message: "No Permission found..."
                });
            }

        });

    } else {
        res.status(404).json({
            message: "RoleName not found..."
        });
    }



};

exports.CheckRights = (req, res) => {

    if (req.query.modulename != null && req.query.modulename != undefined && req.query.modulename != '') {
        if (req.query.permission != null && req.query.permission != undefined && req.query.permission != '') {

            objHeader = req.headers;
            var token = getToken(objHeader);
            if (token) {
                var objUser = jwt.decode(token, process.env.SECRET);

                Register.findOne({
                    username: objUser.username,
                    password: objUser.password
                }, (err, UserExist) => {

                    if (UserExist != null) {

                        var permission = req.query.permission;

                        UserInRole.find({
                            "userId": ObjectId(UserExist.id)
                        }, {
                            roleId: 1
                        }, (err, strRole) => {

                            function uploader(i) {

                                if (i < strRole.length) {
                                    //Get Role Name from roleId
                                    Role.findOne({
                                        _id: ObjectId(strRole[i].roleId)
                                    }, function (err, docs) {

                                        UserPermission.findOne({
                                            "ModuleName": {
                                                $regex: new RegExp(req.query.modulename, "i")
                                            },
                                            "RoleName": {
                                                $regex: new RegExp(docs.rolename, "i")
                                            }
                                        }, (err, objUserPermission) => {
                                            if (objUserPermission != null) {
                                                if (permission == "show") {

                                                    if (objUserPermission.Show == true) {
                                                        res.json({
                                                            success: true,
                                                            message: "Permission to Access...",
                                                        });
                                                    } else {
                                                        if ((i + 1) == strRole.length) {
                                                            res.status(403).json({
                                                                success: false,
                                                                message: "No Permission to Access..."
                                                            });
                                                        } else {
                                                            uploader(i + 1);
                                                        }
                                                    }

                                                } else {
                                                    uploader(i + 1);
                                                }
                                            } else {
                                                uploader(i + 1);
                                            }
                                        });
                                    });
                                }
                            }
                            uploader(0);

                            if (strRole.length == 0) {
                                res.status(403).json({
                                    message: "No Permission to Access..."
                                });
                            };
                        });
                    } else {
                        res.status(400).json("Invalid token...");
                    }
                });

            } else {
                res.status(400).json("Invalid token...");
            }

        } else {
            res.status(404).json({
                message: "Permission not found..."
            });
        }

    } else {
        res.status(404).json({
            message: "ModuleName not found..."
        });
    }

};


getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};