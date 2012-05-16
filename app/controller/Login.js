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
                    var userInfo = Ext.ModelMgr.create(form.getValues(), 'SFenforce.model.Pco');
                    var errors = userInfo.validate();
                    if (errors.isValid()) {
                        this.getMainPanel().setActiveItem(1);
                        app.userInfo = userInfo;
                    } else {
                        var message = '';
                        Ext.each(errors.items,function(rec,i){
                            message += rec._message+"<br>";
                        });
                        Ext.Msg.alert(null, message, function(){});
                    }
                }
            }
        });
    }
});
