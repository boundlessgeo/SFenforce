Ext.define("SFenforce.view.Map",{
requires: ['Ext.carousel.Carousel', 'GXM.FeaturePopup', 'GXM.plugin.Tracker'],
extend: 'GXM.Map',
initialize:function(){
        // work around the GFI issue in GeoServer for now
        this.setMaxWidth(1100);
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
            numZoomLevels: 18,
            isBaseLayer: true
        });

        var parking = new OpenLayers.Layer.WMS(
            "Parking spaces",
            "/geoserver/wms?",
            {layers: "SFenforce:ParkingSpaces", format: "image/png", transparent: true, styles: 'spaces_opportunities'}
        );

        var highlight = new OpenLayers.Layer.Vector(null, {
            style: {
                graphicName: 'star',
                strokeColor: '#00FF00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 5
            }
        });

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
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.WMSGetFeatureInfo({maxFeatures: 1, infoFormat: "application/vnd.ogc.gml", autoActivate: true, eventListeners: {
                    getfeatureinfo: function(evt) {
                        if (evt.features && evt.features[0]) {
                            var feature = evt.features[0];
                            feature.geometry.transform('EPSG:4326', 'EPSG:900913');
                            highlight.addFeatures([feature]);
                            Ext.Viewport.add({
                                xtype: 'panel', 
                                layout: 'fit',
                                listeners: {
                                    hide: function() {
                                        highlight.destroyFeatures();
                                    }
                                },
                                width: 150, 
                                height: 150,
                                top: evt.xy.y + 25,
                                left: evt.xy.x + 25,
                                modal: true, 
                                hideOnMaskTap: true, 
                                items: [{
                                    xtype: 'carousel', 
                                    items: [{
                                        xtype: 'gxm_featurepopup',
                                        centered: false, 
                                        modal: false,
                                        tpl: new Ext.XTemplate("{feature.attributes.PARKING_SP}<br/>{feature.attributes.STREET_NAM}"),
                                        feature: feature
                                    }, {
                                        html: 'Placeholder for WFS transaction to update citation opportunity'
                                    }]
                                }]
                            });
                        }
                    }
                }})
            ]
        });

        map.addLayers([streets, parking, highlight]);
        
        this.setMap(map);

        this.setPlugins([
            new GXM.plugin.Tracker({
                trackSuspended: true,
                allowHighAccuracy: false
            })
        ]);

        this.callParent(arguments);
    }
});
