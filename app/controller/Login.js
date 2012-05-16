Ext.define('SFenforce.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.model.Pco'],
    config: {
        refs: {
            'mainPanel': 'main'
        }
    },
    init: function(app) {
        this.control({
            'login': {
                'login': function(form) {
                    this.getMainPanel().setActiveItem(1);
                    app.userInfo = Ext.ModelMgr.create(form.getValues(), 'SFenforce.model.Pco');
                }
            }
        });
    }
});
