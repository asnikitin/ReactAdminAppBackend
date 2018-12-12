module.exports = (app) => {
    const posts = require('../controllers/post.controller.js');

    // Retrieve post (GET_LIST)
    app.get('/posts', posts.findAll);

    // update a post (UPDATE)
    app.put('/posts/:postId', posts.update);

    // delete post (DELETE)
    app.delete('/posts/:postId', posts.delete);

    //Retrieve post by id (GET_MANY)
    app.get('/posts/:postId', posts.getbyid);


}