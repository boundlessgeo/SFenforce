// Parking Citation Officer
Ext.define('SFenforce.model.Pco', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'name', type: 'string'},
            {name: 'beats', convert: function(v) { 
                return v ? v.split(",") : []; 
            }} // array of string
        ]
    }
});
