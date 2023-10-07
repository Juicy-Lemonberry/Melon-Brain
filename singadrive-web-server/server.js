const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());
app.use(cors());

const exampleRoutes = require('./modules/example');
const usersRoutes = require('./modules/users');
const rentMapRoutes = require('./modules/rentMap');
const usersPublicDataRoutes = require('./modules/publicUsers');

// URL calls to '/api/example/...' will be passed to `modules/example.js'.
app.use("/api/example", exampleRoutes);

app.use("/api/public-users", usersPublicDataRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/rent-map", rentMapRoutes);

// TODO: Remove this once not under use....
app.get("/api/data", (req, res) => {
    res.json({
        "testman": ["test1", "test2", "welp"] 
    });
});

app.listen(5000, () => {
    console.log("Server started on port 5000...");
});
