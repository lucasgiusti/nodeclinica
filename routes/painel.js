
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    accountRoute = require("./account"),
    patientRoute = require("./patient");
//************************************************************


var Schema = mongoose.Schema;

// Session Model
var Painel = new Schema({
    pENA: { type: String, required: true },
    pENP: { type: String, required: true },
    pEOT: { type: String, required: true },
    pEUM: { type: String, required: true },
    pEH: { type: String, required: true },
    pESC: { type: String, required: true },
    pTNA: { type: String, required: true },
    pTNP: { type: String, required: true },
    pTOT: { type: String, required: true },
    pTUM: { type: String, required: true },
    pTH: { type: String, required: true },
    pTSC: { type: String, required: true },
    pANA: { type: String, required: true },
    pANP: { type: String, required: true },
    pAOT: { type: String, required: true },
    pAUM: { type: String, required: true },
    pAH: { type: String, required: true },
    pASC: { type: String, required: true }
});

var getPainelAll = function (req, res) {
    var idPatient = req.params.idPatient;


    Painel.pENA = "21";
    Painel.pENP = "22";
    Painel.pEOT = "31";
    Painel.pEUM = "11";
    Painel.pEH = "0";
    Painel.pESC = "15";
    Painel.pTNA = "21";
    Painel.pTNP = "22";
    Painel.pTOT = "31";
    Painel.pTUM = "11";
    Painel.pTH = "0";
    Painel.pTSC = "15";
    Painel.pANA = "21";
    Painel.pANP = "22";
    Painel.pAOT = "31";
    Painel.pAUM = "11";
    Painel.pAH = "0";
    Painel.pASC = "15";

    return res.send(Painel);

    /*
    return patientRoute.PatientModel.findById(idPatient, { _id: 1, name: 1, treatments: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
    */

};

module.exports.getPainelAll = getPainelAll;