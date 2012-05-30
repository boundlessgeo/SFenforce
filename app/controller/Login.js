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
            login: 'login',
            lastRefresh: '#lastRefresh',
            refreshButton: '#refreshButton',
            locateButton: '#locateButton'
        },

        control: {
            main: {
                beforepop: 'onMainBeforePop'
            },
            login: {
                login: 'validateLogin'
            },
            '.login [name="badge"]': {
                keyup: 'findBeats'
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
            this.getLocateButton().hide();
            this.getRefreshButton().hide();
            this.getLastRefresh().hide();
        }, this);
        this.getMain().push(Ext.create('SFenforce.view.Login'));
    },    
    
    validateLogin: function(form) {
        var values = form.getValues();
        var userInfo = Ext.create('SFenforce.model.Pco', values);
        var errors = userInfo.validate();
        if (errors.isValid()) {
            var bounds = null;
            var ids = values['beats'];
            if (Ext.isString(ids)) { 
                ids = ids.split(",");
            }
            if (values['zoomtobeats'] === true) {
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
            this.showMap(bounds, ids);
        } else {
            var message = '';
            Ext.each(errors.items,function(rec,i){
                message += rec._message+"<br>";
            });
            Ext.Msg.alert(null, message, function(){});
        }
    },
    
    storeLogin: function(pcoRecord){
        var store = Ext.getStore('pcoStore');
        if(!store.getData().getByKey(pcoRecord.get("badge"))){
            store.add(pcoRecord);    
        }
        store.getProxy().batch({
                operations: {update:[pcoRecord]},
                listeners: store.getBatchListeners()
        });
        SFenforce.userInfo = pcoRecord.data;
    },
    
    findLogin: function(action){
        var store = Ext.getStore('Pco');
        if(store.getTotalCount()){
            SFenforce.userInfo = store.getAt(0).data;
        }
        action.resume();
    },
    
    findBeats: function(input, evt){
        var store = Ext.getStore('pcoStore');
        var rec = store.getById(input.getValue());
        if(rec){
            var fld = Ext.ComponentQuery.query('.login [name="beats"]');
            fld && fld[0].setValue(rec.get('beats'));
        }
    },
    
    showMap: function(bounds, beats){
        var map = Ext.create('SFenforce.view.Map',{
            beats: beats,
            mapExtent: bounds.toArray()
        });
        this.getMain().pop();
        this.getMain().push(map);
        this.getLocateButton().show();
        this.getRefreshButton().show();
        this.getLastRefresh().setHtml('Last refresh: ' + Ext.Date.format(new Date(), 'H:i A'));
        this.getLastRefresh().show();
    },
    
    onMainBeforePop:Ext.emptyFn
});
