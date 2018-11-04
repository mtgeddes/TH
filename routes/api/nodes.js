
const express = require('express');
const router = express.Router();

// Item Model
const FactoryNode = require('../../models/FactoryNodeSchema');


// @route   GET /api
// @desc    get all items
router.get('/', (req, res) => {

  FactoryNode.find()
    .sort({ date: -1 })
    .then(data => res.json(data))
    .catch(err => res.status(404).json({ success: false, error: err }));

}); 

// @route   POST /api
// @desc    Create a FactoryNode
router.post('/addNode', (req, res) => {
    
  const name = req.body.name;
  const newFactoryNode = new FactoryNode({
    name: name           
  });

  newFactoryNode
    .save()
    .then(factoryNode => res.json(factoryNode));

}); 

// @route   UPDATE /api/updateData
// @desc    Update name of FactorNodes
router.post('/updateName', (req, res) => {

  const { id, name } = req.body;
  
  FactoryNode.findByIdAndUpdate(id, {name: name}, { runValidators: true })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false, error: err }));

}); 

// @route   UPDATE /api
// @desc    Add/Update Children
router.post('/updateNumbers', (req, res) => {
  
  const { id, numbers } = req.body;

  FactoryNode.findByIdAndUpdate(id, {numbers: numbers}, { runValidators: true })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false, error: err.errors.numbers.message }));

}); 

// @route   UPDATE /api
// @desc    Add/Update min && max for range
router.post('/updateRange', (req, res) => {
    
  const { id, range } = req.body;

  FactoryNode.findByIdAndUpdate(id, {range: range}, { runValidators: true })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false, error: err }));

}); 

// @route   DELETE /api/:id
// @desc    Delete A Item
router.delete('/deleteData/:id', (req, res) => {

  const id  = req.params.id;

  FactoryNode.findByIdAndDelete(id)
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false, error: err }));

}); 


// To do: 
// 1) Maybe reshape routes.
// 2) Reshape error messages

module.exports = router;