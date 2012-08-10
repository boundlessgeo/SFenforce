Ext.define('SFenforce.store.Beats', {
    extend: 'Ext.data.JsonStore',
    
    requires: [
        'SFenforce.model.Beat'
    ],
    
    config: {
        autoLoad: true,
        
        model: 'SFenforce.model.Beat',

        sorters: [{
            property: 'name'
        }],

        proxy: {
            type: 'ajax',
            enablePagingParams: false,
            url: SFenforce.util.Config.getGeoserverUrl(),
            extraParams: {
                service:'WFS',
                version: '1.1.0',
                request: 'GetFeature',
                typeName: SFenforce.util.Config.getPrefix()+':'+ SFenforce.util.Config.getBeatsFeatureType(),
                outputFormat: 'json',
                srsName: 'EPSG:900913'
            },
            reader: {
                type: 'json',
                rootProperty: 'features'
            }
        }
    }
});
