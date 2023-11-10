const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());
app.use(cors());

const exampleRoutes = require('./modules/example');
const rentMapRoutes = require('./modules/rentMap');

const usersRoutes = require('./modules/user/users');
const usersPublicDataRoutes = require('./modules/user/public');
const usersProfileEditRoutes = require('./modules/user/edit');

const forumCategoryRoutes = require('./modules/forum/category');
const forumPostRoutes = require('./modules/forum/post');

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

// TODO: Remove this once not under use....
app.get("/api/data", (req, res) => {
    res.json({
        "testman": ["test1", "test2", "welp"] 
    });
});

app.listen(5000, () => {
    console.log("Server started on port 5000...");
});
