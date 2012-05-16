Ext.define('SFenforce.store.Beats', {
    extend: 'Ext.data.JsonStore',
    
    requires: [
        'SFenforce.model.Beats',
        'GeoExt.data.proxy.Protocol',
        'GeoExt.data.reader.Feature'
    ],
    
    config: {
        autoLoad: true,
        
        model: 'SFenforce.model.Beats',

        sorters: [{
            property: 'name'
        }],
        
        proxy: {
            type: 'ajax',
            url: "beats.json",
            reader: {
                type: 'json',
                rootProperty: 'features'
            }
        }
    }
});
