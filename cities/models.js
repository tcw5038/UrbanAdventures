'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CitySchema = mongoose.Schema({
  cityName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true
  },
  yearVisited: {type: Number, default: ''},
  notes: {type: String, default: ''},
  tags: {type: Array, default: [] },
  imageURL: {type:String, default: ''}
});

CitySchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};


const City = mongoose.model('City', CitySchema);

module.exports = {City};
