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
                attribution: SFenforce.util.Config.getMapQuestAttribution(),
                type: "osm"
            }, options)
        );

        var beats = this.getBeats();
        var beatFilter = null;
        if (beats !== null) {
            var filters = [];
            for (var i=0, ii=beats.length; i<ii; ++i) {
                filters.push(new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: SFenforce.util.Config.getBeatField(),
                    value: beats[i]
                }));
            }
            if (filters.length > 1) {
                beatFilter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR,
                    filters: filters
                });
            } else {
                beatFilter = filters[0];
            }
        }
        var sessionFilter = new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.GREATER_THAN,
            property: SFenforce.util.Config.getParkingSessionField(),
            value: -1
        });
        var filter;
        if (beatFilter !== null) {
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [sessionFilter, beatFilter]
            });
        } else {
            filter = sessionFilter;
        }

        var style = new OpenLayers.Style({
            pointRadius: "${getSize}",
            graphicName: 'circle'
        }, {
            context: {
                getSize: function(feature) {
                    var map = feature.layer.map;
                    return (map.getScale() < SFenforce.util.Config.getScaleBreak()) ? 
                        SFenforce.util.Config.getMaxPointRadius() : 
                            SFenforce.util.Config.getMinPointRadius();
                }
            },
            rules: [
                new OpenLayers.Rule({
                    name: SFenforce.util.Config.getUnpaidRuleTitle(),
                    filter: SFenforce.util.Config.getUnpaidRuleFilter(),
                    symbolizer: {
                        fillColor: SFenforce.util.Config.getUnpaidColor()
                    }
                }),
                new OpenLayers.Rule({
                    name: SFenforce.util.Config.getCommercialRuleTitle(),
                    filter: SFenforce.util.Config.getCommercialRuleFilter(),
                    symbolizer: {
                        fillColor: SFenforce.util.Config.getOccupiedColor()
                    }
                }),
                new OpenLayers.Rule({
                    name: SFenforce.util.Config.getCitedRuleTitle(),
                    filter: SFenforce.util.Config.getCitedRuleFilter(),
                    symbolizer: {
                        fillColor: SFenforce.util.Config.getCitedColor()
                    }
                })
            ]
        });
        SFenforce.util.Config.setStyle(style.clone());
        var styleMap = new OpenLayers.StyleMap(style);
        styleMap.styles["select"] = styleMap.styles["select"].clone();
        styleMap.styles["select"].defaultStyle.strokeColor = SFenforce.util.Config.getSelectedStrokeColor();
        var nodata_spaces = new OpenLayers.Layer.WMS(
            SFenforce.util.Config.getNoDataLayerName(), 
            SFenforce.util.Config.getGeoserverUrl(), {
                layers: SFenforce.util.Config.getPrefix() + ":" + SFenforce.util.Config.getCitationView(),
                version: '1.1.1',
                transparent: true,
                filter: beatFilter !== null ? new OpenLayers.Format.XML().write(new OpenLayers.Format.Filter({defaultVersion:'1.1.0'}).write(beatFilter)) : undefined
            },{
                buffer: 1,
                isBaseLayer: false
            }
        );
        var citation_vector = new OpenLayers.Layer.Vector(
            SFenforce.util.Config.getCitationLayerName(), {
                filter: filter,
                styleMap: styleMap,
                protocol: new OpenLayers.Protocol.WFS({
                    url: '/geoserver/wfs', //SFenforce.util.Config.getGeoserverUrl(),
                    featureType: SFenforce.util.Config.getCitationView(),
                    featureNS: SFenforce.util.Config.getFeatureNS(),
                    geometryName: SFenforce.util.Config.getCitationGeomField(),
                    version: "1.1.0",
                    srsName: "EPSG:900913",
                    outputFormat: 'json',
                    readFormat: new OpenLayers.Format.GeoJSON()
                }),
                eventListeners: {
                    "featureselected": function(evt) {
                        var feature = evt.feature;
                        var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y); 
                        var xy = this.getMap().getViewPortPxFromLonLat(lonlat);
                        if (!this.popup) {
                            this.popup = Ext.Viewport.add({
                                xtype: 'panel', 
                                layout: 'fit',
                                listeners: {
                                    'hide': function() {
                                        if (!this.popup._silent) {
                                            var ctrl = this.getMap().getControlsByClass('OpenLayers.Control.SelectFeature')[0];
                                            ctrl.unselectAll();
                                        }
                                    },
                                    'show': function() {
                                        this.popup.down('#updateForm').getItems().get(0).setValue(SFenforce.util.Config.getDefaultDispositionValue());
                                        var mapBox = Ext.fly(this.getMap().div).getBox(true);
                                        //assumed viewport takes up whole body element of map panel
                                        var popupPos =  [this.popup.getLeft(), this.popup.getTop()];
                                        popupPos[0] -= mapBox.x;
                                        popupPos[1] -= mapBox.y;
                                        var panelSize = [mapBox.width, mapBox.height]; // [X,Y]
                                        var popupSize = [this.popup.getWidth(), this.popup.getHeight()];
                                        var newPos = [popupPos[0], popupPos[1]];
                                        //For now, using native OpenLayers popup padding.  This may not be ideal.
                                        var padding = this.getMap().paddingForPopups;
                                        // X
                                        if(popupPos[0] < padding.left) {
                                            newPos[0] = padding.left;
                                        } else if(popupPos[0] + popupSize[0] > panelSize[0] - padding.right) {
                                            newPos[0] = panelSize[0] - padding.right - popupSize[0];
                                        }
                                        // Y
                                        if(popupPos[1] < padding.top) {
                                            newPos[1] = padding.top;
                                        } else if(popupPos[1] + popupSize[1] > panelSize[1] - padding.bottom) {
                                            newPos[1] = panelSize[1] - padding.bottom - popupSize[1];
                                        }
                                        var dx = popupPos[0] - newPos[0];
                                        var dy = popupPos[1] - newPos[1];
                                        this.getMap().pan(dx, dy);
                                        this.popup.setLeft(newPos[0]+mapBox.x);
                                        this.popup.setTop(newPos[1]+mapBox.y);
                                    },
                                    scope: this
                                },
                                id: 'popuppanel',
                                width: SFenforce.util.Config.getFeaturePopupSize()[0], 
                                height: SFenforce.util.Config.getFeaturePopupSize()[1],
                                top: xy.y + SFenforce.util.Config.getFeaturePopupOffset()[1],
                                left: xy.x + SFenforce.util.Config.getFeaturePopupOffset()[0],
                                centered: true,
                                modal: true, 
                                hideOnMaskTap: true, 
                                items: [{
                                    xtype: 'carousel', 
                                    items: [{
                                        xtype: 'gxm_featurepopup',
                                        centered: false, 
                                        modal: false,
                                        tpl: new Ext.XTemplate(SFenforce.util.Config.getFeatureTpl()),
                                        feature: feature
                                    }, {
                                        xtype: 'formpanel',
                                        id: 'updateForm',
                                        items: [{
                                            xtype: 'selectfield',
                                            name: 'code',
                                            label: SFenforce.util.Config.getDispositionCodeLabel(),
                                            store:  Ext.getStore('DispositionCodes')
                                        }, {
                                            xtype: 'toolbar',
                                            items: [{
                                                id: 'saveButton',
                                                xtype: 'button',
                                                text: SFenforce.util.Config.getSaveButtonText()
                                            }]
                                        }]
                                    }]
                                }]
                            });
                            // work around the issue that show is not fired the first time
                            this.popup._silent = true;
                            this.popup.hide();
                            delete this.popup._silent;
                            this.popup.show();
                        } else {
                            this.popup.down('gxm_featurepopup').setFeature(feature);
                            this.popup.getItems().get(0).setActiveItem(0);
                            this.popup.setTop(xy.y + SFenforce.util.Config.getFeaturePopupOffset()[0]);
                            this.popup.setLeft(xy.x + SFenforce.util.Config.getFeaturePopupOffset()[1]);
                            this.popup.show();
                        }
                    },
                    scope: this
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

        map.addLayers([streets, citation_vector, nodata_spaces]);
        
        this.setMap(map);
        
        this._tracker = new GXM.plugin.Tracker({
                trackSuspended: true,
                allowHighAccuracy: true,
                locationStyle:{
                    graphicName: 'circle',
                    strokeColor: '#ff0000',
                    strokeWidth: 1,
                    fillOpacity: 0.5,
                    fillColor: '#0000ff',
                    pointRadius: 8
                }
        });

        this.callParent(arguments);
    }
});
