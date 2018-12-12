const post = require('../models/post.model.js');

exports.findAll = (req, res) => {

    var pagination;
    var sort;
    var filter;

    // const pagination = JSON.parse(req.query.pagination);
    // const sort = JSON.parse(req.query.sort);
    // const filter = JSON.parse(req.query.filter);

    if (req.query.pagination != null && req.query.pagination != undefined && req.query.pagination != '') {
        pagination = JSON.parse(req.query.pagination);
    } else {
        pagination = {
            "page": 1,
            "perPage": 10
        };
    }

    if (req.query.sort != null && req.query.sort != undefined && req.query.sort != '') {
        sort = JSON.parse(req.query.sort);
    } else {
        sort = {
            "field": "_id",
            "'order": "ASC"
        }
    }

    if (req.query.filter != null && req.query.filter != undefined && req.query.filter != '') {
        filter = JSON.parse(req.query.filter);
    } else {
        filter = {
            "_id": [],
        }
    }

    //pagination 
    var pageNo = parseInt(pagination.page)
    var size = parseInt(pagination.perPage)
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = {
            "error": true,
            "message": "Invalid page number, should start with 1"
        };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;


    //sort
    var sortObject = {};
    var stype = sort.field;
    var sdir = '';
    if (sort.field.order == 'ASC')
        sdir = 1;
    else
        sdir = -1;
    sortObject[stype] = sdir;

    var keys = '';
    for (var key in filter) keys = key;

    var Obj = {};
    Obj[keys] = {
        "$in": filter[keys]
    };

    post.find(Obj, null, {
            skip: query.skip,
            limit: query.limit,
            sort: sortObject
        })
        .then(data => {
            post.countDocuments(Obj).then(count => {
                // if (err) {
                //     return res.json(count_error);
                // }
                res.setHeader('X-Total-Count', count)
                res.json({
                    data: data,
                    total: count
                });
            });

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });

};

exports.update = (req, res) => {

    post.findByIdAndUpdate(
        // the id of the item to find
        req.params.postId,
        // the change to be made. Mongoose will smartly combine your existing 
        // document with this change, which allows for partial updates too
        req.body,
        // an option that asks mongoose to return the updated version 
        // of the document instead of the pre-updated one.
        {
            new: true
        },

        // the callback function
        (err, data) => {
            // Handle any possible database errors
            if (err) return res.status(500).send(err);
            return res.json({
                data: data
            });
        }
    )

};

exports.delete = (req, res) => {

    post.remove({
        id: parseInt(req.params.postId)
    }, (err, resp) => {
        if (err) return res.status(500).send(err);
        res.json({
            data: {
                id: parseInt(req.params.postId)
            },
            message: "Record successfully deleted",
        });
    });

};

exports.getbyid = (req, res) => {
    post.find({
            id: parseInt(req.params.postId)
        })
        .then(data => {
            res.send({
                data: data
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};