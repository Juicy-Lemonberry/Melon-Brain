const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express()
app.use(bodyParser.json());
app.use(cors());

const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};

mongoose.connect(mongoConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const exampleRoutes = require('./modules/example');
const rentMapRoutes = require('./modules/rentMap');

const usersRoutes = require('./modules/user/users');
const usersPublicDataRoutes = require('./modules/user/public');
const usersProfileEditRoutes = require('./modules/user/edit');

const forumCategoryRoutes = require('./modules/forum/category');
const forumPostRoutes = require('./modules/forum/post');
const forumCommentRoutes = require('./modules/forum/comment');

// URL calls to '/api/example/...' will be passed to `modules/example.js'.
app.use("/api/example", exampleRoutes);

// NOTE: User related routes...
app.use("/api/public-users", usersPublicDataRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/users-edit", usersProfileEditRoutes);

// NOTE: Map related routes...
app.use("/api/rent-map", rentMapRoutes);

// NOTE: Forum related routes...
app.use("/api/forum-category", forumCategoryRoutes);
app.use("/api/forum-post", forumPostRoutes);
app.use("/api/forum-comment", forumCommentRoutes);

// TODO: Remove this once not under use....
app.get("/api/data", (req, res) => {
    res.json({
        "testman": ["test1", "test2", "welp"] 
    });
});

app.listen(5000, () => {
    console.log("Server started on port 5000...");
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});