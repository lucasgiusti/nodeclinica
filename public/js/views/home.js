window.HomeView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());

        Backbone.history


        $.getJSON('painel', function (data) {
            $("#pENA", this.el).html(data.pENA);
            $("#pENP", this.el).html(data.pENP);
            $("#pEOT", this.el).html(data.pEOT);
            $("#pEUM", this.el).html(data.pEUM);
            $("#pEH", this.el).html(data.pEH);
            $("#pESC", this.el).html(data.pESC);
            $("#pEPN", this.el).html(data.pEPN);

            $("#pTNA", this.el).html(data.pTNA);
            $("#pTNP", this.el).html(data.pTNP);
            $("#pTOT", this.el).html(data.pTOT);
            $("#pTUM", this.el).html(data.pTUM);
            $("#pTH", this.el).html(data.pTH);
            $("#pTSC", this.el).html(data.pTSC);
            $("#pTPN", this.el).html(data.pTPN);

            $("#pANA", this.el).html(data.pANA);
            $("#pANP", this.el).html(data.pANP);
            $("#pAOT", this.el).html(data.pAOT);
            $("#pAUM", this.el).html(data.pAUM);
            $("#pAH", this.el).html(data.pAH);
            $("#pASC", this.el).html(data.pASC);
            $("#pAPN", this.el).html(data.pAPN);
        });


        

        return this;
    }

});