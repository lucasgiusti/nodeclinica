
//************************************************************
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    http = require('http'),
    mongoose = require('mongoose'),
    app = express(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    passportLocalMongoose = require('passport-local-mongoose'),
    utilRoute = require("./routes/util"),
    accountRoute = require("./routes/account");


//************************************************************


var validaCpf = utilRoute.validaCpf;

var AccountModel = accountRoute.AccountModel;
var auth = accountRoute.auth;
var isAuthorized = accountRoute.isAuthorized;

//*****************************************
// Config
    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
        app.use(express.bodyParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());


        app.use(function (req, res, next) {
            if (req.method == 'POST' && req.url == '/login') {

                if (req.body.rememberme) {
                    var hour = 3600000;
                    req.session.cookie.maxAge = 7 * 24 * hour; //1 week
                } else {
                    req.session.cookie.expires = false;
                }
            }
            next();
        });



        app.use(passport.initialize());
        app.use(passport.session());
    });
//************************************************************




//************************************************************
var connectionString = require('./models/conn');
mongoose.connect(connectionString);
//************************************************************

AccountModel.find({ 'username': 'admin' }, { _id: 1 }, function (err, acc) {
    if (!err) {
        if (acc == '') {

            AccountModel.register(new AccountModel({ username: 'admin', dateInclusion: new Date(), type: 'ADMIN' }), 'admin', function (err, account) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Admin user created");
                }
            });

        }
    } else {
        console.log(err);
    }
});



//************************************************************
var Schema = mongoose.Schema;


// User Model
var User = new Schema({
    name: { type: String, required: true },
    mail: { type: String, index: { unique: true } },
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
    cpf: { type: String, index: { unique: true } },
    type: { type: String, required: true },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false }
});

// Patient Model
var Patient = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true }
});



var UserModel = mongoose.model('users', User);
var PatientModel = mongoose.model('patients', Patient);
//************************************************************





//************************************************************
// ACCOUNT

app.get('/account/:username', auth, accountRoute.findByUserName);
app.put('/account/:id', auth, accountRoute.putAccount);
app.get('/loggedtest', accountRoute.loggedtest);
app.post('/login', accountRoute.login);
app.get('/logout', accountRoute.logout);



//************************************************************
// validation

function validateUser(res, user) {

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

function putUser(res, user, id) {

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
                            UserModel.findOne({ 'mail': user.mail, '_id': { $nin: [objectID] } }, function (err, u) {
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

function postUser(res, user) {
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

function delUser(res, req, id) {

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


//************************************************************
// GET to READ STUDENTS

// List students
app.get('/students', auth, function (req, res) {
    var type = 'ALUNO';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List students by Name
app.get('/students/name/:name', auth, function (req, res) {
    var name = req.params.name;
    var type = 'ALUNO';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List students by CPF
app.get('/students/cpf/:cpf', auth, function (req, res) {
    var cpf = req.params.cpf;
    var type = 'ALUNO';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});


// List students by Registration
app.get('/students/registration/:registration', auth, function (req, res) {
    var registration = req.params.registration;
    var type = 'ALUNO';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// Student by id
app.get('/students/:id', auth, function (req, res) {
    var id = req.params.id;
    UserModel = mongoose.model('users', User);
    return UserModel.findById(id, { _id: 1,
        name: 1, 
        mail: 1,
        address: 1,
        number: 1,
        complement: 1,
        district: 1,
        state: 1,
        city: 1,
        cep: 1,
        registration: 1,
        phone1: 1,
        active: 1,
        rg: 1,
        phone2: 1,
        phone3: 1,
        cpf: 1,
        type: 1,
        dateInclusion: 1,
        dateUpdate: 1
    }, function (err, users) {
        if (!err) {
            return res.send(users);

        } else {
            return console.log(err);
        }
    });
});

app.put('/students/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var user = req.body;
        delete user._id;
        console.log('Updating user: ' + id);
        user.dateUpdate = new Date();

        if (validateUser(res, user)) {
            putUser(res, user, id);
        }
    }
});

app.del('/students/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);
        delUser(res, req, id);
    }
});

app.post('/students', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var user = req.body;
        console.log('Adding user');
        user.dateInclusion = new Date();

        if (validateUser(res, user)) {
            postUser(res, user);
        }
    }
});
//************************************************************




//************************************************************
// GET to READ TEACHERS


// List teachers
app.get('/teachers', auth, function (req, res) {
    var type = 'PROFESSOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List teachers by Name
app.get('/teachers/name/:name', auth, function (req, res) {
    var name = req.params.name;
    var type = 'PROFESSOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List teachers by CPF
app.get('/teachers/cpf/:cpf', auth, function (req, res) {
    var cpf = req.params.cpf;
    var type = 'PROFESSOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});


// List teachers by Registration
app.get('/teachers/registration/:registration', auth, function (req, res) {
    var registration = req.params.registration;
    var type = 'PROFESSOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// Teacher by id
app.get('/teachers/:id', auth, function (req, res) {
    var id = req.params.id;
    UserModel = mongoose.model('users', User);
    return UserModel.findById(id, {
        _id: 1,
        name: 1,
        mail: 1,
        address: 1,
        number: 1,
        complement: 1,
        district: 1,
        state: 1,
        city: 1,
        cep: 1,
        registration: 1,
        phone1: 1,
        active: 1,
        rg: 1,
        phone2: 1,
        phone3: 1,
        cpf: 1,
        type: 1,
        dateInclusion: 1,
        dateUpdate: 1
    }, function (err, users) {
        if (!err) {
            return res.send(users);

        } else {
            return console.log(err);
        }
    });
});

app.put('/teachers/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var user = req.body;
        delete user._id;
        console.log('Updating user: ' + id);
        user.dateUpdate = new Date();

        if (validateUser(res, user)) {
            putUser(res, user, id);
        }
    }
});

app.del('/teachers/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);
        delUser(res, req, id);
    }
});

app.post('/teachers', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var user = req.body;
        console.log('Adding user');
        user.dateInclusion = new Date();

        if (validateUser(res, user)) {
            postUser(res, user);
        }
    }
});
//************************************************************




//************************************************************
// GET to READ ATTENDANTS

// List attendants
app.get('/attendants', auth, function (req, res) {
    var type = 'ATENDENTE';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List attendants by Name
app.get('/attendants/name/:name', auth, function (req, res) {
    var name = req.params.name;
    var type = 'ATENDENTE';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List attendants by CPF
app.get('/attendants/cpf/:cpf', auth, function (req, res) {
    var cpf = req.params.cpf;
    var type = 'ATENDENTE';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});


// List attendants by Registration
app.get('/attendants/registration/:registration', auth, function (req, res) {
    var registration = req.params.registration;
    var type = 'ATENDENTE';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// Student by id
app.get('/attendants/:id', auth, function (req, res) {
    var id = req.params.id;
    UserModel = mongoose.model('users', User);
    return UserModel.findById(id, {
        _id: 1,
        name: 1,
        mail: 1,
        address: 1,
        number: 1,
        complement: 1,
        district: 1,
        state: 1,
        city: 1,
        cep: 1,
        registration: 1,
        phone1: 1,
        active: 1,
        rg: 1,
        phone2: 1,
        phone3: 1,
        cpf: 1,
        type: 1,
        dateInclusion: 1,
        dateUpdate: 1
    }, function (err, users) {
        if (!err) {
            return res.send(users);

        } else {
            return console.log(err);
        }
    });
});

app.put('/attendants/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var user = req.body;
        delete user._id;
        console.log('Updating user: ' + id);
        user.dateUpdate = new Date();

        if (validateUser(res, user)) {
            putUser(res, user, id);
        }
    }
});

app.del('/attendants/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);
        delUser(res, req, id);
    }
});

app.post('/attendants', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var user = req.body;
        console.log('Adding user');
        user.dateInclusion = new Date();

        if (validateUser(res, user)) {
            postUser(res, user);
        }
    }
});
//************************************************************



//************************************************************
// GET to READ MANAGERS

// List managers
app.get('/managers', auth, function (req, res) {
    var type = 'GESTOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List managers by Name
app.get('/managers/name/:name', auth, function (req, res) {
    var name = req.params.name;
    var type = 'GESTOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List managers by CPF
app.get('/managers/cpf/:cpf', auth, function (req, res) {
    var cpf = req.params.cpf;
    var type = 'GESTOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});


// List managers by Registration
app.get('/managers/registration/:registration', auth, function (req, res) {
    var registration = req.params.registration;
    var type = 'GESTOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// Student by id
app.get('/managers/:id', auth, function (req, res) {
    var id = req.params.id;
    UserModel = mongoose.model('users', User);
    return UserModel.findById(id, {
        _id: 1,
        name: 1,
        mail: 1,
        address: 1,
        number: 1,
        complement: 1,
        district: 1,
        state: 1,
        city: 1,
        cep: 1,
        registration: 1,
        phone1: 1,
        active: 1,
        rg: 1,
        phone2: 1,
        phone3: 1,
        cpf: 1,
        type: 1,
        dateInclusion: 1,
        dateUpdate: 1
    }, function (err, users) {
        if (!err) {
            return res.send(users);

        } else {
            return console.log(err);
        }
    });
});

app.put('/managers/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var user = req.body;
        delete user._id;
        console.log('Updating user: ' + id);
        user.dateUpdate = new Date();

        if (validateUser(res, user)) {
            putUser(res, user, id);
        }
    }
});

app.del('/managers/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);
        delUser(res, req, id);
    }
});

app.post('/managers', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var user = req.body;
        console.log('Adding user');
        user.dateInclusion = new Date();

        if (validateUser(res, user)) {
            postUser(res, user);
        }
    }
});
//************************************************************




//************************************************************
// GET to READ PATIENTS


// List patients
app.get('/patients', auth, function (req, res) {
    return PatientModel.find({}, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
});

// List patients by Name
app.get('/patients/name/:name', auth, function (req, res) {
    var name = req.params.name;
    return PatientModel.find({ 'name': { '$regex': name, $options: 'i' } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
});

// List patients by CPF
app.get('/patients/cpf/:cpf', auth, function (req, res) {
    var cpf = req.params.cpf;
    return PatientModel.find({ 'cpf': { '$regex': cpf } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
});

// Patient by id
app.get('/patients/:id', auth, function (req, res) {
    var id = req.params.id;


    return PatientModel.findById(id, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
});
//************************************************************


//************************************************************
// Launch server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Node Application server listening on port " + app.get('port'));
});
//************************************************************







/*








var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    http = require('http'),
    mongoose = require('mongoose');
    base = require('./routes/base');

var app = express();

// Database


// Config
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev')); 
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});


app.get('/students', base.findStudentsAll);
app.get('/students/name/:name', base.findStudentsByName);
app.get('/students/:id', base.findStudentById);
app.post('/students', base.addStudent);
app.put('/students/:id', base.updateStudent);
app.delete('/students/:id', base.deleteStudent);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


*/