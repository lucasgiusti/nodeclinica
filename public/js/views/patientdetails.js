window.PatientView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        
        var patient = this.model.toJSON();

        $(this.el).html(this.template(patient));

        var html = '';

        html += '<article style="float: left; width: 35%">';
        html += '<div class="control-group">';
        html += '<label for="grapes" class="control-label">Estado:</label>';

        html += '<div class="controls">';
        html += '<select class="form-control" id="selstate" name="state" value="' + patient.state + '" >';


        html += carregaEstados(_estadoscidades, patient.state);

        html += '</select>';

        html += '<span class="help-inline"></span>';
        html += '</div>';
        html += '</div>';
        html += '</article>';
        html += '<article style="float: right; width: 62%">';
        html += '<div class="control-group">';
        html += '<label for="grapes" class="control-label">Cidade:</label>';

        html += '<div class="controls">';
        html += '<select class="form-control" id="selcity" name="city" value="' + patient.city + '">';


        html += carregaCidades(_estadoscidades, patient.state, patient.city);

        html += '</select>';
        html += '<span class="help-inline"></span>';
        html += '</div>';
        html += '</div>';
        html += '</article>';

        $('#divEstadosCidades', this.el).append(html);
        
        $('#selstate', this.el).change(function () {
            $('#selcity', this.el).html(carregaCidades(_estadoscidades, $('#selstate option:selected', this.el).val(), ''));

        });

        $('#dateBirth', this.el).datepicker({ format: 'dd/mm/yyyy' });

        return this;
    },

    events: {
        "change": "change",
        "click .save": "beforeSave",
        "click .delete": "deletePatient",
        "drop #picture": "dropHandler",
        "changeDate #dateBirth": "change"
    },

    change: function (event) {

        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};

        if (target.name == "dateBirth") {
            change[target.name] = new Date(target.value.substring(6, 10), target.value.substring(3, 5)-1, target.value.substring(0, 2));
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
        this.savePatient();
        return false;
    },

    savePatient: function () {
        var self = this;
        var mensagem = '';
        console.log('before save');
        if (this.model.id == null)
            mensagem = 'Paciente cadastrado com sucesso';
        else
            mensagem = 'Paciente atualizado com sucesso';
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('patients/' + model.id, false);
                utils.showAlert('Success!', mensagem, 'alert-success');
            },
            error: function (err, message) {
                utils.showAlert('Erro', $.parseJSON(message.responseText).error, 'alert-error');
            }

        });
    },

    deletePatient: function () {
        this.model.destroy({
            success: function (model) {
                $("#delPatient", this.el).hide(function () {
                    app.navigate('#patients', true);
                    self.render();
                });
            },
            error: function (err, message) {
                $("#delPatient", this.el).hide(function () {
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



function carregaEstados(data, userState) {

    var items = [];
    var options = '';

    $.each(data, function (key, val) {

        if (userState != val.sigla) {
            options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
        }
        else {
            options += '<option value="' + val.sigla + '" selected>' + val.sigla + '</option>';
        }
    });

    return options;
};


function carregaCidades(data, userState, userCity) {
    var items = [];
    var options = '';

    $.each(data, function (key, val) {
        if (val.sigla == userState) {
            $.each(val.cidades, function (key_city, val_city) {
                if (userCity != val_city) {
                    options += '<option value="' + val_city + '">' + val_city + '</option>';
                }
                else {
                    options += '<option value="' + val_city + '" selected>' + val_city + '</option>';
                }
            });
        }
    });

    return options;
};