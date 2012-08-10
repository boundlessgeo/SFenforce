Ext.define("SFenforce.view.Map",{
    mixins: {
        observable: "Ext.mixin.Observable"
    },
    config: {
        beats: null,
        useCurrentLocation: false,
        filter: null,
        map:null,
        mapExtent: SFenforce.util.Config.getBounds(),
        mapCenter:null
    },
    alias: 'widget.map',
    /** @private **/
    _beatsFilter: null,
    /** @private **/
    _sessionFilter: null,
    constructor:function(config){
        this.callParent(arguments);
        var options = {
            projection: "EPSG:900913",
            sphericalMercator: true,
            numZoomLevels: 19,
            units: "m",
            buffer: 1,
            transitionEffect: "resize"
        };

        var streets = new OpenLayers.Layer.XYZ("streets", [
            'http://a.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
            'http://b.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
            'http://c.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png'
        ], options);
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
                        var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y); 
                        var xy = this.getMap().getViewPortPxFromLonLat(lonlat);
                        if (!this.popup) {
                            this.popup = Ext.Viewport.add({
                                xtype: 'popup',
                                'feature': feature,
                                'xy': xy
                            });
                            // work around the issue that show is not fired the first time
                            this.popup._silent = true;
                            this.popup.hide();
                            delete this.popup._silent;
                            this.popup.show();
                        } else {
                            this.popup.setFeature(feature);
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
                new OpenLayers.Control.SelectFeature(citation_vector, {autoActivate: true}),
                new OpenLayers.Control.CacheWrite({
                    autoActivate: true,
                    layers: [streets]
                }),
                new OpenLayers.Control.CacheRead()
            ]
        });

        map.addLayers([streets, citation_vector, nodata_spaces]);
        
        this.setMap(map);
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
   },
   updateMapExtent: function(newExtent){
       var map = this.getMap();
       if(newExtent && map){
           map.setOptions({
               maxExtent: newExtent
           });
       }
   },
   updateMapCenter: function(newCenter){
       var map = this.getMap();
       if(newCenter && map){
           map.setCenter(newCenter);
       }
   }
});
