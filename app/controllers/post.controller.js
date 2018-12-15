const post = require('../models/post.model.js');

//------------- Start REST Client methods section ---------------------
// this api according to https://marmelab.com/admin-on-rest/RestClients.html#writing-your-own-rest-client (restClient)
//https://github.com/marmelab/admin-on-rest/blob/master/docs/RestClients.md (Writing Your Own REST Client section)

exports.findAll_new = (req, res) => {
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
    var keys = '';
    var Obj = {};

    if (req.query.filter != null && req.query.filter != undefined && req.query.filter != '') {
        filter = JSON.parse(req.query.filter);
        for (var key in filter) keys = key;
        Obj[keys] = {
            "$in": filter[keys]
        };
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
                res.setHeader('X-Total-Count', count);
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

exports.getbyid__new = (req, res) => {
    post.findOne({
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

exports.update_new = (req, res) => {
    post.findByIdAndUpdate(
        req.params.postId,
        req.body, {
            new: true
        },
        (err, data) => {
            if (err) return res.status(500).send(err);
            return res.json({
                data: data
            });
        }
    )
};

//------------- End REST Client methods section ---------------------



//---------- Start JSON Server REST methods section ------------
exports.findAll = (req, res) => {
    var sortObject = {};
    var stype = req.query._sort;
    var sdir = '';
    if (req.query._order == 'ASC')
        sdir = 1;
    else
        sdir = -1;
    sortObject[stype] = sdir;

    post.find({}, null, {
            skip: parseInt(req.query._start),
            limit: parseInt(req.query._end),
            sort: sortObject
        })
        .then(data => {
            post.countDocuments({}).then(count => {
                // if (err) {
                //     return res.json(count_error);
                // }
                res.setHeader('X-Total-Count', count);
                res.json(data);
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

exports.update = (req, res) => {

    post.findOneAndUpdate({
        id: parseInt(req.params.postId),
    }, {
        $set: {
            title: req.body.title,
            body: req.body.body,
        }
    }, (err, data) => {
        if (err) return res.status(500).send(err);
        return res.json(
            data
        );

    });

};

//---------- End JSON Server REST methods section ------------------------


exports.delete = (req, res) => {

    post.deleteOne({
        id: parseInt(req.params.postId)
    }, (err, resp) => {
        if (err) return res.status(500).send(err);
        res.json({
            id: parseInt(req.params.postId)
        });
    });
};

exports.getbyid = (req, res) => {
    post.findOne({
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

exports.create = (req, res) => {

    post.findOne({}, {
        "id": 1
    }, {
        sort: {
            '_id': -1
        }
    }, function (err, postid) {

        var newpost = post({
            id: postid.id + 1,
            userId: req.body.userId,
            title: req.body.title,
            body: req.body.body,
        });

        newpost.save((err, data) => {
            if (err) return res.status(500).send(err);
            post.findOne(data)
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving notes."
                    });
                });
        });

    });

}