Ext.define('SFenforce.store.Beats', {
    extend: 'Ext.data.JsonStore',
    
    requires: [
        'SFenforce.model.Beats',
        'GeoExt.data.proxy.Protocol',
        'GeoExt.data.reader.Feature'
    ],
    
    config: {
        autoLoad: false,
        
        model: 'SFenforce.model.Beats',
        
        proxy: {
            type: 'gx_protocol',
            protocol: new OpenLayers.Protocol.Script({
                url: "http://sfmta.demo.opengeo.org/geoserver/wfs",
                callbackKey: "format_options",
                callbackPrefix: "callback:",
                params: {
                    service: "WFS",
                    version: "1.1.0",
                    request: "GetFeature",
                    typeName: "SFenforce:beats",
                    outputFormat: "json"
                }
            }),
            reader: {
                type: 'feature'
            }
        }
    }
});
