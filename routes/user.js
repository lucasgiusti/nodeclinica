
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose');

//************************************************************


//************************************************************
var Schema = mongoose.Schema;

// User Model
var User = new Schema({
    name: { type: String, required: true },
    mail: { type: String, index: { unique: true} },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String, required: false },
    district: { type: String, required: false },
    state: { type: String, required: true },
    city: { type: String, required: true },
    cep: { type: String, required: false },
    registration: { type: String, required: true },
    phone1: { type: String, required: false },
    active: { type: Boolean, required: true },
    rg: { type: String, required: false },
    phone2: { type: String, required: false },
    phone3: { type: String, required: false },
    cpf: { type: String, index: { unique: true} },
    type: { type: String, required: true },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false }
});

var UserModel = mongoose.model('users', User);