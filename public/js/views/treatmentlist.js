window.TreatmentListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var patient = this.model.models;
        patient = patient[0].toJSON();
        var treatments = patient.treatments;
        var len = treatments.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
        var html = '';
        var jsonObject = '';


        $(this.el).html(new TreatmentsView().render().el);

        if (len > 0) {

            var aux;
            var acabou = false;
            while (!acabou) {
                acabou = true;
                for (var i = 1; i < treatments.length; i++) {
                    if (treatments[i - 1].dateInclusion < treatments[i].dateInclusion) {
                        aux = treatments[i];
                        treatments[i] = treatments[i - 1];
                        treatments[i - 1] = aux;
                        acabou = false;
                    }
                }
            }

            for (var i = startPos; i < endPos; i++) {


                jsonObject = treatments[i];

                html += '<tr>';
                html += '<td><a href="#patients/' + patient._id  + '/treatments/' + jsonObject._id + '">' + jsonObject.serviceArea + '</td>';

                if (jsonObject.doctor != null)
                    html += '<td>' + jsonObject.doctor + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.dateInclusion != null)
                    html += '<td>' + formattedDate(jsonObject.dateInclusion) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.treatmentPerformed)
                    html += '<td>REALIZADO</td>';
                else if (jsonObject.canceledTreatment)
                    html += '<td>CANCELADO</td>';
                else
                    html += '<td>ABERTO</td>';

                html += '</tr>';

            }

            $('#tbTreatments > tbody:last', this.el).append(html);
            $(this.el).append(new TreatmentsPaginator({ model: this.model, page: this.options.page }).render().el);
        }
        $('legend', this.el).append(patient.name);

        return this;
    }
});

window.TreatmentsView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }

});

window.TreatmentsPaginator = Backbone.View.extend({

    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render: function () {

        var items = this.model.models;
        var len = items.length;
        var pageCount = Math.ceil(len / 8);

        var options = {
            currentPage: this.options.page,
            totalPages: pageCount,
            size: "normal",
            alignment: "center",
            pageUrl: function (type, page, current) {

                var url = window.location.href;

                if (url.indexOf('page', 4) > -1) {
                    url = url.substring(0, url.lastIndexOf('/') + 1) + page;
                }
                else {

                    url += "/page/" + page;
                }


                return url;

            }
        }

        $(this.el).bootstrapPaginator(options);

        return this;
    }
});