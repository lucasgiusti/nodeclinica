
//************************************************************
var
    path = require("path"),
    mime = require('mime'),
    http = require('http'),
    express = require("express"),
    fs = require('fs'),
    mongoose = require('mongoose'),
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    patientRoute = require("./patient"),
    accountRoute = require("./account"),
    utilRoute = require("./util"),
    jstoxml = require('./jstoxml');
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
    district: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    cep: { type: String, required: false },
    registration: { type: String, required: true },
    phone1: { type: String, required: true },
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

var getRelUsersAll = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'RELATORIO')) {
        res.status('401').send({ status: 401, error: 'Acesso Negado' });
    }
    else {
        UserModel = mongoose.model('users', User);
        return UserModel.find({}).sort({ type: 1, name: 1 }).exec(function (err, users) {
            if (!err) {
                return res.send(users);
            } else {
                return console.log(err);
            }
        });
    }
};

var getXmlCompleteUsersAll = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.status('401').send({ status: 401, error: 'Acesso Negado' });
    }
    else {
        UserModel = mongoose.model('users', User);
        return UserModel.find({}).sort({ name: 1 }).exec(function (err, users) {
            if (!err) {
                var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

                xml += '<users>';
                for (var i = 0; i < users.length; i++) {

                    var str = JSON.stringify(users[i]);

                    while (str.indexOf('"complement":null,') != -1) {
                        str = str.replace('"complement":null,', '');
                    }
                    while (str.indexOf('"dateUpdate":null,') != -1) {
                        str = str.replace('"dateUpdate":null,', '');
                    }
                    while (str.indexOf('"cep":null,') != -1) {
                        str = str.replace('"cep":null,', '');
                    }
                    while (str.indexOf('"phone2":null,') != -1) {
                        str = str.replace('"phone2":null,', '');
                    }
                    while (str.indexOf('"phone3":null,') != -1) {
                        str = str.replace('"phone3":null,', '');
                    }
                    while (str.indexOf('"rg":null,') != -1) {
                        str = str.replace('"rg":null,', '');
                    }

                    var obj = JSON.parse(str);

                    xml += '<user>';
                    xml += jstoxml.toXML(obj);
                    xml += '</user>';
                }
                xml += '</users>';





                var codigo = new ObjectID();
                var file = __dirname.replace('routes', '') + 'public/downloads/exportUsers-' + codigo + '.xml';

                fs.writeFile(file, xml, function (err, data) {

                    if (err) {
                        return console.log(err);
                    }
                    else {
                        var filename = path.basename(file);
                        var mimetype = mime.lookup(file);



                        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                        res.setHeader('Content-type', mimetype);

                        var filestream = fs.createReadStream(file);
                        filestream.pipe(res);
                    }
                });


            } else {
                return console.log(err);
            }
        });
    }
};

var validateUser = function (res, user) {

    if (!(iz(user.type).required().equal('ALUNO').valid
        || iz(user.type).required().equal('PROFESSOR').valid
        || iz(user.type).required().equal('ATENDENTE').valid
        || iz(user.type).required().equal('GESTOR').valid)) {
        console.log('Error adding user: tipo de usuario invalido');
        res.status('500').send({ status: 500, error: 'Tipo de usuario invalido' });
        return false;
    }

    if ((user.name == null) || (user.name != null && !iz.between(user.name.trim().length, 1, 100))) {
        console.log('Error adding user: o nome deve ter 1 a 100 caracteres');
        res.status('500').send({ status: 500, error: 'O nome deve ter 1 a 100 caracteres' });
        return false;
    }
    user.name = user.name.trim();
    
    if ((user.address == null) || (user.address != null && !iz.between(user.address.trim().length, 1, 100))) {
        console.log('Error adding user: o endereco deve ter 1 a 100 caracteres');
        res.status('500').send({ status: 500, error: 'O endereco deve ter 1 a 100 caracteres' });
        return false;
    }
    user.address = user.address.trim();

    if ((user.number == null) || (user.number != null && !iz.between(user.number.trim().length, 1, 10))) {
        console.log('Error adding user: o numero deve ter 1 a 10 caracteres');
        res.status('500').send({ status: 500, error: 'O numero deve ter 1 a 10 caracteres' });
        return false;
    }
    user.number = user.number.trim();

    if (!iz.maxLength(user.complement, 20)) {
        console.log('Error adding user: o complemento deve ter maximo 20 caracteres');
        res.status('500').send({ status: 500, error: 'O complemento deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.complement == null)) { delete user.complement; } else { user.complement = user.complement.trim();}


    if ((user.district == null) || (user.district != null && !iz.between(user.district.trim().length, 1, 50))) {
        console.log('Error adding user: o bairro deve ter 1 a 50 caracteres');
        res.status('500').send({ status: 500, error: 'O bairro deve ter 1 a 50 caracteres' });
        return false;
    }
    user.district = user.district.trim();

    if ((user.state == null) || (user.state != null && !iz.between(user.state.trim().length, 1, 50))) {
        console.log('Error adding user: estado invalido');
        res.status('500').send({ status: 500, error: 'Estado invalido' });
        return false;
    }
    user.state = user.state.trim();

    if ((user.city == null) || (user.city != null && !iz.between(user.city.trim().length, 1, 50))) {
        console.log('Error adding user: cidade invalida');
        res.status('500').send({ status: 500, error: 'Cidade invalida' });
        return false;
    }
    user.city = user.city.trim();

    if (!iz.maxLength(user.cep, 9)) {
        console.log('Error adding user: o cep deve ter maximo 9 caracteres');
        res.status('500').send({ status: 500, error: 'O cep deve ter maximo 9 caracteres' });
        return false;
    }
    if ((user.cep == null)) { delete user.cep; } else { user.cep = user.cep.trim();}

    if ((user.registration == null) || (user.registration != null && !iz.between(user.registration.trim().length, 1, 30))) {
        console.log('Error adding user: a matricula ou registro deve ter 1 a 30 caracteres');
        res.status('500').send({ status: 500, error: 'A matricula ou registro deve ter 1 a 30 caracteres' });
        return false;
    }
    user.registration = user.registration.trim();

    if ((user.phone1 == null) || (user.phone1 != null && !iz.between(user.phone1.trim().length, 1, 20))) {
        console.log('Error adding user: o telefone 1 deve ter 1 a 20 caracteres');
        res.status('500').send({ status: 500, error: 'O telefone 1 deve ter 1 a 20 caracteres' });
        return false;
    }
    user.phone1 = user.phone1.trim();

    if (!(user.active == 'true' || user.active == true)) {
        user.active = false;
    }

    if (!iz.maxLength(user.rg, 20)) {
        console.log('Error adding user: o RG deve ter maximo 20 caracteres');
        res.status('500').send({ status: 500, error: 'O RG deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.rg == null)) { delete user.rg; } else { user.rg = user.rg.trim();}

    if (!iz.maxLength(user.phone2, 20)) {
        console.log('Error adding user: o telefone 2 deve ter maximo 20 caracteres');
        res.status('500').send({ status: 500, error: 'O telefone 2 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.phone2 == null)) { delete user.phone2; } else { user.phone2 = user.phone2.trim();}

    if (user.cpf == null || !validaCpf(user.cpf)) {
        console.log('Error adding user: CPF invalido');
        res.status('500').send({ status: 500, error: 'CPF invalido' });
        return false;
    }
    user.cpf = user.cpf.trim();

    if (!iz.maxLength(user.phone3, 20)) {
        console.log('Error adding user: o telefone 3 deve ter maximo 20 caracteres');
        res.status('500').send({ status: 500, error: 'O telefone 3 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((user.phone3 == null)) { delete user.phone3; } else { user.phone3 = user.phone3.trim();}

    if (!iz(user.mail).required().email().valid) {
        console.log('Error adding user: email invalido');
        res.status('500').send({ status: 500, error: 'Email invalido' });
        return false;
    }
    user.mail = user.mail.trim();

    if (!iz(user.dateInclusion).required().date().valid) {
        console.log('Error adding user: data de inclusao invalida');
        res.status('500').send({ status: 500, error: 'Data de inclusao invalida' });
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
                res.status('500').send({ status: 500, error: 'A matricula ou registro ja existe' });
            }
            else {
                UserModel.findOne({ 'cpf': user.cpf, '_id': { $nin: [objectID]} }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error updating user: o CPF ja existe');
                            res.status('500').send({ status: 500, error: 'O CPF ja existe' });
                        }
                        else {
                            UserModel.findOne({ 'mail': user.mail, '_id': { $nin: [objectID]} }, function (err, u) {
                                if (!err) {
                                    if (u) {
                                        console.log('Error updating user: o Email ja existe');
                                        res.status('500').send({ status: 500, error: 'O Email ja existe' });
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
                                                res.status('500').send({ status: 500, error: err });
                                            } else {
                                                console.log('' + result + ' document(s) updated');

                                                res.send(user);
                                            }
                                        });
                                    }
                                } else {
                                    console.log(err);
                                    res.status('500').send({ status: 500, error: err });
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.status('500').send({ status: 500, error: err });
                    }
                });
            }
        } else {
            console.log(err);
            res.status('500').send({ status: 500, error: err });
        }
    });

}

var postUser = function (res, user) {
    UserModel = mongoose.model('users', User);
    UserModel.findOne({ 'registration': user.registration, 'type': user.type }, function (err, u) {
        if (!err) {
            if (u) {
                console.log('Error adding user: a matricula ou registro ja existe');
                res.status('500').send({ status: 500, error: 'A matricula ou registro ja existe' });
                return;
            }
            else {
                UserModel.findOne({ 'cpf': user.cpf }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error adding user: o CPF ja existe');
                            res.status('500').send({ status: 500, error: 'O CPF ja existe' });
                            return;
                        }
                        else {
                            UserModel.findOne({ 'mail': user.mail }, function (err, u) {
                                if (!err) {
                                    if (u) {
                                        console.log('Error adding user: o Email ja existe');
                                        res.status('500').send({ status: 500, error: 'O Email ja existe' });
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
                                                res.status('500').send({ status: 500, error: err });
                                            } else {
                                                console.log('' + result + ' document(s) inserted');
                                                res.send(user);
                                            }
                                        });
                                    }
                                } else {
                                    console.log(err);
                                    res.status('500').send({ status: 500, error: err });
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.status('500').send({ status: 500, error: err });
                    }
                });
            }
        } else {
            console.log(err);
            res.status('500').send({ status: 500, error: err });
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

                    return patientRoute.PatientModel.findOne( {$or:[ {'treatments.sessions.studentId': id },{'treatments.sessions.teacherId': id }]}, { _id: 1 }, function (err, patient) {
                        if (!err) {
                            if(patient)
                            {
                                res.status('500').send({ status: 500, error: 'Existem sessões vinculadas, não é possível excluir' });
                            }
                            else{
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
                                        res.status('500').send({ status: 500, error: err });
                                    }
                                });
                            }
                        } else {
                            return console.log(err);
                        }
                    });
                

                }
                else {
                    res.status('500').send({ status: 500, error: 'Nao e possivel excluir o proprio usuario' });
                }
            }
            else {
                res.status('500').send({ status: 500, error: 'Usuario nao encontrado' });
            }

        } else {
            console.log('Error deleting user: ' + err);
            res.status('500').send({ status: 500, error: err });
        }
    });
}

module.exports.UserModel = UserModel;
module.exports.validateUser = validateUser;
module.exports.getRelUsersAll = getRelUsersAll;
module.exports.getXmlCompleteUsersAll = getXmlCompleteUsersAll;
module.exports.putUser = putUser;
module.exports.postUser = postUser;
module.exports.delUser = delUser;