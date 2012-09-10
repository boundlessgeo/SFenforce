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
            backButton: '#backLoginButton',
            map: 'map',
            login: 'login'
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
            },
            backButton: {
                tap: 'backToLogin'
            }
        }

    },

    zoomToBeats: function() {
        var bounds = OpenLayers.Bounds.fromArray(SFenforce.util.Config.getBeatsBounds());
        var map = this.getMap().getMap();
        map.zoomToExtent(bounds || OpenLayers.Bounds.fromArray(SFenforce.util.Config.getBounds()));
    },

    doUpdate: function() {
        this.getLastRefresh().setLastUpdate(new Date());
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

    showLocationError: function() {
        Ext.Msg.show({
            zIndex: 1000,
            title: SFenforce.util.Config.getErrorTitle(),
            message: SFenforce.util.Config.getGpsErrorMsg(),
            buttons: [{text: 'OK', ui: 'sfbutton'}],
            promptConfig: false
        });
        var map = this.getMap().getMap();
        var ctrl = map.getControlsByClass('OpenLayers.Control.Geolocate')[0];
        ctrl.events.unregister("locationfailed", this, this.showLocationError);
    },
    
    toggleTracker: function(cmp, button, pressed){
        var map = this.getMap().getMap();
        var ctrl = map.getControlsByClass('OpenLayers.Control.Geolocate')[0];
        if (pressed) {
            ctrl.events.register("locationfailed", this, this.showLocationError);
            ctrl.deactivate();
            ctrl.watch = true;
            ctrl.activate();
        } else {
            ctrl.deactivate();
            ctrl.watch = false;
            ctrl.activate();
        }
    },

    onLocationUpdate: function(evt) {
        var map = this.getMap().getMap();
        map.setCenter(new OpenLayers.LonLat(evt.point.x, evt.point.y), SFenforce.util.Config.getGeolocationZoomLevel());
        var ctrl = map.getControlsByClass('OpenLayers.Control.Geolocate')[0];
        ctrl.events.unregister("locationupdated", this, this.onLocationUpdate);
    },
    
    zoomToUser: function(){
        var map = this.getMap().getMap();
        var ctrl = map.getControlsByClass('OpenLayers.Control.Geolocate')[0];
        ctrl.events.register("locationupdated", this, this.onLocationUpdate);
        ctrl.getCurrentLocation();
    },
    
    backToLogin: function(){
        Ext.Viewport.setActiveItem(this.getLogin());
    }
});
