Ext.define("SFenforce.view.Map",{
extend: 'GXM.Map',
initialize:function(){
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
            numZoomLevels: 17,
            isBaseLayer: true
        });

        var parking = new OpenLayers.Layer.WMS(
            "Parking spaces",
            "http://sfpark.demo.opengeo.org/geoserver/wms?",
            {layers: "SFenforce:parkingspaces", format: "image/png", transparent: true, styles: 'spaces_opportunities'}
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
                new OpenLayers.Control.Attribution()//,
                //new OpenLayers.Control.Geolocation()
            ]
        });

        map.addLayers([streets, parking]);
        
        this.setMap(map);

        this.setPlugins([
            new GXM.plugin.Tracker({
                trackSuspended: false,
                allowHighAccuracy: false
            })
        ]);

        this.callParent(arguments);
    }
});
