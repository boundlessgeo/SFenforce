Ext.define("SFenforce.view.Map",{
    requires: ['Ext.carousel.Carousel', 'GXM.widgets.FeaturePopup'],
    extend: 'GXM.Map',
    config: {
        beats: null,
        useCurrentLocation: false,
        filter: null
    },
    alias: 'widget.map',
    /** @private **/
    _beatsFilter: null,
    /** @private **/
    _sessionFilter: null,
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
            buffer: 0,
            transitionEffect: "resize"
        };

        var streets = new OpenLayers.Layer.OSM(null, null, options);
        var beats = this.getBeats();
        var beatFilter = this.calculateBeatsFilter(beats);
        var sessionFilter = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [
                new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN,
                    property: SFenforce.util.Config.getParkingSessionField(),
                    value: -1
                }),
                new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: SFenforce.util.Config.getDispositionFlagField(),
                    value: 0
                })
            ]
        });
        this._sessionFilter = sessionFilter; 
        var filter;
        if (beatFilter !== null) {
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [sessionFilter, beatFilter]
            });
        } else {
            filter = sessionFilter;
        }
        
        //store filter in the private config variable without triggering apply, update code
        this._filter = filter;

        var style = new OpenLayers.Style({
            graphicWidth: 32,
            graphicHeight: 37
        }, {
            rules: [
                new OpenLayers.Rule({
                    name: SFenforce.util.Config.getUnpaidRuleTitle(),
                    filter: SFenforce.util.Config.getUnpaidRuleFilter(),
                    symbolizer: {
                        externalGraphic: "resources/icons/parking-meter-red.png"
                    }
                }),
                new OpenLayers.Rule({
                    name: SFenforce.util.Config.getCommercialRuleTitle(),
                    filter: SFenforce.util.Config.getCommercialRuleFilter(),
                    symbolizer: {
                        externalGraphic: "resources/icons/parking-meter-yellow.png"
                    }
                })/*,
                new OpenLayers.Rule({
                    name: SFenforce.util.Config.getCitedRuleTitle(),
                    filter: SFenforce.util.Config.getCitedRuleFilter(),
                    symbolizer: {
                        //fillColor: SFenforce.util.Config.getCitedColor()
                        display: 'none'
                    }
                })*/
            ]
        });
        SFenforce.util.Config.setStyle(style.clone());
        var styleMap = new OpenLayers.StyleMap(style);
        styleMap.styles["select"] = styleMap.styles["select"].clone();
        styleMap.styles["select"].defaultStyle.externalGraphic = "resources/icons/parking-meter-blue.png";

        var nodata_spaces = new OpenLayers.Layer.WMS(
            SFenforce.util.Config.getNoDataLayerName(), 
            SFenforce.util.Config.getGeoserverUrl(), {
                layers: SFenforce.util.Config.getPrefix() + ":" + SFenforce.util.Config.getCitationView(),
                version: '1.1.1',
                transparent: true,
                filter: beatFilter !== null ? new OpenLayers.Format.XML().write(new OpenLayers.Format.Filter({defaultVersion:'1.1.0'}).write(beatFilter)) : undefined
            },{
                buffer: 0,
                isBaseLayer: false
            }
        );
        var citation_vector = new OpenLayers.Layer.Vector(
            SFenforce.util.Config.getCitationLayerName(), {
                filter: filter,
                styleMap: styleMap,
                protocol: new OpenLayers.Protocol.WFS({
                    url: SFenforce.util.Config.getGeoserverUrl(),
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
                        var tpl = new Ext.XTemplate(
                            '{feature.attributes.POST_ID:this.formatNumber}<br/>',
                            '<tpl if="feature.attributes.METER_EXPIRED_FLAG == 1">Meter expired<br/></tpl>',
                            '<tpl if="feature.attributes.COMMERCIAL_OCCUPIED_FLAG == 1">Commercial occupied</tpl>',
                            {
                                formatNumber: function(value) {
                                    return value.replace('-', '-&nbsp;');
                                }
                            }
                        );
                        Ext.getCmp('featureinfo').feature = feature;
                        Ext.getCmp('featureinfo').setHtml(tpl.applyTemplate({feature: feature}));
                        Ext.getCmp("updateList").setDisableSelection(false);
                    },
                    "featureunselected": function(evt) {
                        Ext.getCmp("updateList").deselectAll();
                        Ext.getCmp("updateList").setDisableSelection(true);
                    },
                    scope: this
                },
                renderers: ['Marker'],
                strategies: [new OpenLayers.Strategy.BBOX()]
        });

        // OpenLayers specific setup
        var map = new OpenLayers.Map({
            projection: "EPSG:900913",
            autoUpdateSize: false,
            theme: null,
            controls : [
                new OpenLayers.Control.Zoom(),
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions : {
                        interval : 100,
                        enableKinetic : false
                    }
                }),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.SelectFeature(citation_vector, {autoActivate: true}),
                new OpenLayers.Control.Geolocate({
                    bind: false,
                    autoActivate: true,
                    eventListeners: {
                        "locationupdated": function(e) {
                            if (!this.vector) {
                                this.vector = new OpenLayers.Layer.Vector();
                                map.addLayers([this.vector]);
                            }
                            this.vector.removeAllFeatures();
                            var circle = new OpenLayers.Feature.Vector(
                                OpenLayers.Geometry.Polygon.createRegularPolygon(
                                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                                    e.position.coords.accuracy/2,
                                    40,
                                    0
                                ),
                                {},
                                {
                                    fillColor: '#000',
                                    fillOpacity: 0.1,
                                    strokeWidth: 0
                                }
                            );
                            this.vector.addFeatures([
                                new OpenLayers.Feature.Vector(
                                    e.point,
                                    {},
                                    {
                                        graphicName: 'circle',
                                        strokeColor: '#ff0000',
                                        strokeWidth: 1,
                                        fillOpacity: 0.5,
                                        fillColor: '#0000ff',
                                        pointRadius: 8
                                    }
                                ),
                                circle
                            ]);
                        },
                        scope: this
                    },
                    geolocationOptions: {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 7000
                    }
                })
            ]
        });

        map.addLayers([streets, nodata_spaces, citation_vector]);
        
        this.setMap(map);
        
        this.callParent(arguments);
    },
    //overwrite so that we control in geolocation plugin
    onGeoUpdate: Ext.emptyFn,
    
    /** @private **/
    updateBeats: function(newBeats, oldBeats){
        this._beatsFilter = this.calculateBeatsFilter(newBeats);
        var filter;
        if(this._beatsFilter){
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [this._beatsFilter,this._sessionFilter]
            });
        } else {
            filter = this._sessionFilter;
        }
        this.setFilter(filter);
    },
    
    updateFilter: function(newFilter, oldFilter){
        //test to ensure that the map has already been initialized
        if(oldFilter != null && this.layers != null){
            //get the filtered layers
            var nodataLayer = this.layers.findRecord('name', SFenforce.util.Config.getNoDataLayerName()).getLayer();
            var opsLayer = this.layers.findRecord('name', SFenforce.util.Config.getCitationLayerName()).getLayer();
            //update the layer filters
            nodataLayer.mergeNewParams({filter: this._beatsFilter !== null ?
                new OpenLayers.Format.XML().write(new OpenLayers.Format.Filter({defaultVersion:'1.1.0'}).write(this._beatsFilter)) : undefined});
            opsLayer.filter = newFilter;
            opsLayer.refresh({force: true});
        }
    },
    
    /** @private **/
   calculateBeatsFilter: function(beats){
        if (!beats) {beats = this.getBeats();}
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
            this._beatsFilter = beatFilter;
            return beatFilter;
        } else {
            return null;
        }
   }
});
