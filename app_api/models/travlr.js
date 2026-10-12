const mongoose = require('mongoose');

// Define the trip schema
const tripSchema = new mongoose.Schema({
    code: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    length: { type: String, required: true },
    start: { type: Date, required: true },
    resort: { type: String, required: true },
    perPerson: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },

    // Added rating field with validation
    rating: {
        type: Number,
        default: null,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        validate: {
            validator: value => value === null || Number.isInteger(value),
            message: 'Rating must be a whole number between 1 and 5'
        }
    }

});

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;