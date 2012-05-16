// Parking Citation Officer
Ext.define('SFenforce.model.Pco', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'name', type: 'string'},
            {name: 'beats', convert: function(v) { 
                return v ? v.split(",") : null;
            }} // array of string
        ],
        validations: [
            {type: 'presence', name: 'name', message: "Please enter PCO"},
            {type: 'presence', name: 'beats', message: "Please select at least one beat"}
        ]
    }
});
