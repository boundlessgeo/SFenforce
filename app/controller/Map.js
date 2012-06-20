Ext.define('SFenforce.controller.Map', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.view.Main', 'SFenforce.view.Map'],
    config: {
        refs: {
            refreshButton: '#refreshButton',
            zoomButton: '#zoomButton',
            lastRefresh: '#lastRefresh',
            locateButton: '#locateButton',
            myPositionButton: '#myPosition',
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
            },
            myPositionButton: {
                tap: 'zoomToUser'
            }
        }

    },

    zoomToBeats: function() {
        var bounds = OpenLayers.Bounds.fromArray(SFenforce.util.Config.getBeatsBounds());
        var map = this.getMap().getMap();
        map.zoomToExtent(bounds || OpenLayers.Bounds.fromArray(SFenforce.util.Config.getBounds()));
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
        var tracker = this.getMap().getGeo();
        if(tracker){
            tracker.setUpdateAction((pressed)? 'center' : 'none');
            tracker.updateLocation();
        }
        button.setUi((pressed) ? 'confirm' : 'action');
    },
    
    zoomToUser: function(){
        var map = this.getMap().getMap();
        var tracker = this.getMap().getGeo();
        if(tracker){
            tracker.updateLocation(function(geo){
                var geoCenter = tracker.getVector().getDataExtent().getCentroid();
                map.setCenter([geoCenter.x,geoCenter.y], SFenforce.util.Config.getGeolocationZoomLevel());    
            });
        }
    }
});
