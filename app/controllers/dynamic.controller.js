const models = require('../models/dynamic.model.js');
var path = require('path');
var FilePath = path.join(__dirname, '../../MediaUploads');

const withGallery = (data) => {
  const nextData =  data.map(item => {
    const { gallery } = item;
    return {
      ...item._doc,
      image: gallery[0].src[0],
    };
  });
  console.log(nextData);
  return nextData;
};


exports.CreateRecord = (req, res) => {

    //Get Url
    var n = req.url.lastIndexOf('/');
    var result = req.url.substring(n + 1);

    //Set Model
    var Model = models[result];

    //remove unnecessary fields according Models
    Object.keys(req.body).map(item => {
        if (!Object.keys(Model.schema.tree).includes(item)) delete req.body[item]
    });

    if (!isEmptyObject(req.body)) {
        Model(req.body).save((err, data) => {
            if (err) return res.status(500).send(err);
            data.id = data._id;
            console.log(data);
            Model.findByIdAndUpdate(
                data._id,
                data, {
                    new: true
                },
                (err, resdata) => {
                    if (err) return res.status(500).send(err);
                    return res.send(resdata);
                }
            )
            // Model.findOne(data)
            //     .then(resdata => {
            //         res.send(resdata);
            //     }).catch(err => {
            //         res.status(500).send({
            //             message: err.message || `Some error occurred while retrieving ${result}`
            //         });
            //     });
        });
    } else {
        res.status(500).send({
            message: "Wrong parameters or fields"
        });
    }

}

exports.UpdateRecord = (req, res) => {

    //Get Url
    var n = req.url.split('/');
    var result = n[n.length - 2];

    //Set Model
    var Model = models[result];

    //remove unnecessary fields according Models
    Object.keys(req.body).map(item => {
        if (!Object.keys(Model.schema.tree).includes(item)) delete req.body[item]
    });

    Model.findByIdAndUpdate(
        req.params._id,
        req.body, {
            new: true
        },
        (err, data) => {
            if (err) return res.status(500).send(err);
            return res.send(data);
        }
    )


}

exports.GetRecord = (req, res) => {

    //Get Url
    var n = req.path.lastIndexOf('/');
    var result = req.path.substring(n + 1);

    //Set Model
    var Model = models[result];

    //Filter data
    var sortObject = {};
    var stype = req.query._sort;
    var sdir = '';
    if (req.query._order == 'ASC')
        sdir = 1;
    else
        sdir = -1;
    sortObject[stype] = sdir;

    Model.find({}, null, {
            skip: parseInt(req.query._start),
            limit: parseInt(req.query._end),
            sort: sortObject
        })
        .then(data => {
            Model.countDocuments({}).then(count => {
                res.setHeader('X-Total-Count', count);
                res.json(withGallery(data));
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || `Some error occurred while retrieving ${result}`
            });
        });

}

exports.GetRecordById = (req, res) => {

    //Get Url
    var n = req.url.split('/');
    var result = n[n.length - 2];

    //Set Model
    var Model = models[result];

    Model.findOne({
            id: req.params._id
        })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || `Some error occurred while retrieving ${result}`
            });
        });


}

exports.DeleteRecord = (req, res) => {

    //Get Url
    var n = req.url.split('/');
    var result = n[n.length - 2];

    //Set Model
    var Model = models[result];

    Model.deleteOne({
        id: req.params._id
    }, (err, resp) => {
        if (err) return res.status(500).send(err);
        res.send({
            id: req.params._id
        });
    });


}

//-------- Static Route for Image Upload ------------
exports.UploadMedia = (req, res) => {

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

exports.GetFile = (req, res) => {
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
//-------- End Static Route for Image Upload ---------

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
