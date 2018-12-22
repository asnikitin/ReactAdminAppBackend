const user = require('../models/user.model.js');

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

    user.find(Obj, null, {
            skip: query.skip,
            limit: query.limit,
            sort: sortObject
        })
        .then(data => {
            user.countDocuments(Obj).then(count => {
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

exports.update_new = (req, res) => {

    user.findByIdAndUpdate(
        // the id of the item to find
        req.params.Id,
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

exports.getbyid_new = (req, res) => {
    user.find({
            id: parseInt(req.params.Id)
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

    user.find({}, null, {
            skip: parseInt(req.query._start),
            limit: parseInt(req.query._end),
            sort: sortObject
        })
        .then(data => {
            user.countDocuments({}).then(count => {
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

    user.findOneAndUpdate({
        id: parseInt(req.params.Id),
    }, {
        $set: {
            "name": req.body.name,
            "username": req.body.username,
            "email": req.body.username,
            "phone": req.body.email,
            "website": req.body.website
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

    user.deleteOne({
        id: parseInt(req.params.Id)
    }, (err, resp) => {
        if (err) return res.status(500).send(err);
        res.json({
            id: parseInt(req.params.Id)
        });
    });

};

exports.getbyid = (req, res) => {
    user.findOne({
            id: parseInt(req.params.Id)
        })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};


