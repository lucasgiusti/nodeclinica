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
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Endere�o" };
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
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "Informe o Endere�o" };
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












/* TEACHERS */


window.Teacher = Backbone.Model.extend({

    urlRoot: "/teachers",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
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
        name: "",
        type: "ATENDENTE",
        active: true
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

        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
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
        name: "",
        password: "123",
        type: "ATENDENTE",
        active: true
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

        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
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
        name: "",
        password: "123",
        type: "ATENDENTE",
        active: true
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

        this.validators.name = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a name" };
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a grape variety" };
        };

        this.validators.country = function (value) {
            return value.length > 0 ? { isValid: true } : { isValid: false, message: "You must enter a country" };
        };
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
        name: ""
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