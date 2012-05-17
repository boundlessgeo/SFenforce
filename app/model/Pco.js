// Parking Citation Officer
Ext.define('SFenforce.model.Pco', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'name', type: 'string'},
            {name: 'beats', convert: function(v) { 
                if(v && typeof v == 'string'){
                    v = v.split(",");
                }
                return v;
            }} // array of string
        ],
        validations: [
            {type: 'presence', name: 'name', message: "Please enter PCO"},
            {type: 'presence', name: 'beats', message: "Please select at least one beat"}
        ]
    }
});
