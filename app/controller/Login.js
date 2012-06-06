Ext.define('SFenforce.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.model.Pco','SFenforce.view.Main'],
    config: {
        refs: {
            main: 'main',
            login: 'login',
            loginButton: '#loginButton',
            lastRefresh: '#lastRefresh',
            locateButton: '#locateButton',
            navbarItems: 'main titlebar component component',
            zoomSelector: '#zoomSelector',
            zoomTo: 'login [name="zoomTo"]'
        },

        control: {
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
        Ext.Viewport.add(Ext.create('SFenforce.view.Login'));
        Ext.Viewport.setActiveItem(this.getLogin());
        this.setZoomTo(this.getZoomSelector());
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
        var main = Ext.create('SFenforce.view.Main',{
            items:[{
                xtype: 'maptoolbar'
            }, {
                xtype: 'map',
                beats: beats
            }]
        });
        Ext.Viewport.add(main);
        Ext.Viewport.setActiveItem(main);
        this.getLastRefresh().setHtml(Ext.Date.format(new Date(), 'H:i A'));
        if(SFenforce.userInfo.zoomTo == 'mylocation'){
           var locationToggle = this.getLocateButton();
           var locationButton = Ext.ComponentQuery.query('#locateButton > button')[0];
           locationToggle.setPressedButtons([locationButton]);
           locationToggle.fireEvent('toggle', locationToggle, locationButton, true);
        } else {
            main.down('map').getMap().zoomToExtent(bounds);
        }
    }
});
