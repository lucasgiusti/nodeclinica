
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    accountRoute = require("./account"),
    utilRoute = require("./util");
//************************************************************


var Schema = mongoose.Schema;

// Treatment Model
var Treatment = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: false },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String, required: false },
    district: { type: String, required: false },
    state: { type: String, required: true },
    city: { type: String, required: true },
    cep: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    phone1: { type: String, required: false },
    dateBirth: { type: Date, required: true },
    sex: { type: String, required: true },
    phone2: { type: String, required: false },
    phone3: { type: String, required: false },
    cpf: { type: String, required: false },
    responsibleName: { type: String, required: false },
    responsibleCPF: { type: String, required: false },
    observations: { type: String, required: false },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false }
});

var TreatmentModel = mongoose.model('treatments', Treatment);

var validateTreatment = function (res, treatment) {

    if ((treatment.name == null) || (treatment.name != null && !iz.between(treatment.name.length, 1, 100))) {
        console.log('Error adding treatment: o nome deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O nome deve ter 1 a 100 caracteres' });
        return false;
    }

    if ((treatment.address == null) || (treatment.address != null && !iz.between(treatment.address.length, 1, 100))) {
        console.log('Error adding treatment: o endereco deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O endereco deve ter 1 a 100 caracteres' });
        return false;
    }

    if ((treatment.number == null) || (treatment.number != null && !iz.between(treatment.number.length, 1, 10))) {
        console.log('Error adding treatment: o numero deve ter 1 a 10 caracteres');
        res.send('500', { status: 500, error: 'O numero deve ter 1 a 10 caracteres' });
        return false;
    }

    if (!iz.maxLength(treatment.complement, 20)) {
        console.log('Error adding treatment: o complemento deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O complemento deve ter maximo 20 caracteres' });
        return false;
    }
    if ((treatment.complement == null)) { delete treatment.complement; }

    if (!iz.maxLength(treatment.district, 50)) {
        console.log('Error adding treatment: o bairro deve ter maximo 50 caracteres');
        res.send('500', { status: 500, error: 'O bairro deve ter maximo 50 caracteres' });
        return false;
    }
    if ((treatment.district == null)) { delete treatment.district; }

    if ((treatment.state == null) && (treatment.state != null && !iz.between(treatment.state.length, 1, 50))) {
        console.log('Error adding treatment: estado invalido');
        res.send('500', { status: 500, error: 'Estado invalido' });
        return false;
    }

    if ((treatment.city == null) && (treatment.city != null && !iz.between(treatment.city.length, 1, 50))) {
        console.log('Error adding treatment: cidade invalida');
        res.send('500', { status: 500, error: 'Cidade invalida' });
        return false;
    }

    if (!iz.maxLength(treatment.cep, 9)) {
        console.log('Error adding treatment: o cep deve ter maximo 9 caracteres');
        res.send('500', { status: 500, error: 'O cep deve ter maximo 9 caracteres' });
        return false;
    }
    if ((treatment.cep == null)) { delete treatment.cep; }

    if ((treatment.maritalStatus == null)) { delete treatment.maritalStatus; }
    if ((treatment.mail == null)) { delete treatment.mail; }
    if ((treatment.responsibleName == null)) { delete treatment.responsibleName; }
    if ((treatment.responsibleCPF == null)) { delete treatment.responsibleCPF; }
    if ((treatment.observations == null)) { delete treatment.observations; }

    if (!iz.maxLength(treatment.phone1, 20)) {
        console.log('Error adding treatment: o telefone 1 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 1 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((treatment.phone1 == null)) { delete treatment.phone1; }

    console.log(treatment.dateBirth);
    if (!iz(treatment.dateBirth).required().date().valid) {
        console.log('Error adding treatment: data de nascimento invalida');
        res.send('500', { status: 500, error: 'Data de nascimento invalida' });
        return false;
    }

    if (treatment.sex == null) {
        console.log('Error adding treatment: sexo invalido');
        res.send('500', { status: 500, error: 'Sexo invalido' });
        return false;
    }

    if (!iz.maxLength(treatment.phone2, 20)) {
        console.log('Error adding treatment: o telefone 2 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 2 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((treatment.phone2 == null)) { delete treatment.phone2; }

    if (!iz.maxLength(treatment.phone3, 20)) {
        console.log('Error adding treatment: o telefone 3 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 3 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((treatment.phone3 == null)) { delete treatment.phone3; }

    if ((treatment.cpf == null || !utilRoute.validaCpf(treatment.cpf)) && (treatment.responsibleCPF == null || !utilRoute.validaCpf(treatment.responsibleCPF))) {
        console.log('Error adding treatment: um CPF valido deve ser informado para o paciente ou o responsavel');
        res.send('500', { status: 500, error: 'Um CPF valido deve ser informado para o paciente ou o responsavel' });
        return false;
    }

    if (treatment.responsibleCPF != null || treatment.resposibleName != null) {
        console.log('Error adding treatment: caso tenha um responsavel, devem ser informados nome e CPF do mesmo');
        res.send('500', { status: 500, error: 'Caso tenha um responsavel, devem ser informados nome e CPF do mesmo' });
        return false;
    }

    if (!iz(treatment.dateInclusion).required().date().valid) {
        console.log('Error adding treatment: data de inclusao invalida');
        res.send('500', { status: 500, error: 'Data de inclusao invalida' });
        return false;
    }

    return true;

}


var getTreatmentsAll = function (req, res) {
    return TreatmentModel.find({}, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, treatments) {
        if (!err) {
            return res.send(treatments);
        } else {
            return console.log(err);
        }
    });
};

module.exports.TreatmentModel = TreatmentModel;
module.exports.getTreatmentsAll = getTreatmentsAll;