Ext.define("SFenforce.view.Map",{
    requires: ['Ext.carousel.Carousel', 'GXM.widgets.FeaturePopup', 'GXM.plugin.Tracker'],
    extend: 'GXM.Map',
    config: {
        beats: null
    },
    alias: 'widget.map',
    initialize:function(){
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

        var beats = this.getBeats();
        var filters = [];
        for (var i=0, ii=beats.length; i<ii; ++i) {
            filters.push(new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'PCO_BEAT',
                value: beats[i]
            }));
        }
        var beatFilter;
        if (filters.length > 1) {
            beatFilter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.OR,
                filters: filters
            });
        } else {
            beatFilter = filters[0];
        }
        var nullFilter = new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.GREATER_THAN,
            property: 'PARKING_SESSION_ID',
            value: -1
        });
        var filter = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [nullFilter, beatFilter]
        });

        var style = new OpenLayers.Style({
            pointRadius: 7,
            fillOpacity: 0.4,
            graphicName: 'circle'
        }, {
            rules: [
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: 'MTR_EXPIRED_OPP_ID',
                        value: null
                    }),
                    symbolizer: {
                        fillColor: '#FF0000'
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: 'COMML_OCC_OPP_ID',
                        value: null
                    }),
                    symbolizer: {
                        fillColor: '#FF0000'
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: 'OVER_TL_OPP_ID',
                        value: null
                    }),
                    symbolizer: {
                        fillColor: '#FF0000'
                    }
                }),
                new OpenLayers.Rule({
                    elseFilter: true,
                    symbolizer: {
                        fillColor: '#00FF00'
                    }
                })
            ]
        });

        /* TODO: specific select render intent so we can see which feature is selected */
        var citation_vector = new OpenLayers.Layer.Vector(
            "Citation opportunities", {
                filter: filter,
                styleMap: new OpenLayers.StyleMap(style),
                protocol: new OpenLayers.Protocol.WFS({
                    url: "/geoserver/wfs",
                    featureType: "CITATION_OPPORTUNITY_TMP",
                    featureNS: "http://www.sfpark.org/SFenforce",
                    geometryName: "GEOM",
                    version: "1.1.0",
                    srsName: "EPSG:900913",
                    outputFormat: 'json',
                    readFormat: new OpenLayers.Format.GeoJSON()
                }),
                eventListeners: {
                    "featureselected": function(evt) { 
                        var feature = evt.feature;
                        if (!this.popup) {
                            this.popup = Ext.Viewport.add({
                                xtype: 'panel', 
                                layout: 'fit',
                                id: 'popuppanel',
                                width: 350, 
                                height: 150,
                                centered: true,
                                modal: true, 
                                hideOnMaskTap: true, 
                                items: [{
                                    xtype: 'carousel', 
                                    items: [{
                                        xtype: 'gxm_featurepopup',
                                        centered: false, 
                                        modal: false,
                                        tpl: new Ext.XTemplate('{feature.attributes.POST_ID}<br/>', 
                                            '<tpl if="feature.attributes.OVER_TIME_LIMIT_FLAG == 1">Overtime<br/></tpl>',
                                            '<tpl if="feature.attributes.METER_EXPIRED_FLAG == 1">Meter expired<br/></tpl>',
                                            '<tpl if="feature.attributes.COMMERCIAL_OCCUPIED_FLAG == 1">Commercial occupied</tpl>'
                                        ),
                                        feature: feature
                                    }, {
                                        xtype: 'formpanel',
                                        id: 'updateForm',
                                        items: [{
                                            xtype: 'selectfield',
                                            name: 'code',
                                            label: "Category",
                                            store:  Ext.getStore('DispositionCodes')
                                        }, {
                                            xtype: 'toolbar',
                                            items: [{
                                                id: 'saveButton',
                                                xtype: 'button',
                                                text: 'Save'
                                            }]
                                        }]
                                    }]
                                }]
                            });
                        } else {
                            this.popup.down('gxm_featurepopup').setFeature(feature);
                            this.popup.getItems().get(0).setActiveItem(0);
                            this.popup.show();
                        }
                    }
                },
                renderers: ['Canvas'],
                strategies: [new OpenLayers.Strategy.BBOX()]
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
                new OpenLayers.Control.SelectFeature(citation_vector, {autoActivate: true})
            ]
        });

        map.addLayers([streets, citation_vector]);
        
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
