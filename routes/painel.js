
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


    var integerpENA = 0;
    var integerpENP = 0;
    var integerpEOT = 0;
    var integerpEUM = 0;
    var integerpEH = 0;
    var integerpESC = 0;
    var integerpTNA = 0;
    var integerpTNP = 0;
    var integerpTOT = 0;
    var integerpTUM = 0;
    var integerpTH = 0;
    var integerpTSC = 0;
    var integerpANA = 0;
    var integerpANP = 0;
    var integerpAOT = 0;
    var integerpAUM = 0;
    var integerpAH = 0;
    var integerpASC = 0;

    var pintegerpENA = 0;
    var pintegerpENP = 0;
    var pintegerpEOT = 0;
    var pintegerpEUM = 0;
    var pintegerpEH = 0;
    var pintegerpESC = 0;
    var pintegerpTNA = 0;
    var pintegerpTNP = 0;
    var pintegerpTOT = 0;
    var pintegerpTUM = 0;
    var pintegerpTH = 0;
    var pintegerpTSC = 0;
    var pintegerpANA = 0;
    var pintegerpANP = 0;
    var pintegerpAOT = 0;
    var pintegerpAUM = 0;
    var pintegerpAH = 0;
    var pintegerpASC = 0;


    return patientRoute.PatientModel.find(function (err, patients) {
        if (!err) {

            for (var i = 0; i < patients.length; i++) {

                pintegerpENA = 0; pintegerpENP = 0;
                pintegerpEOT = 0; pintegerpEUM = 0; pintegerpEH = 0; pintegerpESC = 0;
                pintegerpTNA = 0; pintegerpTNP = 0; pintegerpTOT = 0; pintegerpTUM = 0;
                pintegerpTH = 0; pintegerpTSC = 0; pintegerpANA = 0; pintegerpANP = 0;
                pintegerpAOT = 0; pintegerpAUM = 0; pintegerpAH = 0; pintegerpASC = 0;



                if (patients[i].treatments != null) {
                    
                    for (var y = 0; y < patients[i].treatments.length; y++) {
                        
                        if (!patients[i].treatments[y].treatmentPerformed && !patients[i].treatments[y].canceledTreatment) {

                            if (patients[i].treatments[y].sessions.length > 0) {

                                for (var z = 0; z < patients[i].treatments[y].sessions.length; z++) {

                                    if (!patients[i].treatments[y].sessions[z].canceledSession) {

             
                                        if (patients[i].treatments[y].sessions[z].typeSession == "TRIAGEM" && patients[i].treatments[y].sessions[z].everHeld) {
                                            if (patients[i].treatments[y].serviceArea == "NEURO ADULTO") {
                                                pintegerpTNA = 1;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "NEURO PEDIATRIA") {
                                                pintegerpTNP = 1;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "ORTOPEDIA TRAUMATOLOGIA") {
                                                pintegerpTOT = 1;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "UROGENICOLOGIA MASTOLOGIA") {
                                                pintegerpTUM = 1;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "HIDROTERAPIA") {
                                                pintegerpTH = 1;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "SAUDE COLETIVA") {
                                                pintegerpTSC = 1;
                                            }
                                        }

                                        if (!patients[i].treatments[y].sessions[z].everHeld) {
                                            if (patients[i].treatments[y].serviceArea == "NEURO ADULTO") {
                                                pintegerpANA = 1;
                                                pintegerpTNA = 0;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "NEURO PEDIATRIA") {
                                                pintegerpANP = 1;
                                                pintegerpTNP = 0;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "ORTOPEDIA TRAUMATOLOGIA") {
                                                pintegerpAOT = 1;
                                                pintegerpTOT = 0;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "UROGENICOLOGIA MASTOLOGIA") {
                                                pintegerpAUM = 1;
                                                pintegerpTUM = 0;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "HIDROTERAPIA") {
                                                pintegerpAH = 1;
                                                pintegerpTH = 0;
                                            }
                                            else if (patients[i].treatments[y].serviceArea == "SAUDE COLETIVA") {
                                                pintegerpASC = 1;
                                                pintegerpTSC = 0;
                                            }

                                            break;
                                        }

                                    }
                                }
                                if (pintegerpENA > 0 || pintegerpENP > 0 || pintegerpEOT > 0 || pintegerpEUM > 0 ||
                                        pintegerpEH > 0 || pintegerpESC > 0 || pintegerpTNA > 0 || pintegerpTNP > 0 ||
                                        pintegerpTOT > 0 || pintegerpTUM > 0 || pintegerpTH > 0 || pintegerpTSC > 0 ||
                                        pintegerpANA > 0 || pintegerpANP > 0 || pintegerpAOT > 0 || pintegerpAUM > 0 ||
                                        pintegerpAH > 0 || pintegerpASC > 0) {
                                    break;
                                }
                            }
                            else {
                                if (patients[i].treatments[y].serviceArea == "NEURO ADULTO") {
                                    pintegerpENA++;
                                }
                                else if (patients[i].treatments[y].serviceArea == "NEURO PEDIATRIA") {
                                    pintegerpENP++;
                                }
                                else if (patients[i].treatments[y].serviceArea == "ORTOPEDIA TRAUMATOLOGIA") {
                                    pintegerpEOT++;
                                }
                                else if (patients[i].treatments[y].serviceArea == "UROGENICOLOGIA MASTOLOGIA") {
                                    pintegerpEUM++;
                                }
                                else if (patients[i].treatments[y].serviceArea == "HIDROTERAPIA") {
                                    pintegerpEH++;
                                }
                                else if (patients[i].treatments[y].serviceArea == "SAUDE COLETIVA") {
                                    pintegerpESC++;
                                }
                            }

                        }

                    }
                }

                integerpENA += pintegerpENA;
                integerpENP += pintegerpENP;
                integerpEOT += pintegerpEOT;
                integerpEUM += pintegerpEUM;
                integerpEH += pintegerpEH;
                integerpESC += pintegerpESC;
                integerpTNA += pintegerpTNA;
                integerpTNP += pintegerpTNP;
                integerpTOT += pintegerpTOT;
                integerpTUM += pintegerpTUM;
                integerpTH += pintegerpTH;
                integerpTSC += pintegerpTSC;
                integerpANA += pintegerpANA;
                integerpANP += pintegerpANP;
                integerpAOT += pintegerpAOT;
                integerpAUM += pintegerpAUM;
                integerpAH += pintegerpAH;
                integerpASC += pintegerpASC;
            }


            Painel.pENA = integerpENA;
            Painel.pENP = integerpENP;
            Painel.pEOT = integerpEOT;
            Painel.pEUM = integerpEUM;
            Painel.pEH = integerpEH;
            Painel.pESC = integerpESC;
            Painel.pTNA = integerpTNA;
            Painel.pTNP = integerpTNP;
            Painel.pTOT = integerpTOT;
            Painel.pTUM = integerpTUM;
            Painel.pTH = integerpTH;
            Painel.pTSC = integerpTSC;
            Painel.pANA = integerpANA;
            Painel.pANP = integerpANP;
            Painel.pAOT = integerpAOT;
            Painel.pAUM = integerpAUM;
            Painel.pAH = integerpAH;
            Painel.pASC = integerpASC;



            
            return res.send(Painel);
        } else {
            return console.log(err);
        }
    });
    

};

module.exports.getPainelAll = getPainelAll;