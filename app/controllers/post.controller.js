const post = require('../models/post.model.js');

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {

    var sortObject = {};
    var stype = req.query._sort;
    var sdir = '';
    if (req.query._order == 'ASC')
        sdir = 1;
    else
        sdir = -1;

    sortObject[stype] = sdir;
    post.find({
            title: new RegExp(req.query.title, "i")
        }, null, {
            skip: parseInt(req.query._start),
            limit: parseInt(req.query._end),
            sort: sortObject
        })
        .then(data => {
            post.count({
                title: new RegExp(req.query.title, "i")
            }).then(count => {
                // if (err) {
                //     return res.json(count_error);
                // }
                res.setHeader('X-Total-Count', count)
                res.send(data);
            });

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

exports.update = (req, res) => {

    post.update(req.body, (err, result) => {
        if (err) res.json(err);
        res.json(result);
    });

};

exports.delete = (req, res) => {

    post.remove({
        id: parseInt(req.params.postId)
    }, (err, resp) => {
        if (err) return res.status(500).send(err);
        res.json({
            message: "Record successfully deleted",
        });
    });

};

exports.getbyid = (req, res) => {
    post.find({
            id: parseInt(req.params.postId)
        })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};


exports.getbyuserid = (req, res) => {

    post.find({
            userId: parseInt(req.params.userId)
        })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });

};
