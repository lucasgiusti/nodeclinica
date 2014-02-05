
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz');
//************************************************************


var Schema = mongoose.Schema;

// Patient Model
var Patient = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true }
});

var PatientModel = mongoose.model('patients', Patient);

var getPatientsAll = function (req, res) {
    return PatientModel.find({}, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByName = function (req, res) {
    var name = req.params.name;
    return PatientModel.find({ 'name': { '$regex': name, $options: 'i'} }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByCpf = function (req, res) {
    var cpf = req.params.cpf;
    return PatientModel.find({ 'cpf': { '$regex': cpf} }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsById = function (req, res) {
    var id = req.params.id;
    return PatientModel.findById(id, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

module.exports.PatientModel = PatientModel;
module.exports.getPatientsAll = getPatientsAll;
module.exports.getPatientsByName = getPatientsByName;
module.exports.getPatientsByCpf = getPatientsByCpf;
module.exports.getPatientsById = getPatientsById;