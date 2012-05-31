Ext.define('SFenforce.model.DispositionCode', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'value', type: 'integer', mapping: 'attributes.VALUE'},
            {name: 'text', type: 'string', mapping: 'attributes.DESCRIPTION'}
        ]
    }
});
