module.exports = (app, key) => {
    const dynamic = require('../controllers/dynamic.controller.js');

    //Create
    app.post(`/${key}`, dynamic.CreateRecord);

    //Update
    app.put(`/${key}/:_id`, dynamic.UpdateRecord);

    //Get
    app.get(`/${key}`, dynamic.GetRecord);

    //Get By Id
    app.get(`/${key}/:_id`, dynamic.GetRecordById);

    //Delete
    app.delete(`/${key}/:_id`, dynamic.DeleteRecord);


    //Static Route for Image Upload
    app.post('/upload', dynamic.UploadMedia);
    app.get('/MediaUploads/:name', dynamic.GetFile);
    //End Static Route for Image Upload


}