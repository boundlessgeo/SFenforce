Ext.define('SFenforce.util.Config', {
    singleton : true,

    config : {
        /* @private */
        beatsBounds: null,
        bounds: new OpenLayers.Bounds(-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212),
        geoserverUrl: '/geoserver/ows',
        featureNS: 'http://www.sfpark.org/SFenforce',
        noDataLayerName: "No Data Spaces",
        citationLayerName: "Citation opportunities",
        style: new OpenLayers.Style({
                pointRadius: 6,
                fillOpacity: 0.85,
                graphicName: 'circle'
            }, {
                rules: [
                    new OpenLayers.Rule({
                        name: 'Unpaid vehicle',
                        filter: new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: 'METER_EXPIRED_FLAG',
                            value: 1
                        }),
                        symbolizer: {
                            fillColor: '#FF0000'
                        }
                    }),
                    new OpenLayers.Rule({
                        name: 'Vehicle at commercial space',
                        filter: new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: 'COMMERCIAL_OCCUPIED_FLAG',
                            value: 1
                        }),
                        symbolizer: {
                            fillColor: '#EFEF20'
                        }
                    }),
                    new OpenLayers.Rule({
                        name: 'Cited',
                        filter: new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: 'DISPOSITION_CODE',
                            value: 1
                        }),
                        symbolizer: {
                            fillColor: '#22FF11',
                            pointRadius: 4
                        }
                    })
                ]
            }
        )
    },

    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
