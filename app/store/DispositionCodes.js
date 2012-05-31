Ext.define('SFenforce.store.DispositionCodes', {
    extend: 'Ext.data.JsonStore',
    
    requires: [
        'SFenforce.model.DispositionCode',
        'GXM.data.proxy.Protocol',
        'GXM.data.reader.Feature'
    ],
    
    config: {
        autoLoad: true,
        
        model: 'SFenforce.model.DispositionCode',

        proxy: {
            type: 'gxm_protocol',
            protocol: new OpenLayers.Protocol.WFS({
                url: "/geoserver/wfs",
                version: "1.1.0",
                srsName: "EPSG:900913",
                featureType: "DISPOSITION_CODES_TMP",
                featureNS: "http://www.sfpark.org/SFenforce",
                outputFormat: 'json',
                readFormat: new OpenLayers.Format.GeoJSON()
            }),
            reader: 'gxm_feature'
        }
    }
});
