window.Wine = Backbone.Model.extend({

    urlRoot: "/wines",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: ""
    }
});

window.WineCollection = Backbone.Collection.extend({

    model: Wine,

    url: "/wines"

});



/* STUDENTS */


window.Student = Backbone.Model.extend({

    urlRoot: "/students",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};
/*        
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Nome" };
        };

        this.validators.address = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Endereço" };
        };
        
        this.validators.mail = function (value) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value) == true ? { isValid: true } : { isValid: false, message: "Informe um email correto" };
        }
  */      
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));

                if (check.isValid === false) {
                    messages[key] = check.message;

                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        name: null,
        mail: null,
        registration: null,
        cpf: null,
        rg: null,
        address: null,
        number: null,
        complement: null,
        district: null,
        state: 'SP',
        city: 'SAO CAETANO DO SUL',
        cep: null,
        phone1: null,
        phone2: null,
        phone3: null,
        active: true,
        type: "ALUNO",
        dateInclusion: null,
        dateUpdate: null
    }
});

window.StudentCollection = Backbone.Collection.extend({

    model: Student,

    url: "/students"

});

window.StudentByNameCollection = Backbone.Collection.extend({

    model: Student,

    url: function () {

        return '/students/name/' + this.name;
    },

    initialize: function (options) {
        options || (options = {});
        this.name = options.name;
    },
});

window.StudentByCPFCollection = Backbone.Collection.extend({

    model: Student,

    url: function () {

        return '/students/cpf/' + this.cpf;
    },

    initialize: function (options) {
        options || (options = {});
        this.cpf = options.cpf;
    },
});

window.StudentByRegistrationCollection = Backbone.Collection.extend({

    model: Student,

    url: function () {

        return '/students/registration/' + this.registration;
    },

    initialize: function (options) {
        options || (options = {});
        this.registration = options.registration;
    },
});
















window.Account = Backbone.Model.extend({

    urlRoot: "/account",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Nome" };
        };

        this.validators.address = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Endereço" };
        };
        
        this.validators.mail = function (value) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value) == true ? { isValid: true } : { isValid: false, message: "Informe um email correto" };
        }
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        username: null
    }
});




window.LoggedTest = Backbone.Collection.extend({

    model: Account,

    url: "/loggedtest"

});









/* TEACHERS */


window.Teacher = Backbone.Model.extend({

    urlRoot: "/teachers",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Nome" };
        };

        this.validators.address = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Endereço" };
        };
        
        this.validators.mail = function (value) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value) == true ? { isValid: true } : { isValid: false, message: "Informe um email correto" };
        }
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        name: null,
        mail: null,
        registration: null,
        cpf: null,
        rg: null,
        address: null,
        number: null,
        complement: null,
        district: null,
        state: 'SP',
        city: 'SAO CAETANO DO SUL',
        cep: null,
        phone1: null,
        phone2: null,
        phone3: null,
        active: true,
        type: "PROFESSOR",
        dateInclusion: null,
        dateUpdate: null
    }
});

window.TeacherCollection = Backbone.Collection.extend({

    model: Teacher,

    url: "/teachers"

});

window.TeacherByNameCollection = Backbone.Collection.extend({

    model: Teacher,

    url: function () {

        return '/teachers/name/' + this.name;
    },

    initialize: function (options) {
        options || (options = {});
        this.name = options.name;
    },
});

window.TeacherByCPFCollection = Backbone.Collection.extend({

    model: Teacher,

    url: function () {

        return '/teachers/cpf/' + this.cpf;
    },

    initialize: function (options) {
        options || (options = {});
        this.cpf = options.cpf;
    },
});

window.TeacherByRegistrationCollection = Backbone.Collection.extend({

    model: Teacher,

    url: function () {

        return '/teachers/registration/' + this.registration;
    },

    initialize: function (options) {
        options || (options = {});
        this.registration = options.registration;
    },
});






/* ATTENDANTS */


window.Attendant = Backbone.Model.extend({

    urlRoot: "/attendants",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Nome" };
        };

        this.validators.address = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Endereço" };
        };
        
        this.validators.mail = function (value) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value) == true ? { isValid: true } : { isValid: false, message: "Informe um email correto" };
        }
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        name: null,
        mail: null,
        registration: null,
        cpf: null,
        rg: null,
        address: null,
        number: null,
        complement: null,
        district: null,
        state: 'SP',
        city: 'SAO CAETANO DO SUL',
        cep: null,
        phone1: null,
        phone2: null,
        phone3: null,
        active: true,
        type: "ATENDENTE",
        dateInclusion: null,
        dateUpdate: null
    }
});

window.AttendantCollection = Backbone.Collection.extend({

    model: Attendant,

    url: "/attendants"

});

window.AttendantByNameCollection = Backbone.Collection.extend({

    model: Attendant,

    url: function () {

        return '/attendants/name/' + this.name;
    },

    initialize: function (options) {
        options || (options = {});
        this.name = options.name;
    },
});

window.AttendantByCPFCollection = Backbone.Collection.extend({

    model: Attendant,

    url: function () {

        return '/attendants/cpf/' + this.cpf;
    },

    initialize: function (options) {
        options || (options = {});
        this.cpf = options.cpf;
    },
});

window.AttendantByRegistrationCollection = Backbone.Collection.extend({

    model: Attendant,

    url: function () {

        return '/attendants/registration/' + this.registration;
    },

    initialize: function (options) {
        options || (options = {});
        this.registration = options.registration;
    },
});





/* MANAGERS */


window.Manager = Backbone.Model.extend({

    urlRoot: "/managers",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Nome" };
        };

        this.validators.address = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Endereço" };
        };
        
        this.validators.mail = function (value) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value) == true ? { isValid: true } : { isValid: false, message: "Informe um email correto" };
        }
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        name: null,
        mail: null,
        registration: null,
        cpf: null,
        rg: null,
        address: null,
        number: null,
        complement: null,
        district: null,
        state: 'SP',
        city: 'SAO CAETANO DO SUL',
        cep: null,
        phone1: null,
        phone2: null,
        phone3: null,
        active: true,
        type: "GESTOR",
        dateInclusion: null,
        dateUpdate: null
    }
});

window.ManagerCollection = Backbone.Collection.extend({

    model: Manager,

    url: "/managers"

});

window.ManagerByNameCollection = Backbone.Collection.extend({

    model: Manager,

    url: function () {

        return '/managers/name/' + this.name;
    },

    initialize: function (options) {
        options || (options = {});
        this.name = options.name;
    },
});

window.ManagerByCPFCollection = Backbone.Collection.extend({

    model: Manager,

    url: function () {

        return '/managers/cpf/' + this.cpf;
    },

    initialize: function (options) {
        options || (options = {});
        this.cpf = options.cpf;
    },
});

window.ManagerByRegistrationCollection = Backbone.Collection.extend({

    model: Manager,

    url: function () {

        return '/managers/registration/' + this.registration;
    },

    initialize: function (options) {
        options || (options = {});
        this.registration = options.registration;
    },
});





/* PATIENTS */


window.Patient = Backbone.Model.extend({

    urlRoot: "/patients",

    idAttribute: "_id",

    initialize: function () {

        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        name: null,
        address: null,
        number: null,
        complement: null,
        district: null,
        state: 'SP',
        city: 'SAO CAETANO DO SUL',
        cep: null,
        sex: 'MASCULINO',
        phone1: null,
        dateBirth: null,
        maritalStatus: null,
        phone2: null,
        cpf: null,
        phone3: null,
        mail: null,
        responsibleName: null,
        responsibleCPF: null,
        observations: null,
        dateInclusion: null,
        dateUpdate: null
    }
});



window.PatientCollection = Backbone.Collection.extend({

    model: Patient,

    url: "/patients"

});

window.PatientByNameCollection = Backbone.Collection.extend({

    model: Patient,

    url: function () {

        return '/patients/name/' + this.name;
    },

    initialize: function (options) {
        options || (options = {});
        this.name = options.name;
    },
});

window.PatientByCPFCollection = Backbone.Collection.extend({

    model: Patient,

    url: function () {

        return '/patients/cpf/' + this.cpf;
    },

    initialize: function (options) {
        options || (options = {});
        this.cpf = options.cpf;
    },
});





/* TREATMENTS */

window.TreatmentDetail = Backbone.Model.extend({

    urlRoot: function () {
        return '/patients/' + this.idPatient + "/treatments";
    },

    initialize: function (options, _id) {

        this.id = _id;
        this.options = options || {};
        this.idPatient = "";
        var i = 0;
        while (this.options[i]) {
            this.idPatient += this.options[i];
            i++;
        }

        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        serviceArea: null,
        diagnosis: null,
        treatmentPerformed: false,
        canceledTreatment: false,
        doctor: null,
        CRMDoctor: null,
        observations: null,
        dateInclusion: null,
        dateUpdate: null
    }
});


window.Treatment = Backbone.Model.extend({

    urlRoot: function () {

        return '/patients/' + this.idPatient + "/treatments";
    },

    idAttribute: "_id",

    initialize: function (options, treatment) {

        this.options = options || {};
        this.idPatient = "";
        var i = 0;
        while (this.options[i]) {
            this.idPatient += this.options[i];
            i++;
        }

        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        serviceArea: null,
        diagnosis: null,
        treatmentPerformed: false,
        canceledTreatment: false,
        doctor: null,
        CRMDoctor: null,
        observations: null,
        dateInclusion: null,
        dateUpdate: null
    }
});



window.TreatmentCollection = Backbone.Collection.extend({
    url: function () {
        return '/patients/' + this.idPatient + "/treatments";
    },

    initialize: function (idPatient) {
        this.idPatient = idPatient;
    }
});




window.Session = Backbone.Model.extend({

    urlRoot: function () {

        return '/patients/' + this.idPatient + "/treatments/" + this.idTreatment + "/sessions";
    },

    idAttribute: "_id",

    initialize: function (options, treatmentId) {

        this.options = options || {};
        this.idPatient = "";
        var i = 0;
        while (this.options[i]) {
            this.idPatient += this.options[i];
            i++;
        }
        this.idTreatment = treatmentId;
        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        studentId: null,
        studentName: null,
        teacherId: null,
        teacherName: null,
        typeSession: 'SESSAO',
        typeService: 'INDIVIDUAL',
        everHeld: false,
        canceledSession: false,
        dateSchedulingStart: null,
        dateSchedulingEnd: null,
        observations: null,
        dateInclusion: null,
        dateUpdate: null
    }
});


window.SessionDetail = Backbone.Model.extend({

    urlRoot: function () {

        return '/patients/' + this.idPatient + "/treatments/" + this.idTreatment + "/sessions";
    },

    initialize: function (options, treatmentId, _id) {
        this.id = _id;
        this.options = options || {};
        this.idPatient = "";
        var i = 0;
        while (this.options[i]) {
            this.idPatient += this.options[i];
            i++;
        }
        this.idTreatment = treatmentId;
        this.validators = {};
        /*
        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? { isValid: false, messages: messages } : { isValid: true };
    },

    defaults: {
        _id: null,
        studentId: null,
        studentName: null,
        teacherId: null,
        teacherName: null,
        typeSession: 'SESSAO',
        typeService: 'INDIVIDUAL',
        everHeld: false,
        canceledSession: false,
        dateSchedulingStart: null,
        dateSchedulingEnd: null,
        observations: null,
        dateInclusion: null,
        dateUpdate: null
    }
});


window.SessionCollection = Backbone.Collection.extend({
    url: function () {
        return '/patients/' + this.idPatient + "/treatments/" + this.idTreatment + "/sessions";
    },

    initialize: function (idPatient, idTreatment) {
        this.idPatient = idPatient;
        this.idTreatment = idTreatment;
    }
});




