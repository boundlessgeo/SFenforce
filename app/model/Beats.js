Ext.define('SFenforce.model.Beats', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string', mapping: 'attributes.BEATNAME'}
        ]
    }
});
