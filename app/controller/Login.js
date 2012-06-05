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
            navbarItems: 'main titlebar component component',
            zoomSelector: '#zoomSelector',
            zoomTo: 'login [name="zoomTo"]',
            refreshButton: '#refreshButton',

            legendButton: '#legendButton'
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
        Ext.each(Ext.ComponentQuery.query('main titlebar component component'),function(cmp){
            cmp.show();
        });
    },
    
    hideNavButtons: function(){
        Ext.each(Ext.ComponentQuery.query('main titlebar component component'),function(cmp){
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
            store.each(function(record) {
                if (Ext.Array.indexOf(ids, record.get('name')) > -1) {
                    if (bounds === null) {
                        bounds = record.get('geometry').getBounds();
                    } else {
                        bounds.extend(record.get('geometry').getBounds());
                    }
                }
            });
            //store the beat bounds
            SFenforce.util.Config.setBeatsBounds(bounds || SFenforce.util.Config.getBounds());
                                    
            if(values['zoomTo'] == 'allbeats') {
                bounds = null;
                store.each(function(record) {
                    if(bounds === null) {
                        bounds = record.get('geometry').getBounds();
                    } else {
                        bounds.extend(record.get('geometry').getBounds());
                    }
                });
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
           var locationToggle = this.getLocateButton();
           var locationButton = Ext.ComponentQuery.query('#locateButton > button')[0];
           locationToggle.setPressedButtons([locationButton]);
           locationToggle.fireEvent('toggle', locationToggle, locationButton, true);
        }
    },
    
    onMainBeforePop:Ext.emptyFn
});
