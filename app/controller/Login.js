Ext.define('SFenforce.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.view.FeatureRenderer', 'SFenforce.model.Pco','SFenforce.view.Main'],
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
            refreshButton: '#refreshButton',
            zoomButton: '#zoomButton',
            locateButton: '#locateButton'
        },

        control: {
            main: {
                beforepop: 'onMainBeforePop'
            },
            loginButton: {
                tap: 'validateLogin'
            },
            '.login [name="badge"]': {
                change: 'findBeats'
            }
        },

        routes: {
            '': 'showLogin'
        }
    },

    showLogin: function(){
        this.getMain().on('back', function() {
            this.getLocateButton().hide();
            this.getZoomButton().hide();
            this.getRefreshButton().hide();
            this.getLastRefresh().hide();
        }, this);
        this.getMain().push(Ext.create('SFenforce.view.Login'));
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
            SFenforce.util.Config.setBeatsBounds(bounds || SFenforce.util.Config.getBounds());
            if (values['zoomtobeats'] !== true) {
                bounds = SFenforce.util.Config.getBounds();
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
    
    findBeats: function(input, evt){
        var store = Ext.getStore('pcoStore');
        var idx = store.findExact('badge', input.getValue());
        if (idx > -1) {
            var rec = store.getAt(idx);
            var fld = Ext.ComponentQuery.query('.login [name="beats"]');
            if (fld && fld[0] && fld[0].getValue() == null) {
                fld[0].setValue(rec.get('beats'));
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
        var style = SFenforce.util.Config.getStyle();
        for (var i=0, ii=style.rules.length; i<ii; ++i) {
            var rule = style.rules[i];
            this.getMain().getNavigationBar().add([{
                xtype: 'featurerenderer',
                symbolType: "Point",
                symbolizers: [Ext.apply(style.defaultStyle, rule.symbolizer)]
            }, {
                xtype: 'label', 
                html: rule.name
            }]);
        }
        this.getLocateButton().show();
        this.getZoomButton().show();
        this.getRefreshButton().show();
        this.getLastRefresh().setHtml(Ext.Date.format(new Date(), 'H:i A'));
        this.getLastRefresh().show();
    },
    
    onMainBeforePop:Ext.emptyFn
});
