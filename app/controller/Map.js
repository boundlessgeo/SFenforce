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

    doRefresh: function() {
        var map = this.getMap().getMap();
        for (var i=0, ii=map.layers.length; i<ii; ++i) {
            var layer = map.layers[i];
            if (layer instanceof OpenLayers.Layer.Vector) {
                layer.refresh({force: true});
            }
        }
        this.getLastRefresh().setHtml('Last refresh: ' + Ext.Date.format(new Date(), 'H:i A'));
    }

});
