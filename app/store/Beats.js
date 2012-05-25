Ext.define('SFenforce.store.Beats', {
    extend: 'Ext.data.JsonStore',
    
    requires: [
        'SFenforce.model.Beats',
        'GXM.data.proxy.Protocol',
        'GXM.data.reader.Feature'
    ],
    
    config: {
        autoLoad: true,
        
        model: 'SFenforce.model.Beats',

        sorters: [{
            property: 'name'
        }],

        proxy: {
            type: 'gxm_protocol',
            protocol: new OpenLayers.Protocol.WFS({
                url: "/geoserver/wfs",
                featureType: "PCO_BEATS",
                featureNS: "http://www.sfpark.org/SFenforce"
            }),
            reader: 'gxm_feature'
        }
    }
});
