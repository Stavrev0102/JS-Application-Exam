
const Animal = require('../models/Animal');

exports.create = (animalData) => Animal.create(animalData) 

exports.getAll = () => Animal.find().populate('owner');

exports.getById = (animalId) => Animal.findById(animalId);

exports.delete = (animalId) => Animal.findByIdAndDelete(animalId);

exports.edit = (animalId,animalData) => Animal.findByIdAndUpdate(animalId,animalData); 