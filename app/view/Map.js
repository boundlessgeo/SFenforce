Ext.define("SFenforce.view.Map",{
requires: ['Ext.carousel.Carousel', 'GXM.FeaturePopup', 'GXM.plugin.Tracker'],
extend: 'GXM.Map',
initialize:function(){
        // work around the GFI issue in GeoServer for now
        this.setMaxWidth(1100);

        var options = {
            projection: "EPSG:900913",
            maxExtent: new OpenLayers.Bounds(
                -128 * 156543.0339, -128 * 156543.0339,
                128 * 156543.0339, 128 * 156543.0339
            ),
            maxResolution: 156543.03390625,
            resolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
                19567.87923828125, 9783.939619140625, 4891.9698095703125,
                2445.9849047851562, 1222.9924523925781, 611.4962261962891,
                305.74811309814453, 152.87405654907226, 76.43702827453613,
                38.218514137268066, 19.109257068634033, 9.554628534317017,
                4.777314267158508, 2.388657133579254, 1.194328566789627,
                0.5971642833948135, 0.25, 0.1],
            serverResolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
                19567.87923828125, 9783.939619140625,
                4891.9698095703125, 2445.9849047851562,
                1222.9924523925781, 611.4962261962891,
                305.74811309814453, 152.87405654907226,
                76.43702827453613, 38.218514137268066,
                19.109257068634033, 9.554628534317017,
                4.777314267158508, 2.388657133579254,
                1.194328566789627, 0.5971642833948135],
            numZoomLevels: 19,
            units: "m",
            buffer: 1,
            transitionEffect: "resize",
            tileOptions: {crossOriginKeyword: null}
        };

        var streets = new OpenLayers.Layer.OSM("MapQuest OpenStreetMap",
            [
                "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"
            ],
            OpenLayers.Util.applyDefaults({
                attribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
                type: "osm"
            }, options)
        );

        var citation = new OpenLayers.Layer.WMS(
            "Citation opportunites",
            "/geoserver/wms?",
            {layers: "SFenforce:CITATION_OPPORTUNITY_TMP", format: "image/png", transparent: true}
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
                                width: 350, 
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
                                        tpl: new Ext.XTemplate("{feature.attributes.PARKING_SPACE_ID}<br/>{feature.attributes.POST_ID}"),
                                        feature: feature
                                    }, {
                                        xtype: 'formpanel',
                                        items: [{
                                            xtype: 'selectfield',
                                            label: "Status",
                                            store: Ext.create("Ext.data.ArrayStore", {
                                                fields: ['value', 'text'],
                                                data: [['first', 'First Option'], ['second', 'Second Option'], ['third', 'Third Option']]
                                            })
                                        }, {
                                            xtype: 'toolbar',
                                            items: [{
                                                xtype: 'button',
                                                text: 'Save'
                                            }]
                                        }]
                                    }]
                                }]
                            });
                        }
                    }
                }})
            ]
        });

        map.addLayers([streets, citation, highlight]);
        
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
