'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');//double check that these paths are right
const { City } = require('../cities');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);


function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database');
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  function seedCityData() {
    console.info('seeding city data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
      seedData.push({
        cityName: faker.address.city() ,
        country: faker.address.country() ,
        yearVisited: faker.random.number(),
        notes: faker.lorem.paragraph(),
        tags: [],
        imageURL: faker.image.imageUrl(),
        location:{
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
          },
          user: faker.random.number(),
      });
    }
    return City.insertMany(seedData);
  }



describe('Cities API resource', function () {
    
    before(function () {
        return runServer(TEST_DATABASE_URL);
      });
    
      beforeEach(function () {
        return seedCityData();
      });
    
      afterEach(function () {
        return tearDownDb();
      });
    
      after(function () {
        return closeServer();
      });

    describe('GET endpoint', function(){

    it('should return cities with right fields', function () {  
        let resCity;
        return chai.request(app)
          .get('/cities')
          .then(function (res) {
  
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.lengthOf.at.least(1);
  
            res.body.forEach(function (city) {
              city.should.be.a('object');
              city.should.include.keys('id','cityName', 'country', 'yearVisited', 'notes', 'tags', 'imageURL', 'location', 'user');
            });
            // just check one of the citys that its values match with those in db
            // and we'll assume it's true for rest
            resCity = res.body[0];
            return City.findById(resCity.id);
          })
          .then(city => {
            resCity.cityName.should.equal(city.cityName);
            resCity.country.should.equal(city.country);
            resCity.yearVisited.should.equal(city.yearVisited);
            resCity.notes.should.equal(city.notes);
            resCity.tags.should.equal(city.tags);
            resCity.imageURL.should.equal(city.imageURL);
            resCity.location.should.equal(city.location);
          });
      });
    });
    describe('POST endpoint', function () {
        it('should add a new city', function () {
    
           const newCity = { 
            cityName: faker.address.city() ,
            country: faker.address.country() ,
            yearVisited: faker.random.number(),
            notes: faker.lorem.paragraph(),
            tags: [],
            imageURL: faker.image.imageUrl(),
            location:{
                lat: faker.address.latitude(),
                lng: faker.address.longitude()
              }
            }
    
          return chai.request(app)
            .post('/cities')
            .send(newCity)
            .then(function (res) {
              res.should.have.status(201);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.include.keys(
                'id', 'cityName', 'country', 'yearVisited', 'notes', 'tags', 'imageURL', 'location');
              //  Mongo should have created id on insertion
              res.body.id.should.not.be.null;
              res.body.cityName.should.equal(newCity.cityName);
              return City.findById(res.body.id);
            })
            .then(function (city) {
              city.cityName.should.equal(newCity.cityName);
              city.country.should.equal(newCity.country);
              city.yearVisited.should.equal(newCity.yearVisited);
              city.notes.should.equal(newCity.notes);
              city.tags.should.equal(newCity.tags);
              city.imageURL.should.equal(newCity.imageURL);
              city.location.should.equal(newCity.location);
            });
        });
      });
      describe('PUT endpoint', function () {
        it('should update fields you send over', function () {
          const updateData = {
         cityName: 'updatedCity' ,
            country: 'updatedCountry' ,
            yearVisited: '100',
            notes: 'updatedNotes',
            tags: [],
            imageURL: 'updatedImageURL',
            location:{
                lat: '93283232',
                lng: '34893934'
              }
          };
    
          return City
            .findOne()
            .then(city => {
              updateData.id = city.id;
    
              return chai.request(app)
                .put(`/cities/${city.id}`)
                .send(updateData);
            })
            .then(res => {
              res.should.have.status(204);
              return City.findById(updateData.id);
            })
            .then(city => {
              city.cityName.should.equal(updateData.cityName);
              city.country.should.equal(updateData.country);
              city.yearVisited.should.equal(updateData.yearVisited);
              city.notes.should.equal(updateData.notes);
              city.tags.should.equal(updateData.tags);
              city.imageURL.should.equal(updateData.imageURL);
              city.location.should.equal(updateData.location);
            });
        });
      });
    
      describe('DELETE endpoint', function () {
        it('should delete a city by id', function () {
          let city;
    
          return City
            .findOne()
            .then(_city => {
              city = _city;
              return chai.request(app).delete(`/cities/${city.id}`);
            })
            .then(res => {
              res.should.have.status(204);
              return City.findById(city.id);
            })
            .then(_city => {
              should.not.exist(_city);
            });
        });
      });
    });
    