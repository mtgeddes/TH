const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Makes sure numbers given aren't more than 15.
function arrayLimit(val) {
  return val.length <= 15;
};

// Makes sure only numbers and letters are used.
function alphaNumeric(val){
  return /^[a-z0-9]+$/i.test(val);
};

// Makes sure range min number is lower or equal to max number.
function greaterThan(val) {
  return val[0] <= val[1];
};

// Create Schema
const FactoryNodeSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: [alphaNumeric, "Only letters and numbers are allowed. No spacing"]
    },
    numbers: {
      type: [Number],
      default: [],
      validate: [arrayLimit, "Too many numbers"]
    },
    range: {
      type: [Number],
      default: [0, 100],
      validate: [greaterThan, "Max must be greater than min"]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = FactoryNode = mongoose.model('FactoryNode', FactoryNodeSchema);


// To do: 
// 1) Clean up error messages to more clear and concise. 