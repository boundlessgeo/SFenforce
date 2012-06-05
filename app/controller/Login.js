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
            loginButton: '#loginButton',
            lastRefresh: '#lastRefresh',
            locateButton: '#locateButton',
            navbarItems: 'main titlebar component',
            zoomSelector: '#zoomSelector',
            zoomTo: 'login [name="zoomTo"]'
        },

        control: {
            login: {
                show: 'hideNavButtons'
            },
            map: {
                show: 'showNavButtons'
            },
            loginButton: {
                tap: 'validateLogin'
            },
            '.login [name="badge"]': {
                change: 'findBeats'
            },
            zoomSelector: {
                toggle: 'setZoomTo'
            }
        },

        routes: {
            '': 'showLogin'
        }
    },

    showLogin: function(){
        this.getMain().push(Ext.create('SFenforce.view.Login'));
        this.setZoomTo(this.getZoomSelector());
    },    
    
    showNavButtons: function(){
        Ext.each(this.getNavbarItems(),function(cmp){
            cmp.show();
        });
    },
    
    hideNavButtons: function(){
        Ext.each(this.getNavbarItems(),function(cmp){
            cmp.hide();
        });
    },
    
    setZoomTo: function(btnGroup){
        var pressedBtn = btnGroup.getPressedButtons()[0]; //should always be 1 & only 1 pressed
        if(pressedBtn){
            this.getZoomTo().setValue(pressedBtn.value);
        }
    },
    
    validateLogin: function(btn) {
        var values = this.getLogin().getValues();
        var userInfo = Ext.create('SFenforce.model.Pco', values);
        var errors = userInfo.validate();
        if (errors.isValid()) {
            var bounds = null;
            var ids = values['beats'];
            if (Ext.isString(ids)) { 
                ids = ids.split(",");
            }
            var store = Ext.getStore('Beats');
            if(values['zoomTo'] != 'mylocation'){
                store.each(function(record) {
                    if(values['zoomTo'] == 'mybeats'){
                        if (Ext.Array.indexOf(ids, record.get('name')) > -1) {
                            if (bounds === null) {
                                bounds = record.get('geometry').getBounds();
                            } else {
                                bounds.extend(record.get('geometry').getBounds());
                            }
                        }
                    } else if(values['zoomTo'] == 'allbeats') {
                        if (bounds === null) {
                            bounds = record.get('geometry').getBounds();
                        } else {
                            bounds.extend(record.get('geometry').getBounds());
                        }
                    }
                });
                SFenforce.util.Config.setBeatsBounds(bounds || SFenforce.util.Config.getBounds());
            } else {
                //set something for the map to start with
                bounds = SFenforce.util.Config.getBounds();
            }
            this.storeLogin(userInfo);
            this.showMap(bounds || SFenforce.util.Config.getBounds(), ids);
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
    
    findBeats: function(input, evt){
        var store = Ext.getStore('pcoStore');
        var idx = store.findExact('badge', ''+input.getValue()); //ensure we are using a string
        if (idx > -1) {
            var rec = store.getAt(idx);
            var beatsFld = Ext.ComponentQuery.query('login [name="beats"]')[0];
            var zoomType = Ext.ComponentQuery.query('#zoomSelector button[value='+rec.get('zoomTo')+']');
            if (beatsFld && beatsFld.getValue() == null) {
                beatsFld.setValue(rec.get('beats'));
                if(zoomType.length){
                    this.setZoomTo(this.getZoomSelector().setPressedButtons(zoomType));
                }
            }
        }
    },
    
    showMap: function(bounds, beats){
        var map = Ext.create('SFenforce.view.Map',{
            beats: beats,
            mapExtent: bounds.toArray()
        });
        this.getMain().pop();
        this.getMain().push(map);
        this.getLastRefresh().setHtml(Ext.Date.format(new Date(), 'H:i A'));
        if(SFenforce.userInfo.zoomTo == 'mylocation'){
           this.getLocateButton().setPressedButtons(Ext.ComponentQuery.query('#locateButton > button'));
        }
    },
    
    onMainBeforePop:Ext.emptyFn
});
