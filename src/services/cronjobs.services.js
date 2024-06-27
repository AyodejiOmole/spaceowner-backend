const {
  spaceseekerControllerMain
} = require('../controllers');

const { cronCancelled,
  cronCompleted, cronForDisabledToggling } = spaceseekerControllerMain;

// create a cron job to run every 24 hours
const cron = require('node-cron');

const task = cron.schedule('0 1,13 * * *', () => {
  cronCancelled();
  cronCompleted();
  cronForDisabledToggling();
});

module.exports = task;


