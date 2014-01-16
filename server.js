
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
    ObjectID = require('mongodb').ObjectID;
    passportLocalMongoose = require('passport-local-mongoose');


//************************************************************




//************************************************************
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




//************************************************************
var Schema = mongoose.Schema; //Schema.ObjectId

//Account Model
var Account = new Schema({
    type: { type: String, required: true },
    dateInclusion: { type: Date, required: true }
});

// User Model
var User = new Schema({
    name: { type: String, required: true },
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
    cpf: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false }
});

// Patient Model
var Patient = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true }
});
//************************************************************


Account.plugin(passportLocalMongoose);


var AccountModel = mongoose.model('accounts', Account);
var UserModel = mongoose.model('users', User);
var PatientModel = mongoose.model('patients', Patient);




//************************************************************
// AUTHENTICATION

passport.use(new LocalStrategy(AccountModel.authenticate()));
passport.serializeUser(AccountModel.serializeUser());
passport.deserializeUser(AccountModel.deserializeUser());


var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send('401', { status: 401, error: 'Acesso Negado' });
    else
        next();
};


app.get('/loggedtest', auth, function (req, res) {
    res.send(req.username);
});


app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin.html?return=false' }));

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/signin.html');
});


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




//************************************************************
// validation

function putUser(res, user, id) {

    if (!iz.between(user.registration.length, 1, 30)) {
        console.log('Error updating user: a matricula ou registro deve ter 1 a 30 caracteres');
        res.send('500', { status: 500, error: 'A matricula ou registro deve ter 1 a 30 caracteres' });
    }

    var objectID = new ObjectID(id);
    UserModel.findOne({ 'registration': user.registration, 'type': user.type, '_id': { $nin: [objectID]} }, function (err, u) {
        if (!err) {
            if (u) {
                console.log('Error updating user: a matricula ou registro ja existe');
                res.send('500', { status: 500, error: 'A matricula ou registro ja existe' });
            }
            else {
                if (!(iz(user.cpf).required() && validaCpf(user.cpf))) {
                    console.log('Error updating user: CPF invalido');
                    res.send('500', { status: 500, error: 'CPF invalido' });
                }

                UserModel.findOne({ 'cpf': user.cpf, 'type': user.type, '_id': { $nin: [objectID]} }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error updating user: o CPF ja existe');
                            res.send('500', { status: 500, error: 'O CPF ja existe' });
                        }
                        else {

                            if (!iz.between(user.name.length, 1, 100)) {
                                console.log('Error updating user: o nome deve ter 1 a 100 caracteres');
                                res.send('500', { status: 500, error: 'O nome deve ter 1 a 100 caracteres' });
                            }

                            if (!iz.between(user.address.length, 1, 100)) {
                                console.log('Error updating user: o endereco deve ter 1 a 100 caracteres');
                                res.send('500', { status: 500, error: 'O endereco deve ter 1 a 100 caracteres' });
                            }

                            if (!iz.between(user.number.length, 1, 10)) {
                                console.log('Error updating user: o numero deve ter 1 a 100 caracteres');
                                res.send('500', { status: 500, error: 'O numero deve ter 1 a 100 caracteres' });
                            }

                            if (!iz.maxLength(user.complement, 20)) {
                                console.log('Error updating user: o complemento deve ter maximo 20 caracteres');
                                res.send('500', { status: 500, error: 'O complemento deve ter maximo 20 caracteres' });
                            }

                            if (!iz.maxLength(user.district, 50)) {
                                console.log('Error updating user: o bairro deve ter maximo 50 caracteres');
                                res.send('500', { status: 500, error: 'O bairro deve ter maximo 50 caracteres' });
                            }

                            if (!iz.between(user.state.length, 1, 50)) {
                                console.log('Error updating user: estado invalido');
                                res.send('500', { status: 500, error: 'Estado invalido' });
                            }

                            if (!iz.between(user.city.length, 1, 50)) {
                                console.log('Error updating user: cidade invalida');
                                res.send('500', { status: 500, error: 'Cidade invalida' });
                            }

                            if (!iz.maxLength(user.cep, 9)) {
                                console.log('Error updating user: o cep deve ter maximo 9 caracteres');
                                res.send('500', { status: 500, error: 'O cep deve ter maximo 9 caracteres' });
                            }

                            if (!iz.maxLength(user.phone1, 20)) {
                                console.log('Error updating user: o telefone 1 deve ter maximo 20 caracteres');
                                res.send('500', { status: 500, error: 'O telefone 1 deve ter maximo 20 caracteres' });
                            }

                            if (!(user.active == 'true' || user.active == true)) {
                                user.active = false;
                            }

                            if (!iz.maxLength(user.rg, 20)) {
                                console.log('Error updating user: o RG deve ter maximo 20 caracteres');
                                res.send('500', { status: 500, error: 'O RG deve ter maximo 20 caracteres' });
                            }

                            if (!iz.maxLength(user.phone2, 20)) {
                                console.log('Error updating user: o telefone 2deve ter maximo 20 caracteres');
                                res.send('500', { status: 500, error: 'O telefone 2 deve ter maximo 20 caracteres' });
                            }

                            if (!iz.maxLength(user.phone3, 20)) {
                                console.log('Error updating user: o telefone 3 deve ter maximo 20 caracteres');
                                res.send('500', { status: 500, error: 'O telefone 3 deve ter maximo 20 caracteres' });
                            }

                            if (!iz(user.username).required().email().valid) {
                                console.log('Error updating user: email invalido');
                                res.send('500', { status: 500, error: 'Email invalido' });
                            }

                            if (!iz.between(user.password.length, 1, 30)) {
                                console.log('Error updating user: a senha deve ter 1 a 30 caracteres');
                                res.send('500', { status: 500, error: 'A senha deve ter 1 a 30 caracteres' });
                            }

                            if (!iz(user.dateInclusion).required().date().valid) {
                                console.log('Error updating user: data de inclusao invalida');
                                res.send('500', { status: 500, error: 'Data de inclusao invalida' });
                            }

                            user.type = 'ALUNO';
                            if (!(iz(user.type).required().equal('ALUNO').valid
                                || iz(user.type).required().equal('PROFESSOR').valid
                                || iz(user.type).required().equal('ATENDENTE').valid
                                || iz(user.type).required().equal('GESTOR').valid)) {
                                console.log('Error updating user: tipo de usuario invalido');
                                res.send('500', { status: 500, error: 'Tipo de usuario invalido' });
                            }


                            //UPDATE USER
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

//User.path('name').validate(function (v) {
//    return false;
//}, 'my error type');



//************************************************************




//************************************************************
// GET to READ STUDENTS

// List students
app.get('/students', auth, function (req, res) {
    var type = 'ALUNO';
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
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

    return UserModel.findById(id, { _id: 1, 
        name: 1, 
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
        dateUpdate: 1,
        username: 1
    }, function (err, users) {
        if (!err) {
            return res.send(users);

        } else {
            return console.log(err);
        }
    });
});

app.put('/students/:id', auth, function (req, res) {
    var id = req.params.id;
    var user = req.body;
    delete user._id;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    user.dateUpdate = new Date();

    putUser(res, user, id);
});
//************************************************************






//************************************************************
// GET to READ TEACHERS


// List teachers
app.get('/teachers', auth, function (req, res) {
    var type = 'PROFESSOR';
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
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


    return UserModel.findById(id, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});
//************************************************************








//************************************************************
// GET to READ ATTENDANTS


// List attendants
app.get('/attendants', auth, function (req, res) {
    var type = 'ATENDENTE';
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
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
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// Attendant by id
app.get('/attendants/:id', auth, function (req, res) {
    var id = req.params.id;


    return UserModel.findById(id, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});
//************************************************************







//************************************************************
// GET to READ MANAGERS


// List managers
app.get('/managers', auth, function (req, res) {
    var type = 'GESTOR';
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
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
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// Manager by id
app.get('/managers/:id', auth, function (req, res) {
    var id = req.params.id;


    return UserModel.findById(id, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
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




function validaCpf(str) {
    str = str.replace('.', '');
    str = str.replace('.', '');
    str = str.replace('-', '');

    cpf = str;
    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
        return false;
    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }
    if (!digitos_iguais) {
        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
        numeros = cpf.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
        return true;
    }
    else
        return false;
}










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