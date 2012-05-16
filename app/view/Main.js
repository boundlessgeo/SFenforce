Ext.define("SFenforce.view.Main", {
    extend: 'Ext.Panel',
    alias: 'widget.main',
    config: {
        layout: 'card'
    },
    requires: [
        'SFenforce.view.Login'
    ],
    constructor: function() {
        this.callParent();
        var streets = new OpenLayers.Layer.XYZ(
            "MapBox Streets",
        [
            "http://a.tiles.mapbox.com/v3/mapbox.mapbox-streets/${z}/${x}/${y}.png",
            "http://b.tiles.mapbox.com/v3/mapbox.mapbox-streets/${z}/${x}/${y}.png",
            "http://c.tiles.mapbox.com/v3/mapbox.mapbox-streets/${z}/${x}/${y}.png",
            "http://d.tiles.mapbox.com/v3/mapbox.mapbox-streets/${z}/${x}/${y}.png"
        ], {
            attribution: "Tiles &copy; <a href='http://mapbox.com/'>MapBox</a> | " +
                "Data &copy; <a href='http://www.openstreetmap.org/'>OpenStreetMap</a> " +
                "and contributors, CC-BY-SA",
            sphericalMercator: true,
            wrapDateLine: true,
            transitionEffect: "resize",
            buffer: 1,
            numZoomLevels: 17
        });

        var parking = new OpenLayers.Layer.WMS(
            "Parking spaces",
            "http://sfpark.demo.opengeo.org/geoserver/wms?",
            {layers: "SFenforce:parkingspaces", format: "image/png", transparent: true}
        );

        // OpenLayers specific setup
        var map = new OpenLayers.Map({
            projection: "EPSG:900913",
            theme: null,
            controls : [
                new OpenLayers.Control.Zoom(),
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions : {
                        interval : 100,
                        enableKinetic : true
                    }
                }),
                new OpenLayers.Control.Attribution()
            ]
        });

        map.addLayers([streets, parking]);

        var mapdemo = Ext.create('GXM.Map', {
            map : map,
            extent: [-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212]
        });
        this.add([Ext.create("SFenforce.view.Login"), mapdemo]);

    }
});
