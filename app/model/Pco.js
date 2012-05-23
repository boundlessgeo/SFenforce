// Parking Citation Officer
Ext.define('SFenforce.model.Pco', {
    requires: ['Ext.data.identifier.Uuid'],
    extend: 'Ext.data.Model',
    config: {
        identifier: 'uuid',
        idProperty: 'badge',
        fields: [
            {name: 'badge', type: 'string'},
            {name: 'beats', convert: function(v) { 
                if(v && typeof v == 'string'){
                    v = v.split(",");
                }
                return v;
            }} // array of string
        ],
        validations: [
            {type: 'presence', name: 'badge', message: "Please enter badge number"},
            {type: 'presence', name: 'beats', message: "Please select at least one beat"}
        ]
    }
});
