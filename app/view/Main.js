Ext.define("SFenforce.view.Main", {
    extend: 'Ext.Panel',
    config: {
        layout: 'fit'
    },
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

        var blockfaces = new OpenLayers.Layer.WMS(
            "Blockfaces",
            "http://sfpark.demo.opengeo.org/geoserver/wms?",
            {layers: "sfpark:BLOCKFACE_AVAILABILITY", format: "image/png", transparent: true}
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

        map.addLayers([streets, blockfaces]);

        var mapdemo = Ext.create('GXM.Map', {
            map : map,
            extent: [-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212]
        });
        this.add(mapdemo);
    }
});
