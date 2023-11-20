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
        console.log(vechicleInfos);
        res.status(200).json(vechicleInfos);
    } catch (error) {
        console.log("Error occured trying to fetch rentable Vech\n", error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
//#endregion

module.exports = router;