Ext.define('SFenforce.controller.Map', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.view.Main', 'SFenforce.view.Map'],
    config: {
        refs: {
            refreshButton: '#refreshButton',
            lastRefresh: '#lastRefresh',
            map: 'map'
        },

        control: {
            refreshButton: {
                tap: 'doRefresh'
            }
        }

    },

    doUpdate: function() {
        this.getLastRefresh().setHtml(Ext.Date.format(new Date(), 'H:i A'));
        var map = this.getMap().getMap();
        var layer = map.getLayersByClass('OpenLayers.Layer.Vector')[0];
        layer.events.un({'loadend': this.doUpdate, scope: this});
    },

    doRefresh: function() {
        var map = this.getMap().getMap();
        var layer = map.getLayersByClass('OpenLayers.Layer.Vector')[0];
        layer.events.on({'loadend': this.doUpdate, scope: this});
        layer.refresh({force: true});
    }

});
