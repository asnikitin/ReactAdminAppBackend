module.exports = (app) => {
    const posts = require('../controllers/post.controller.js');

    // Retrieve post (GET_LIST)
    app.get('/post', posts.findAll);

    // update a post (UPDATE)
    app.put('/post/:postId', posts.update);

    // delete post (DELETE)
    app.delete('/post/:postId', posts.delete);

    //Retrieve post by id (GET_MANY)
    app.get('/post/:postId', posts.getbyid);

    //Retrieve post by userid (GET_MANY_REFERENCE)
    app.get('/post/author/:userId', posts.getbyuserid);

}