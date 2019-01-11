const models = require('../models/post.model.js');
const post = models.post;
var fs = require("fs");
var path = require('path');
var FilePath = path.join(__dirname, '../../MediaUploads');

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

    // temporary store Image Base64 string into MediaUpload collection.

    //console.log(req.body);
    // var imgPath = req.body.pictures[0].src;
    // var Media = new MediaUpload;
    // Media.img.data = imgPath;
    // Media.img.contentType = 'image/jpeg';
    // Media.save((err, a) => {
    //     console.log(a);
    //     MediaUpload.findById(a, (err, doc) => {
    //         if (err) return next(err);
    //         //res.contentType(doc.img.contentType);
    //         //res.send(doc.img.data);
    //         post.findOneAndUpdate({
    //             id: parseInt(req.params.postId),
    //         }, {
    //             $set: {
    //                 title: req.body.title,
    //                 body: req.body.body,
    //                 forwardlinks: req.body.forwardlinks,
    //                 backlinks: req.body.backlinks
    //             }
    //         }, (err, data) => {
    //             if (err) return res.status(500).send(err);
    //             return res.json(
    //                 data
    //             );
    //         });
    //     });
    // })

    //End temporary store Image Base64 string into MediaUpload collection.

    post.findOneAndUpdate({
        id: parseInt(req.params.postId),
    }, {
        $set: {
            // forwardlinks: req.body.forwardlinks,
            // backlinks: req.body.backlinks
            userId: req.body.userId,
            posts: req.body.posts,
            comments: req.body.comments,
            settings: req.body.settings,
            title: req.body.title,
            body: req.body.body
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

        // postid.id = postid.id ? postid.id : 0;

        Object.keys(req.body).map(item => {
            if (!Object.keys(post.schema.tree).includes(item)) delete req.body[item]
        })

        req.body['id'] = postid.id ? postid.id : 0;

        var newpost = post(req.body);

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

exports.upload = (req, res) => {

    var form = new formidable.IncomingForm();
    form.uploadDir = FilePath;
    var FileName = [];
    var lstPostImages = [];

    //file upload path
    form.parse(req, function (err, fields, files) {

    });


    form.on('fileBegin', function (name, file) {
        var ext = file.name.substring(file.name.indexOf('.'), file.name.length);
        var NewName = GetNameFromDate();
        if (ext.indexOf('?') > -1) {
            ext = ext.substring(0, ext.indexOf('?'));
        };
        file.path = form.uploadDir + "/" + NewName + ext;
        path = file.path;
        FileName.push(NewName + ext);
    });

    form.on('end', function () {

        function uploader(i) {
            if (i < FileName.length) {
                var image = process.env.HostUrl + "/MediaUploads/" + FileName[i];
                lstPostImages.push(image);
                if ((i + 1) == FileName.length) {
                    res.json({
                        message: "Images Uploaded Successfully...",
                        images: lstPostImages
                    });
                } else {
                    uploader(i + 1);
                };
            }
        }
        uploader(0);
    });

}

exports.GetImage = (req, res) => {
    var File = FilePath + "/" + req.params.name;
    res.sendFile(File);

}

function GetNameFromDate() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var seconds = d.getSeconds();
    var minutes = d.getMinutes();
    var hour = d.getHours();
    var milisec = d.getMilliseconds();
    return curr_year.toString() + curr_month.toString() + curr_date.toString() + hour.toString() + minutes.toString() + seconds.toString() + milisec.toString();
}