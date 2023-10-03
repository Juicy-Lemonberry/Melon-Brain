const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};


router.get('/rentable-cars', async (req, res) => {
  try {
    // TODO: Populate from MongoDB once we have an API
    // to feed data into it.
    let carLocations = [
      {
        location: [1.3526, 103.9449], // Near Changi Airport
        name: "Toyota",
        model: "Camry"
      },
      {
        location: [1.3032, 103.8535], // Near Orchard Road
        name: "Honda",
        model: "Civic"
      },
      {
        location: [1.2794, 103.8580], // Near Sentosa
        name: "Nissan",
        model: "Altima"
      },
      {
        location: [1.3404, 103.7756], // Near Singapore Zoo
        name: "Hyundai",
        model: "Elantra"
      },
      {
        location: [1.3483, 103.6831], // Near Nanyang Technological University
        name: "Mazda",
        model: "3"
      }
    ];

    res.status(200).json({ 'result': carLocations });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
