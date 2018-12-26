const models = require('../models/role.model.js');
const Role = models.Role;

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