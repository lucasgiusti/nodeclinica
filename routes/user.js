
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    utilRoute = require("./util"),
    accountRoute = require("./account");
//************************************************************


var AccountModel = accountRoute.AccountModel;
var validaCpf = utilRoute.validaCpf;


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

var validateUser = function (res, user) {

    if (!(iz(user.type).required().equal('ALUNO').valid
        || iz(user.type).required().equal('PROFESSOR').valid
        || iz(user.type).required().equal('ATENDENTE').valid
        || iz(user.type).required().equal('GESTOR').valid)) {
        console.log('Error adding user: tipo de usuario invalido');
        res.send('500', { status: 500, error: 'Tipo de usuario invalido' });
        return false;
    }

    if ((user.name == null) || (user.name != null && !iz.between(user.name.length, 1, 100))) {
        console.log('Error adding user: o nome deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O nome deve ter 1 a 100 caracteres' });
        return false;
    }

    if ((user.address == null) || (user.address != null && !iz.between(user.address.length, 1, 100))) {
        console.log('Error adding user: o endereco deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O endereco deve ter 1 a 100 caracteres' });
        return false;
    }

    if ((user.number == null) || (user.number != null && !iz.between(user.number.length, 1, 10))) {
        console.log('Error adding user: o numero deve ter 1 a 10 caracteres');
        res.send('500', { status: 500, error: 'O numero deve ter 1 a 10 caracteres' });
        return false;
    }

    if (!iz.maxLength(user.complement, 20)) {
        console.log('Error adding user: o complemento deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O complemento deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.complement == null)) { delete user.complement; }

    if (!iz.maxLength(user.district, 50)) {
        console.log('Error adding user: o bairro deve ter maximo 50 caracteres');
        res.send('500', { status: 500, error: 'O bairro deve ter maximo 50 caracteres' });
        return false;
    }
    if ((user.district == null)) { delete user.district; }

    if ((user.state == null) && (user.state != null && !iz.between(user.state.length, 1, 50))) {
        console.log('Error adding user: estado invalido');
        res.send('500', { status: 500, error: 'Estado invalido' });
        return false;
    }

    if ((user.city == null) && (user.city != null && !iz.between(user.city.length, 1, 50))) {
        console.log('Error adding user: cidade invalida');
        res.send('500', { status: 500, error: 'Cidade invalida' });
        return false;
    }

    if (!iz.maxLength(user.cep, 9)) {
        console.log('Error adding user: o cep deve ter maximo 9 caracteres');
        res.send('500', { status: 500, error: 'O cep deve ter maximo 9 caracteres' });
        return false;
    }
    if ((user.cep == null)) { delete user.cep; }

    if ((user.registration == null) || (user.registration != null && !iz.between(user.registration.length, 1, 30))) {
        console.log('Error adding user: a matricula ou registro deve ter 1 a 30 caracteres');
        res.send('500', { status: 500, error: 'A matricula ou registro deve ter 1 a 30 caracteres' });
        return false;
    }

    if (!iz.maxLength(user.phone1, 20)) {
        console.log('Error adding user: o telefone 1 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 1 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.phone1 == null)) { delete user.phone1; }

    if (!(user.active == 'true' || user.active == true)) {
        user.active = false;
    }

    if (!iz.maxLength(user.rg, 20)) {
        console.log('Error adding user: o RG deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O RG deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.rg == null)) { delete user.rg; }

    if (!iz.maxLength(user.phone2, 20)) {
        console.log('Error adding user: o telefone 2 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 2 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.phone2 == null)) { delete user.phone2; }

    if (user.cpf == null || !validaCpf(user.cpf)) {
        console.log('Error adding user: CPF invalido');
        res.send('500', { status: 500, error: 'CPF invalido' });
        return false;
    }

    if (!iz.maxLength(user.phone3, 20)) {
        console.log('Error adding user: o telefone 3 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 3 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.phone3 == null)) { delete user.phone3; }

    if (!iz(user.mail).required().email().valid) {
        console.log('Error adding user: email invalido');
        res.send('500', { status: 500, error: 'Email invalido' });
        return false;
    }

    if (!iz(user.dateInclusion).required().date().valid) {
        console.log('Error adding user: data de inclusao invalida');
        res.send('500', { status: 500, error: 'Data de inclusao invalida' });
        return false;
    }

    return true;

}

var putUser = function (res, user, id) {
    var objectID = new ObjectID(id);
    UserModel = mongoose.model('users', User);

    UserModel.findOne({ 'registration': user.registration, 'type': user.type, '_id': { $nin: [objectID]} }, function (err, u) {
        if (!err) {
            if (u) {
                console.log('Error updating user: a matricula ou registro ja existe');
                res.send('500', { status: 500, error: 'A matricula ou registro ja existe' });
            }
            else {
                UserModel.findOne({ 'cpf': user.cpf, '_id': { $nin: [objectID]} }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error updating user: o CPF ja existe');
                            res.send('500', { status: 500, error: 'O CPF ja existe' });
                        }
                        else {
                            UserModel.findOne({ 'mail': user.mail, '_id': { $nin: [objectID]} }, function (err, u) {
                                if (!err) {
                                    if (u) {
                                        console.log('Error updating user: o Email ja existe');
                                        res.send('500', { status: 500, error: 'O Email ja existe' });
                                    }
                                    else {
                                        //UPDATE USER



                                        UserModel.findOne({ '_id': objectID }, { _id: 1, mail: 1, active: 1 }, function (err, u) {
                                            if (!err) {
                                                if ((u && u.mail != user.mail) || (user.active == false && u.active == true)) {

                                                    AccountModel.findOne({ 'username': u.mail }, { _id: 1, username: 1 }, function (err, account) {
                                                        if (!err) {
                                                            if (account) {
                                                                account.remove();
                                                            }
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    });
                                                }
                                            } else {
                                                console.log(err);
                                            }
                                        });







                                        UserModel.update({ '_id': id }, user, { safe: true }, function (err, result) {
                                            if (err) {
                                                console.log('Error updating user: ' + err);
                                                res.send('500', { status: 500, error: err });
                                            } else {
                                                console.log('' + result + ' document(s) updated');

                                                res.send(user);
                                            }
                                        });
                                    }
                                } else {
                                    console.log(err);
                                    res.send('500', { status: 500, error: err });
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.send('500', { status: 500, error: err });
                    }
                });
            }
        } else {
            console.log(err);
            res.send('500', { status: 500, error: err });
        }
    });

}

var postUser = function (res, user) {
    UserModel = mongoose.model('users', User);
    console.log(user.type);
    UserModel.findOne({ 'registration': user.registration, 'type': user.type }, function (err, u) {
        if (!err) {
            if (u) {
                console.log('Error adding user: a matricula ou registro ja existe');
                res.send('500', { status: 500, error: 'A matricula ou registro ja existe' });
                return;
            }
            else {
                UserModel.findOne({ 'cpf': user.cpf }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error adding user: o CPF ja existe');
                            res.send('500', { status: 500, error: 'O CPF ja existe' });
                            return;
                        }
                        else {
                            UserModel.findOne({ 'mail': user.mail }, function (err, u) {
                                if (!err) {
                                    if (u) {
                                        console.log('Error adding user: o Email ja existe');
                                        res.send('500', { status: 500, error: 'O Email ja existe' });
                                        return;
                                    }
                                    else {
                                        //INSERT
                                        delete user._id;
                                        delete user.dateUpdate;
                                        UserModel = new UserModel(user);
                                        UserModel.save(function (err, user, result) {
                                            if (err) {
                                                console.log('Error inserting user: ' + err);
                                                res.send('500', { status: 500, error: err });
                                            } else {
                                                console.log('' + result + ' document(s) inserted');
                                                res.send(user);
                                            }
                                        });
                                    }
                                } else {
                                    console.log(err);
                                    res.send('500', { status: 500, error: err });
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.send('500', { status: 500, error: err });
                    }
                });
            }
        } else {
            console.log(err);
            res.send('500', { status: 500, error: err });
            return;
        }
    });
}

var delUser = function (res, req, id) {

    UserModel = mongoose.model('users', User);
    UserModel.findOne({ '_id': id }, { _id: 1, mail: 1 }, function (err, user) {
        if (!err) {
            if (user) {
                if ((user.mail != req.user.username)) {

                    AccountModel.findOne({ 'username': user.mail }, { _id: 1 }, function (err, account) {
                        if (!err) {
                            if (account) {
                                account.remove(function () { user.remove(function () { res.send(user); }); });
                            }
                            else {
                                user.remove(function () { res.send(user); });
                            }

                        } else {
                            console.log('Error updating account: ' + err);
                            res.send('500', { status: 500, error: err });
                        }
                    });
                }
                else {
                    res.send('500', { status: 500, error: 'Nao e possivel excluir o proprio usuario' });
                }
            }
            else {
                res.send('500', { status: 500, error: 'Usuario nao encontrado' });
            }

        } else {
            console.log('Error deleting user: ' + err);
            res.send('500', { status: 500, error: err });
        }
    });
}

module.exports.UserModel = UserModel;
module.exports.validateUser = validateUser;
module.exports.putUser = putUser;
module.exports.postUser = postUser;
module.exports.delUser = delUser;