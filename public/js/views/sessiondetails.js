
window.SessionView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },

    render: function () {

        session = this.model.toJSON();

        this.carregaAlunos(session.studentId);
        this.carregaProfessores(session.teacherId);

        $(this.el).html(this.template(session));

        $("#dateSchedulingStart", this.el).datetimepicker({ format: 'dd/mm/yyyy hh:ii', autoclose: true, minuteStep: 15 });
        $('#dateSchedulingEnd', this.el).datetimepicker({ format: 'dd/mm/yyyy hh:ii', autoclose: true, minuteStep: 15 });

        if (Date.parse(session.dateSchedulingStart) < Date.parse(new Date())) {
            $("#dateSchedulingStart", this.el).attr("disabled", "disabled");
            $("#dateSchedulingEnd", this.el).attr("disabled", "disabled");
        }

        //$('legend', this.el).append(patient.name);
        return this;



    },
    events: {
        "change": "change",
        "click .save": "beforeSave",
        "click .delete": "deleteSession",
        "drop #picture": "dropHandler",
        "changeDate #dateSchedulingStart": "change",
        "changeDate #dateSchedulingEnd": "change",
        "click #btnSessaoNaoRealizada": "change",
        "click #btnSessaoRealizada": "change",
        "click #btnSessaoNaoCancelada": "change",
        "click #btnSessaoCancelada": "change",
    },

    change: function (event) {

        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};

        if (target.name == "dateSchedulingStart") {
            change[target.name] = new Date(target.value.substring(6, 10), target.value.substring(3, 5) - 1, target.value.substring(0, 2), target.value.substring(11, 13), target.value.substring(14, 16));

            var dataFinal = new Date(target.value.substring(6, 10), target.value.substring(3, 5) - 1, target.value.substring(0, 2), parseInt(target.value.substring(11, 13)) + 1, target.value.substring(14, 16));
            change["dateSchedulingEnd"] = dataFinal;

            $('#dateSchedulingEnd', this.el).val(formattedDateTime(dataFinal));
        }
        else if (target.name == "dateSchedulingEnd") {
            change[target.name] = new Date(target.value.substring(6, 10), target.value.substring(3, 5) - 1, target.value.substring(0, 2), target.value.substring(11, 13), target.value.substring(14, 16));
        }
        else if (target.name == "everHeld") {
            change[target.name] = $('#everHeld').is(':checked');
        }
        else if (target.name == "canceledSession") {
            change[target.name] = $('#canceledSession').is(':checked');
        }
        else {
            if (target.name == "studentId")
                change["studentName"] = $("#" + target.name + " option[value='" + target.value + "']").text();
            if (target.name == "teacherId")
                change["teacherName"] = $("#" + target.name + " option[value='" + target.value + "']").text();

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
        var mensagem = '';
        if (this.model.id == null)
            mensagem = 'Sessão cadastrada com sucesso';
        else
            mensagem = 'Sessão atualizada com sucesso';
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('patients/' + model.idPatient + '/treatments/' + model.idTreatment + '/sessions/' + model.id, false);
                utils.showAlert('Success!', mensagem, 'alert-success');
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
                    app.navigate('patients/' + model.idPatient + '/treatments/' + model.idTreatment + '/sessions', true);
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
    },

    carregaAlunos: function (studentId) {

        $.getJSON('studentsactive', function (data) {
            var options = '';

            options = '<option value="null" disabled="disabled" selected style="display:none">Obrigatório</option>';
            $.each(data, function (key, val) {

                if (studentId != val._id) {
                    options += '<option value="' + val._id + '">' + val.name + '</option>';
                }
                else {

                    options += '<option value="' + val._id + '" selected>' + val.name + '</option>';
                }
            });

            var html = '';
            html += '<select class="form-control" id="studentId" name="studentId" value="' + studentId + '" >';
            html += options;
            html += '</select>';
            html += '<span class="help-inline"></span>';
            $('#divAlunos', this.el).append(html);
        });
    },

    carregaProfessores: function(teacherId) {

        $.getJSON('teachersactive', function (data) {
            var options = '';

            options = '<option value="null" disabled="disabled" selected style="display:none">Obrigatório</option>';
            $.each(data, function (key, val) {

                if (teacherId != val._id) {
                    options += '<option value="' + val._id + '">' + val.name + '</option>';
                }
                else {
                    options += '<option value="' + val._id + '" selected>' + val.name + '</option>';
                }
            });

            html = '';
            html += '<select class="form-control" id="teacherId" name="teacherId" value="' + teacherId + '">';
            html += options;
            html += '</select>';
            html += '<span class="help-inline"></span>';
            $('#divProfessores', this.el).append(html);
        });
    },
});