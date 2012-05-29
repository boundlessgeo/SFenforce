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
        this.getMain().on('back', function() {
            this.getMain().getNavigationBar().down('#locateButton').hide();
        }, this);
        this.getMain().push(Ext.create('SFenforce.view.Login'));
        if(SFenforce.userInfo){
            this.getLogin().setValues(SFenforce.userInfo);
        }
    },    
    
    validateLogin: function(form) {
        var values = form.getValues();
        var userInfo = Ext.create('SFenforce.model.Pco', values);
        var errors = userInfo.validate();
        if (errors.isValid()) {
            var bounds = null;
            if (values['zoomtobeats'] === true) {
                var ids = values['beats'].split(",");
                var store = Ext.getStore('Beats');
                store.each(function(record) {
                    if (Ext.Array.indexOf(ids, record.get('name')) > -1) {
                        if (bounds === null) {
                            bounds = record.get('geometry').getBounds();
                        } else {
                            bounds.extend(record.get('geometry').getBounds());
                        }
                    }
                });
            } else {
                // city-wide view
                bounds = new OpenLayers.Bounds(-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212);
            }
            this.storeLogin(userInfo);
            this.showMap(bounds);
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
    
    showMap: function(bounds){
        var map = Ext.create('SFenforce.view.Map',{
            mapExtent: bounds.toArray()
        });
        this.getMain().pop();
        this.getMain().push(map);
        this.getMain().getNavigationBar().down('#locateButton').show();
    },
    
    onMainBeforePop:Ext.emptyFn
});
