var mongoose = require('mongoose');

// const industry1 = require('../crud/modals/industry.')

const softskill1 = require('../crud/modals/softskill')
const language1 = require('../crud/modals/language')
var User1 = require('../crud/modals/user');
const db = require('./config/db.js');
const { findOneAndReplace } = require('../crud/modals/industry');
;






mongoose.connect("mongodb://127.0.0.1:27017/gig?readPreference=primary&directConnection=true&ssl=false", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongo connection open!!!!");
    })
    .catch((err) => {
        console.log(err);
    });




const softskill = [
    {

        "skill": "leadership"
    },
    {
        "skill": "learning"
    },
    {

        "skill": "communication"
    },
    {

        "skill": "organizational "
    }
];



const language = [
    {
        "languages": "English"
    },
    {
        "languages": "Hindi"
    },
    {
        "languages": "french"
    },

];





const seedProfiles = async () => {
    // await industry1.deleteMany({})
    // await industry1.insertMany(industry)
    await softskill1.deleteMany({})
    await softskill1.insertMany(softskill)
    // await hardskill1.deleteMany({})
    // await hardskill1.insertMany(a)
    await language1.deleteMany({})
    await language1.insertMany(language)
};


seedProfiles().then(() => {
    mongoose.connection.close();
})
