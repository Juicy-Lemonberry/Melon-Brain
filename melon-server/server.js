const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors());

app.get("/api/data", (req, res) => {
    res.json({
        "testman": ["test1", "test2", "oofem"] 
    });
});

app.listen(5000, () => {
    console.log("Server started on port 5000...");
});