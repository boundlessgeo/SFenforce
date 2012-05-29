Ext.define('SFenforce.store.DispositionCodes', {
    extend: 'Ext.data.JsonStore',
    
    requires: [
        'SFenforce.model.DispositionCode'
    ],
    
    config: {
        autoLoad: true,
        
        model: 'SFenforce.model.DispositionCode',

        proxy: {
            type: 'ajax',
            url: 'data/dispositionCodes.json',
            reader: {
                type: 'json',
                rootProperty: 'categories'
            }
        }
    }
});
