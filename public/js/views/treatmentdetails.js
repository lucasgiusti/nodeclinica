﻿window.TreatmentView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var treatment = this.model.toJSON();

        $(this.el).html(this.template(treatment));

        $('#dateEnd', this.el).datepicker({ format: 'dd/mm/yyyy' });

        //$('legend', this.el).append(patient.name);

        return this;
    },

    events: {
        "change": "change",
        "click .save": "beforeSave",
        "click .delete": "deleteTreatment",
        "drop #picture": "dropHandler",
        "changeDate #dateEnd": "change"
    },

    change: function (event) {

        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};


        if (target.name == "dateEnd") {
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
        this.saveTreatment();
        return false;
    },

    saveTreatment: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();

                app.navigate('patients/' + model.idPatient + '/treatments/' + model.id, false);
                utils.showAlert('Success!', 'Tratamento atualizado com sucesso', 'alert-success');
            },
            error: function (err, message) {
                utils.showAlert('Erro', $.parseJSON(message.responseText).error, 'alert-error');
            }

        });
    },

    deleteTreatment: function () {
        this.model.destroy({
            success: function (model) {
                $("#delTreatment", this.el).hide(function () {
                    app.navigate('patients/' + model.idPatient + '/treatments', true);
                    self.render();
                });
            },
            error: function (err, message) {
                $("#delTreatment", this.el).hide(function () {
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
