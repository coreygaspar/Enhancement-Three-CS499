const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - list all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();

    // Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if (!q) {  // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }

};

// GET: /trips/:TripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({ 'code': req.params.tripCode }) // Return single record
        .exec();

    // Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if (!q) {  // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }

};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save();

    if (!q) {
        return res
            .status(400)
            .json(err);
    } else {
        return res
            .status(201)
            .json(q);
    }
};

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    // Uncomment for debugging
    console.log(req.params);
    console.log(req.body);
    const q = await Model
        .findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            }
        )
        .exec();
    if (!q) { // Database returned no data
        return res
            .status(400)
            .json(err);
    } else { // Return resulting updated trip
        return res
            .status(201)
            .json(q);
    }
    // Uncomment the following line to show results of operation
    // on the console
    // console.log(q);
};

// PUT: /trips/:tripCode/rating - Updates a trip rating
const tripsRateTrip = async (req, res) => {

    // Get the submitted rating
    const rating = Number(req.body.rating);

    // Validate that the rating is a whole number between 1 and 5
    if (
        req.body.rating === undefined ||
        req.body.rating === null ||
        req.body.rating === '' ||
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
    ) {
        return res
            .status(400)
            .json({ message: 'Rating must be a whole number between 1 and 5' });
    }

    try {
        // Find the trip and update its rating
        const q = await Model
            .findOneAndUpdate(
                { code: req.params.tripCode },
                { $set: { rating: rating } },
                { new: true, runValidators: true }
            )
            .exec();

        // Check whether the trip exists
        if (!q) {
            return res
                .status(404)
                .json({ message: 'Trip not found' });
        }

        // Return the updated trip
        return res
            .status(200)
            .json(q);

    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Unable to update trip rating' });
    }
};

// DELETE: /trips/:tripCode - Deletes an existing Trip
const tripsDeleteTrip = async (req, res) => {
    const q = await Model
        .findOneAndDelete({ 'code': req.params.tripCode })
        .exec();

    if (!q) {
        return res
            .status(404)
            .json({ message: 'Trip not found' });
    } else {
        return res
            .status(200)
            .json(q);
    }
};


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip,
    tripsRateTrip
};