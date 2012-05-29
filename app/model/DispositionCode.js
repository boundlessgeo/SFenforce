Ext.define('SFenforce.model.DispositionCode', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'value', type: 'integer'},
            {name: 'text', type: 'string'}
        ]
    }
});
