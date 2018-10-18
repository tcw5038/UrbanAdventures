'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {City} = require('./models');

const router = express.Router();
const passport = require('passport');
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate("jwt", { session: false });

// Post to register a new city

/*gets all cities regardless of user
router.get('/', (req, res) => {
  City
    .find()
    .then(cities => {
      res.json(cities.map(city => city.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});*/

//gets all cities for a given user
router.get('/', jwtAuth, (req, res) => {
  City
    .find({user:req.user.id})
    .then(cities => {
      res.json(cities.map(city => city.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


router.get('/:id', jwtAuth, (req, res) => {
  City
    .findById(req.params.id)
    .then(city => res.json(city.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

router.post('/', jwtAuth, (req, res) => {
  const requiredFields = ['cityName', 'country', 'yearVisited', 'notes', 'tags', 'location'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

console.log("HII", req.user.id)

  City
    .create({
      cityName: req.body.cityName,
      country: req.body.country,
      yearVisited: req.body.yearVisited,
      notes:req.body.notes,
      tags:req.body.tags,
      imageURL:req.body.imageURL,
      location:req.body.location,
      user:req.user.id
    })
    .then(city => res.status(201).json(city.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


router.delete('/:id', jwtAuth, (req, res) => {
  City
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


router.put('/:id', jwtAuth, (req, res) => {//commenting this out fixed the bad request, but didn't hurt anything else in my app
 if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['cityName', 'location', 'country', 'yearVisited', 'notes', 'tags', 'imageURL'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  City
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedcity => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


module.exports = {router};
