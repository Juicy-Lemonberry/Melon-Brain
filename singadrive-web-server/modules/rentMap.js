const express = require('express');
const router = express.Router();

const postgresPool = require("../configs/postgresPool");
const VehicleStatusModel = require('../mongo_models/automobile/vehicleStatus')
//#region Get rentable Vehicles
async function getRentableVehicles() {
    const client = await postgresPool.connect();
    let query = `SELECT * FROM "automobile"."rentable_vehicles";`;
    const queryResult = await client.query(query);
    client.release();
    return queryResult.rows;
}

async function fetchVehicleStatus(regPlate) {
    const result = await VehicleStatusModel.findOne({
        registration_plate: regPlate
    });

    if (result) {
        return {
            "lat": result.lat,
            "lng": result.lng,
            "regPlate": result.registration_plate,
            "fuelLevel": result.fuel_level
        };
    } else {
        return null;
    }
}

router.get('/rentable-vehicles', async (req, res) => {
    try {
        const rentableVech = await getRentableVehicles();

        const vehicleInfoPromises = rentableVech.map(async vehicle =>  {
            const vechInfo = await fetchVehicleStatus(vehicle.registration_plate)
            if (vechInfo == null){
                return null;
            }

            vechInfo["modelID"] = vehicle.model_id;
            vechInfo["modelName"] = vehicle.model_name;
            vechInfo["manufacturerID"] = vehicle.manufacturer_id;
            vechInfo["manufacturerName"] = vehicle.manufacturer_name;
            vechInfo["fuelType"] = vehicle.fuel_type;
            vechInfo["category"] = vehicle.category;
            return vechInfo;
        });
        let vechicleInfos = await Promise.all(vehicleInfoPromises);
        // Remove vehicles without a status...
        // TODO: Warn if vehicles dont have status?
        vechicleInfos = vechicleInfos.filter(info => info !== null);
        res.status(200).json(vechicleInfos);
    } catch (error) {
        console.log("Error occured trying to fetch rentable Vech\n", error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
//#endregion

//#region Get user rented vehicle

async function getUserRentedVehicle(username) {
    const client = await postgresPool.connect();
    let query = `SELECT * FROM "automobile"."get_user_rented_vehicle"($1);`;
    const queryResult = await client.query(query, [username]);
    client.release();

    if (queryResult.rows.length <= 0){
        return null;
    }
    return queryResult.rows[0];
}

router.post('/get-rented-vehicle', async (req, res) => {
    const username = req.body.username;

    if (username == null) {
        res.status(400).json({ message: 'MISSING BODY FIELDS' });
        return;
    }

    try {
        const rentedVehicle = await getUserRentedVehicle(username);
        if (rentedVehicle == null) {
            console.log("No Rental...");
            res.status(200).json(null);
            return;
        }

        const vehicleStatus = await fetchVehicleStatus(rentedVehicle.registration_plate);
        rentedVehicle["lat"] = vehicleStatus.lat;
        rentedVehicle["lng"] = vehicleStatus.lng;
        rentedVehicle["regPlate"] = rentedVehicle.registration_plate;
        rentedVehicle["fuelLevel"] = vehicleStatus.fuelLevel;

        console.log(rentedVehicle);

        res.status(200).json(rentedVehicle);
    } catch (error) {
        console.log("Error occured trying to fetch currently rented vehicle\n", error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

//#endregion

//#region Rent Vehicle

async function rentVehicleRequest(sessionToken, browserInfo, registrationPlate) {
    const client = await postgresPool.connect();
    let query = `SELECT * FROM "automobile"."rent_vehicle"($1, $2, $3);`;
    const queryResult = await client.query(query, [sessionToken, browserInfo, registrationPlate]);
    client.release();

    if (queryResult.rows <= 0){
        return "FAILURE";
    }
    return queryResult.rows[0].message;
}

router.post('/rent-vehicle', async (req, res) => {
    const sessionToken = req.body.session_token;
    const registrationPlate = req.body.registration_plate;
    const browserInfo = req.body.browser_name;

    console.log([sessionToken, browserInfo, registrationPlate])
    console.log("Rent")
    if ([sessionToken, browserInfo, registrationPlate].some(item => item == null)) {
        res.status(400).json({ message: 'MISSING FIELDS' });
        return;
    }

    try {
        const resultMessage = await rentVehicleRequest(sessionToken, browserInfo, registrationPlate);
        console.log(resultMessage)
        res.status(200).json({ message: resultMessage });
    } catch (error) {
        console.log("Error occured trying to rent a vehicle\n", error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//#endregion

//#region end vehicle rental

async function endRentalRequest(sessionToken, browserInfo, registrationPlate) {
    const client = await postgresPool.connect();
    let query = `SELECT * FROM "automobile"."end_vehicle_rental"($1, $2, $3);`;
    const queryResult = await client.query(query, [sessionToken, browserInfo, registrationPlate]);
    client.release();

    if (queryResult.rows <= 0){
        return "FAILURE";
    }
    return queryResult.rows[0].message;
}

router.post('/end-vehicle-rental', async (req, res) => {
    const sessionToken = req.body.session_token;
    const registrationPlate = req.body.registration_plate;
    const browserInfo = req.body.browser_name;

    console.log([sessionToken, browserInfo, registrationPlate])
    console.log("end")

    if ([sessionToken, browserInfo, registrationPlate].some(item => item == null)) {
        res.status(400).json({ message: 'MISSING FIELDS' });
        return;
    }

    try {
        const resultMessage = await endRentalRequest(sessionToken, browserInfo, registrationPlate);
        console.log(resultMessage);
        res.status(200).json({ message: resultMessage });
    } catch (error) {
        console.log("Error occured trying to rent a vehicle\n", error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//#endregion

module.exports = router;