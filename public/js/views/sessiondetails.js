window.SessionView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var session = this.model.toJSON();

        $(this.el).html(this.template(session));

        carregaAlunos(session.studentId);
        carregaProfessores(session.teacherId);

        $('#dateSchedulingStart', this.el).datepicker({ format: 'dd/mm/yyyy' });
        $('#dateSchedulingEnd', this.el).datepicker({ format: 'dd/mm/yyyy' });
        $('#dateStart', this.el).datepicker({ format: 'dd/mm/yyyy' });
        $('#dateEnd', this.el).datepicker({ format: 'dd/mm/yyyy' });


        //$('legend', this.el).append(patient.name);

        return this;
    },

    events: {
        "change": "change",
        "click .save": "beforeSave",
        "click .delete": "deleteSession",
        "drop #picture": "dropHandler",
        "changeDate #dateStart": "change",
        "changeDate #dateEnd": "change"
    },

    change: function (event) {

        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};


        if (target.name == "dateStart" || target.name == "dateEnd") {
            change[target.name] = new Date(target.value.substring(6, 10), target.value.substring(3, 5) - 1, target.value.substring(0, 2));
        }
        else {
            change[target.name] = target.value;
        }

        this.model.set(change);


        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveSession();
        return false;
    },

    saveSession: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();

                app.navigate('patients/' + model.idPatient + '/sessions/' + model.id, false);
                utils.showAlert('Success!', 'Tratamento atualizado com sucesso', 'alert-success');
            },
            error: function (err, message) {
                utils.showAlert('Erro', $.parseJSON(message.responseText).error, 'alert-error');
            }

        });
    },

    deleteSession: function () {
        this.model.destroy({
            success: function (model) {
                $("#delSession", this.el).hide(function () {
                    app.navigate('patients/' + model.idPatient + '/sessions', true);
                    self.render();
                });
            },
            error: function (err, message) {
                $("#delSession", this.el).hide(function () {
                    utils.showAlert('Erro', $.parseJSON(message.responseText).error, 'alert-error');
                });
            }
        });
        return false;
    },

    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }

});


function carregaAlunos(studentId) {

    $.getJSON('studentsactive', function (data) {
        var html = '';
        html += '<select class="form-control" id="studentId" name="studentId" value="' + studentId + '" >';
        var options = '';

        $.each(data, function (key, val) {
            if (studentId != val._id) {
                options += '<option value="' + val._id + '">' + val.name + '</option>';
            }
            else {
                options += '<option value="' + val._id + '" selected>' + val.name + '</option>';
            }
        });

        html += options;
        html += '</select>';
        html += '<span class="help-inline"></span>';
        $('#divAlunos', this.el).append(html);
    });
};

function carregaProfessores(teacherId) {

    $.getJSON('teachersactive', function (data) {
        html = '';
        html += '<select class="form-control" id="teacherId" name="teacherId" value="' + teacherId + '">';
        var options = '';

        $.each(data, function (key, val) {

            if (teacherId != val._id) {
                options += '<option value="' + val._id + '">' + val.name + '</option>';
            }
            else {
                options += '<option value="' + val._id + '" selected>' + val.name + '</option>';
            }
        });
        
        html += options;
        html += '</select>';
        html += '<span class="help-inline"></span>';
        $('#divProfessores', this.el).append(html);
    });
};