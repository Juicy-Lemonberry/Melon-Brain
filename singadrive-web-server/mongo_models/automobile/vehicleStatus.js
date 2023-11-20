const mongoose = require('mongoose');

const vehicleStatusSchema = new mongoose.Schema({
  registration_plate: {
    type: String,
    maxlength: [8, 'Registration plate must not exceed 8 characters (Singapore Format)'],
    unique: true,
    required: [true, 'Registration plate is required'],
  },
  lat: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [1.16, 'Latitude must be at least 1.16'],
    max: [1.47, 'Latitude must not exceed 1.47']
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [103.59, 'Longitude must be at least 103.59'],
    max: [104.04, 'Longitude must not exceed 104.04']
  },  
  fuel_level: {
    type: Number,
    required: [true, 'Fuel level is required'],
    min: [0, 'Fuel level must be at least 0'],
    max: [100, 'Fuel level must not exceed 100']
  }
}, { timestamps: true });

const VehicleStatusModel = mongoose.model('vehicle_status', vehicleStatusSchema);
module.exports = VehicleStatusModel;