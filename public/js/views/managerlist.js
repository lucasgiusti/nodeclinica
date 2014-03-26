window.ManagerListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var managers = this.model.models;
        var len = managers.length;
        var startPos = (this.options.page - 1) * 10;
        var endPos = Math.min(startPos + 10, len);
        var html = '';
        var jsonObject = '';



        $(this.el).html(new ManagersView().render().el);

        if (len > 0) {
            for (var i = startPos; i < endPos; i++) {


                jsonObject = managers[i].toJSON();



                html += '<tr>';
                html += '<td>' + jsonObject.registration + '</td>';
                html += '<td><a href="#managers/' + jsonObject._id + '">' + jsonObject.name + '</td>';
                //html += '<td><a data-toggle="modal" href="#addAccount">' + jsonObject.name + '</td>';
                

                if (jsonObject.cpf != null)
                    html += '<td>' + jsonObject.cpf + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.dateInclusion != null)
                    html += '<td>' + formattedDate(jsonObject.dateInclusion) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.active) {

                    if (userAccountAccess.type == 'ADMIN') {
                        html += '<td><a data-toggle="modal" data-id="' + jsonObject.mail + '" href="#addAccount" class="openAddAccount">Sim</a></td>';
                    }
                    else {
                        html += '<td>Sim</td>';
                    }
                }
                else
                    html += '<td>Não</td>';

                html += '</tr>';
            }

            $('#tbManagers > tbody:last', this.el).append(html);
            $(this.el).append(new ManagersPaginator({ model: this.model, page: this.options.page }).render().el);
        }
        return this;
    }
});

window.ManagersView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }

});

window.ManagersPaginator = Backbone.View.extend({

    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render: function () {

        var items = this.model.models;
        var len = items.length;
        var pageCount = Math.ceil(len / 10);

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


var BaseModalView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
    }
});