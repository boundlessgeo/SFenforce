Ext.define('SFenforce.controller.Map', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.view.Main', 'SFenforce.view.Map'],
    config: {
        refs: {
            refreshButton: '#refreshButton',
            zoomButton: '#zoomButton',
            lastRefresh: '#lastRefresh',
            locateButton: '#locateButton',
            map: 'map'
        },

        control: {
            refreshButton: {
                tap: 'doRefresh'
            },
            zoomButton: {
                tap: 'zoomToBeats'
            },
            locateButton: {
                toggle: 'toggleTracker'
            }
        }

    },

    zoomToBeats: function() {
        var bounds = SFenforce.util.Config.getBeatsBounds();
        var map = this.getMap().getMap();
        //turn off tracking if it is on
        var locationToggle = this.getLocateButton();
        locationToggle.setPressedButtons([]);
        locationToggle.fireEvent('toggle', locationToggle, locationToggle.query('> button')[0], false);
        map.zoomToExtent(bounds);
    },

    doUpdate: function() {
        this.getLastRefresh().setHtml(Ext.Date.format(new Date(), 'H:i A'));
        var map = this.getMap().getMap();
        var layer = map.getLayersByClass('OpenLayers.Layer.Vector')[0];
        layer.events.un({'loadend': this.doUpdate, scope: this});
    },

    doRefresh: function() {
        var map = this.getMap().getMap();
        var layer = map.getLayersByName(SFenforce.util.Config.getCitationLayerName())[0];
        layer.events.on({'loadend': this.doUpdate, scope: this});
        layer.refresh({force: true});
        layer = map.getLayersByName(SFenforce.util.Config.getNoDataLayerName())[0];
        layer.redraw(true);
    },
    
    toggleTracker: function(cmp, button, pressed){
        var map = this.getMap();
        var tracker = map.getGeo();
        if(!tracker){
            tracker = map._tracker;
            tracker.init(map);
        }
        tracker.setTrackSuspended(!pressed);
        button.setUi((pressed) ? 'confirm' : 'action');
    }
});
