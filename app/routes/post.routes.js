module.exports = (app) => {
    const posts = require('../controllers/post.controller.js');

    // create post (CREATE)
    app.post('/posts', posts.create);

    // Retrieve post (GET_LIST)
    app.get('/posts', posts.findAll);

    // update a post (UPDATE)
    app.put('/posts/:postId', posts.update);

    // delete post (DELETE)
    app.delete('/posts/:postId', posts.delete);

    //Retrieve post by id (GET_MANY)
    app.get('/posts/:postId', posts.getbyid);

    // upload image
    app.post('/upload', posts.upload);

    app.get('/MediaUploads/:name', posts.GetImage);


}