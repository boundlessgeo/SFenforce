Ext.define('SFenforce.util.MockTracker', {
    extend: 'GXM.plugin.Tracker',
    config:{
        bearing: 0,
        distance: 0.00025,
        center: null
    },
    init: function(host){
        this.callParent(arguments);
        var bounds = SFenforce.util.Config.getBeatsBounds() || SFenforce.util.Config.getBounds();
        bounds = OpenLayers.Bounds.fromArray(bounds);
        var center = bounds.getCenterLonLat().transform('EPSG:900913','EPSG:4326');
        this.setCenter([center.lon,center.lat]);
        this.setBearing((Math.random() * 360) * Math.PI / 180);
    },
    updateTrack: function(geo){
        var bearing = this.getBearing(), dist = this.getDistance(), center = this.getCenter();
        var dx = Math.cos(bearing) * dist;
        var dy = Math.sin(bearing) * dist;
        this._longitude = dx + center[0];
        this._latitude = dy + center[1];
        this._accuracy = 100;
        this.setCenter([this._longitude, this._latitude]);
        this.callParent(arguments);
    }
});