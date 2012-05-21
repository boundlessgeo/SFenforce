Ext.define('SFenforce.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.model.Pco','SFenforce.view.Main'],
    config: {
        refs: {
            main: {
                autoCreate: true,
                xtype: 'main',
                selector: 'main'
            },
            login: 'login'
        },

        before: {
            showLogin: 'findLogin'
        },

        control: {
            main: {
                beforepop: 'onMainBeforePop'
            },
            login: {
                login: 'validateLogin'
            }
        },

        routes: {
            '': 'showLogin'
        }
    },

    init: function() {
        //Ext.getStore('Categories').on('load', this.onStoreLoad, this);
    },    
      
    showLogin: function(){
        this.getMain().push(Ext.create('SFenforce.view.Login'));
        if(SFenforce.userInfo){
            this.getLogin().setValues(SFenforce.userInfo);
        }
    },    
    
    validateLogin: function(form) {
        var userInfo = Ext.create('SFenforce.model.Pco', form.getValues());
        var errors = userInfo.validate();
        if (errors.isValid()) {
            this.storeLogin(userInfo);
            this.showMap();
        } else {
            var message = '';
            Ext.each(errors.items,function(rec,i){
                message += rec._message+"<br>";
            });
            Ext.Msg.alert(null, message, function(){});
        }
    },
    
    storeLogin: function(pcoRecord){
        Ext.getStore('Pco').setData([pcoRecord]);
        SFenforce.userInfo = pcoRecord.data;
    },
    
    findLogin: function(action){
        var store = Ext.getStore('Pco');
        if(store.getTotalCount()){
            SFenforce.userInfo = store.getAt(0).data;
        }
        action.resume();
    },
    
    showMap: function(){
        var map = Ext.create('SFenforce.view.Map',{
            mapExtent: [-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212]
        });
        this.getMain().pop();
        this.getMain().push(map);
    },
    
    onMainBeforePop:Ext.emptyFn
});
