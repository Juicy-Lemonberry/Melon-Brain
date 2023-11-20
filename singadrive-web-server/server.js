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
const forumVoteRoutes = require('./modules/forum/vote');
const forumTagRoutes = require('./modules/forum/tag');

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
app.use("/api/forum-vote", forumVoteRoutes);
app.use("/api/forum-tag", forumTagRoutes);

// TODO: Remove this once not under use....
app.get("/api/data", (req, res) => {
    res.json({
        "testman": ["test1", "test2", "welp"] 
    });
});

//#region Populate Vehicle Positioning on Start (TESTING)
const postgresPool = require('./configs/postgresPool');
const VehicleStatusModel = require('./mongo_models/automobile/vehicleStatus.js');
async function getAllVehicles() {

    const client = await postgresPool.connect();
    const result = await client.query('SELECT * FROM automobile.vehicle');

    client.release();
    return result.rows;
} 

const singaporeLocations = [
    { lat: 1.352083, lng: 103.819839 }, // Central Singapore
    { lat: 1.290270, lng: 103.851959 }, // Downtown Core
    { lat: 1.364420, lng: 103.991531 }, // Changi Airport
    { lat: 1.304833, lng: 103.831833 }, // Orchard Road
    { lat: 1.283000, lng: 103.860500 }, // Marina Bay
    { lat: 1.333115, lng: 103.742297 }, // Jurong West
    { lat: 1.349857, lng: 103.873729 }, // Ang Mo Kio
    { lat: 1.429463, lng: 103.835028 }, // Woodlands
    { lat: 1.394510, lng: 103.876174 }, // Bishan
    { lat: 1.318186, lng: 103.892353 }, // Clementi
    // chatgpt generate if needed lmao
];

// To create a small random deviation from the predefined locations...
function getRandomDeviation(maxDeviation = 0.001) {
    return Math.random() * (maxDeviation * 2) - maxDeviation;
}

async function populateVehiclePositioning() {
    const vehicles = await getAllVehicles();
    
    for (let i = 0; i < vehicles.length; ++i) {
        const currentPlate = vehicles[i].registration_plate;

        const vehicleStatus = await VehicleStatusModel.findOne({ registration_plate: currentPlate });

        if (!vehicleStatus) {
            const randomLocation = singaporeLocations[Math.floor(Math.random() * singaporeLocations.length)];

            const newVehicleStatus = {
                registration_plate: currentPlate,
                lat: randomLocation.lat + getRandomDeviation(),
                lng: randomLocation.lng + getRandomDeviation(),
                fuel_level: Math.random() * 100,
            };

            await VehicleStatusModel.create(newVehicleStatus);
        }
    }
}

//#endregion

app.listen(5000, () => {
    console.log("Server started on port 5000...");

    populateVehiclePositioning().then(() => {
        console.log("Populated MongoDB with vehicles.\n")
    }).catch((error) => {
        console.log(`Failed to populate MongoDB with vehicles :: ${error}\n`)
    });
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});