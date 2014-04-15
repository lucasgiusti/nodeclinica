
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

// Session Model
var Session = new Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    teacherId: { type: String, required: true },
    teacherName: { type: String, required: true },
    typeSession: { type: String, required: true },
    typeService: { type: String, required: true },
    dateSchedulingStart: { type: Date, required: true },
    dateSchedulingEnd: { type: Date, required: true },
    everHeld: { type: Boolean, required: true },
    canceledSession: { type: Boolean, required: true },
    observations: { type: String, required: false },
    idTreatment: { type: String, required: true },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false }
});

// Treatment Model
var Treatment = new Schema({
    serviceArea: { type: String, required: true },
    diagnosis: { type: String, required: false },
    treatmentPerformed: { type: Boolean, required: true },
    canceledTreatment: { type: Boolean, required: true },
    doctor: { type: String, required: false },
    CRMDoctor: { type: String, required: false },
    observations: { type: String, required: false },
    idPatient: {type: String, required: true},
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false },
    sessions: [Session]
});

// Patient Mod  el
var Patient = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: false },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String, required: false },
    district: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    cep: { type: String, required: false },
    maritalStatus: { type: String, required: true },
    phone1: { type: String, required: true },
    dateBirth: { type: Date, required: true },
    sex: { type: String, required: true },
    phone2: { type: String, required: false },
    phone3: { type: String, required: false },
    cpf: { type: String, required: false },
    responsibleName: { type: String, required: false },
    responsibleCPF: { type: String, required: false },
    observations: { type: String, required: false },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false },
    treatments: [Treatment]
});

var PatientModel = mongoose.model('patients', Patient);

var validatePatient = function (res, patient) {

    if ((patient.name == null) || (patient.name != null && !iz.between(patient.name.trim().length, 1, 100))) {
        console.log('Error adding patient: o nome deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O nome deve ter 1 a 100 caracteres' });
        return false;
    }
    patient.name = patient.name.trim();

    if ((patient.address == null) || (patient.address != null && !iz.between(patient.address.trim().length, 1, 100))) {
        console.log('Error adding patient: o endereco deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O endereco deve ter 1 a 100 caracteres' });
        return false;
    }
    patient.address = patient.address.trim();

    if ((patient.number == null) || (patient.number != null && !iz.between(patient.number.trim().length, 1, 10))) {
        console.log('Error adding patient: o numero deve ter 1 a 10 caracteres');
        res.send('500', { status: 500, error: 'O numero deve ter 1 a 10 caracteres' });
        return false;
    }
    patient.number = patient.number.trim();

    if (!iz.maxLength(patient.complement, 20)) {
        console.log('Error adding patient: o complemento deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O complemento deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.complement == null)) { delete patient.complement; } else { patient.complement = patient.complement.trim();}

    if ((patient.district == null) || (patient.district != null && !iz.between(patient.district.trim().length, 1, 50))) {
        console.log('Error adding patient: o bairro deve ter 1 a 50 caracteres');
        res.send('500', { status: 500, error: 'O bairro deve ter 1 a 50 caracteres' });
        return false;
    }
    patient.district = patient.district.trim();
    
    if ((patient.state == null) || (patient.state != null && !iz.between(patient.state.trim().length, 1, 50))) {
        console.log('Error adding patient: estado invalido');
        res.send('500', { status: 500, error: 'Estado invalido' });
        return false;
    }
    patient.state = patient.state.trim();

    if ((patient.city == null) || (patient.city != null && !iz.between(patient.city.trim().length, 1, 50))) {
        console.log('Error adding patient: cidade invalida');
        res.send('500', { status: 500, error: 'Cidade invalida' });
        return false;
    }
    patient.city = patient.city.trim();

    if (!iz.maxLength(patient.cep, 9)) {
        console.log('Error adding patient: o cep deve ter maximo 9 caracteres');
        res.send('500', { status: 500, error: 'O cep deve ter maximo 9 caracteres' });
        return false;
    }
    if ((patient.cep == null)) { delete patient.cep; } else { patient.cep = patient.cep.trim();}

    if (patient.maritalStatus == null || patient.maritalStatus == '') {
        console.log('Error adding patient: estado civil invalido');
        res.send('500', { status: 500, error: 'Estado civil invalido' });
        return false;
    }
    patient.maritalStatus = patient.maritalStatus.trim();
    
    if ((patient.mail == null)) { delete patient.mail; } else { patient.mail = patient.mail.trim();}
    if ((patient.observations == null)) { delete patient.observations; } else { patient.observations = patient.observations.trim();}

    if ((patient.phone1 == null) || (patient.phone1 != null && !iz.between(patient.phone1.trim().length, 1, 20))) {
        console.log('Error adding user: o telefone 1 deve ter 1 a 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 1 deve ter 1 a 20 caracteres' });
        return false;
    }
    patient.phone1 = patient.phone1.trim();

    if (!iz(patient.dateBirth).required().date().valid) {
        console.log('Error adding patient: data de nascimento invalida');
        res.send('500', { status: 500, error: 'Data de nascimento invalida' });
        return false;
    }

    var dateBirth = new Date(patient.dateBirth.substring(0, 4), patient.dateBirth.substring(5, 7) - 1, patient.dateBirth.substring(8, 10));
    patient.dateBirth = dateBirth;

    if (patient.sex == null) {
        console.log('Error adding patient: sexo invalido');
        res.send('500', { status: 500, error: 'Sexo invalido' });
        return false;
    }
    patient.sex = patient.sex.trim();

    if (!iz.maxLength(patient.phone2, 20)) {
        console.log('Error adding patient: o telefone 2 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 2 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.phone2 == null)) { delete patient.phone2; } else { patient.phone2 = patient.phone2.trim();}

    if (!iz.maxLength(patient.phone3, 20)) {
        console.log('Error adding patient: o telefone 3 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 3 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.phone3 == null)) { delete patient.phone3; } else { patient.phone3 = patient.phone3.trim();}

    if ((patient.cpf == null || !utilRoute.validaCpf(patient.cpf)) && (patient.responsibleCPF == null || !utilRoute.validaCpf(patient.responsibleCPF))) {
        console.log('Error adding patient: um CPF valido deve ser informado para o paciente ou o responsavel');
        res.send('500', { status: 500, error: 'Um CPF valido deve ser informado para o paciente ou o responsavel' });
        return false;
    }
    if ((patient.cpf != null)) { patient.cpf = patient.cpf.trim(); }
    if ((patient.responsibleCPF == !null)) { patient.responsibleCPF = patient.responsibleCPF.trim(); }


    if (patient.responsibleName != null && !iz.maxLength(patient.responsibleName.trim(), 100)) {
        console.log('Error adding patient: o nome do responsavel deve ter maximo 100 caracteres');
        res.send('500', { status: 500, error: 'O nome do responsavel deve ter maximo 100 caracteres' });
        return false;
    }
    if ((patient.responsibleName == !null)) { patient.responsibleName = patient.responsibleName.trim(); }


    if (((patient.responsibleCPF != null && patient.responsibleCPF != '') && (patient.responsibleName == null || (patient.responsibleName != null && patient.responsibleName.trim() == '')))
        || ((patient.responsibleName != null && patient.responsibleName != '') && (patient.responsibleCPF == null || (patient.responsibleCPF != null && patient.responsibleCPF.trim() == '')))) {
        console.log('Error adding patient: caso tenha um responsavel, devem ser informados nome e CPF do mesmo');
        res.send('500', { status: 500, error: 'Caso tenha um responsavel, devem ser informados nome e CPF do mesmo' });
        return false;
    }

    if (!iz(patient.dateInclusion).required().date().valid) {
        console.log('Error adding patient: data de inclusao invalida');
        res.send('500', { status: 500, error: 'Data de inclusao invalida' });
        return false;
    }

    return true;

}

var putPatient = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var patient = req.body;
        delete patient._id;

        console.log('Updating patient');
        patient.dateUpdate = new Date();
        var objectID = new ObjectID(id);

        PatientModel = mongoose.model('patients', Patient);


        if (validatePatient(res, patient)) {

            if (patient.cpf) {

                PatientModel.findOne({ 'cpf': patient.cpf, '_id': { $nin: [objectID]} }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error updating patient: o CPF ja existe');
                            res.send('500', { status: 500, error: 'O CPF ja existe' });
                        }
                        else {
                            //UPDATE PATIENT

                            PatientModel.update({ '_id': id }, patient, { safe: true }, function (err, result) {
                                if (err) {
                                    console.log('Error updating patient: ' + err);
                                    res.send('500', { status: 500, error: err });
                                } else {
                                    console.log('' + result + ' document(s) updated');

                                    res.send(patient);
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.send('500', { status: 500, error: err });
                    }
                });
            }
            else {
                //UPDATE PATIENT
                PatientModel.update({ '_id': id }, patient, { safe: true }, function (err, result) {
                    if (err) {
                        console.log('Error updating patient: ' + err);
                        res.send('500', { status: 500, error: err });
                    } else {
                        console.log('' + result + ' document(s) updated');

                        res.send(patient);
                    }
                });
            }
        }
    }
}

var postPatient = function (req, res) {
    
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var patient = req.body;
        console.log('Adding patient');
        patient.dateInclusion = new Date();

        if (validatePatient(res, patient)) {

            PatientModel = mongoose.model('patients', Patient);
            if (patient.cpf) {
                PatientModel.findOne({ 'cpf': patient.cpf }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error adding patient: o CPF ja existe');
                            res.send('500', { status: 500, error: 'O CPF ja existe' });
                            return;
                        }
                        else {
                            //INSERT
                            delete patient._id;
                            delete patient.dateUpdate;
                            delete patient.treatments;
                            PatientModel = new PatientModel(patient);
                            PatientModel.save(function (err, patient, result) {
                                if (err) {
                                    console.log('Error inserting patient: ' + err);
                                    res.send('500', { status: 500, error: err });
                                } else {
                                    console.log('' + result + ' document(s) inserted');
                                    res.send(patient);
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.send('500', { status: 500, error: err });
                    }
                });
            }
            else {
                //INSERT
                delete patient._id;
                delete patient.dateUpdate;
                delete patient.treatments;
                PatientModel = new PatientModel(patient);
                PatientModel.save(function (err, patient, result) {
                    if (err) {
                        console.log('Error inserting patient: ' + err);
                        res.send('500', { status: 500, error: err });
                    } else {
                        console.log('' + result + ' document(s) inserted');
                        res.send(patient);
                    }
                });
            }
        }
    }
}

var delPatient = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        console.log('Deleting patient: ' + req.params.id);

        PatientModel = mongoose.model('patients', Patient);
        PatientModel.findOne({ '_id': req.params.id }, function (err, patient) {
            if (!err) {
                if (patient) {
                    if (patient.treatments.length > 0) {
                        res.send('500', { status: 500, error: 'Existe tratamento para este paciente' });
                    }
                    else {
                        patient.remove(function () { res.send(patient); });
                    }
                }
            }
            else {
                res.send('500', { status: 500, error: 'Usuario nao encontrado' });
            }
        });
    }
}

var getPatientsAll = function (req, res) {
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({}, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByName = function (req, res) {
    var name = req.params.name;
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({ 'name': { '$regex': name, $options: 'i' } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByCpf = function (req, res) {
    var cpf = req.params.cpf;
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({ 'cpf': { '$regex': cpf } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsById = function (req, res) {
    var id = req.params.id;
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.findById(id, {
        name: 1,
        mail: 1,
        address: 1,
        number: 1,
        complement: 1,
        district: 1,
        state: 1,
        city: 1,
        cep: 1,
        maritalStatus: 1,
        phone1: 1,
        dateBirth: 1,
        sex: 1,
        phone2: 1,
        phone3: 1,
        cpf: 1,
        responsibleName: 1,
        responsibleCPF: 1,
        observations: 1,
        dateInclusion: 1,
        dateUpdate: 1,
    }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByPainel = function (req, res) {
    var type = req.params.type;
    var serviceArea = '';

    if (type == 'pENA' || type == 'pTNA' || type == 'pANA') { serviceArea = 'NEURO ADULTO'; }
    if (type == 'pENP' || type == 'pTNP' || type == 'pANP') { serviceArea = 'NEURO PEDIATRIA'; }
    if (type == 'pEOT' || type == 'pTOT' || type == 'pAOT') { serviceArea = 'ORTOPEDIA TRAUMATOLOGIA'; }
    if (type == 'pEUM' || type == 'pTUM' || type == 'pAUM') { serviceArea = 'UROGENICOLOGIA MASTOLOGIA'; }
    if (type == 'pEH' || type == 'pTH' || type == 'pAH') { serviceArea = 'HIDROTERAPIA'; }
    if (type == 'pESC' || type == 'pTSC' || type == 'pASC') { serviceArea = 'SAUDE COLETIVA'; }


    PatientModel = mongoose.model('patients', Patient);

    
    if (type.substring(0, 2) == 'pE') {
        return PatientModel.find({ 'treatments.sessions': { $size: 0 }, 'treatments.serviceArea': serviceArea }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1, treatments: 1 }).sort({ name: 1 }).exec(function (err, patients) {
            if (!err) {
                return res.send(patients);
            } else {
                return console.log(err);
            }

        });
    }
    else if (type.substring(0, 2) == 'pT') {
        return PatientModel.find({ 'treatments.serviceArea': serviceArea, 'treatments.sessions.typeSession': 'TRIAGEM', 'treatments.sessions.everHeld': true, 'treatments.canceledTreatment': false, 'treatments.treatmentPerformed': false }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1, treatments: 1 }).sort({ name: 1 }).exec(function (err, patients) {
            if (!err) {
                    return res.send(patients);

            } else {
                return console.log(err);
            }

        });
    }
    else if (type.substring(0, 2) == 'pA') {
        return PatientModel.find({ 'treatments.serviceArea': serviceArea, 'treatments.sessions': { $size: 1 }, 'treatments.sessions.typeSession': 'TRIAGEM', 'treatments.sessions.everHeld': true, 'treatments.canceledTreatment': false, 'treatments.treatmentPerformed': false }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1, treatments: 1 }).sort({ name: 1 }).exec(function (err, patients) {
            if (!err) {
                return res.send(patients);

            } else {
                return console.log(err);
            }

        });
    }
};

module.exports.PatientModel = PatientModel;
module.exports.getPatientsAll = getPatientsAll;
module.exports.getPatientsByName = getPatientsByName;
module.exports.getPatientsByCpf = getPatientsByCpf;
module.exports.getPatientsById = getPatientsById;
module.exports.getPatientsByPainel = getPatientsByPainel;
module.exports.putPatient = putPatient;
module.exports.delPatient = delPatient;
module.exports.postPatient = postPatient;
module.exports.Treatment = Treatment;
module.exports.Patient = Patient;