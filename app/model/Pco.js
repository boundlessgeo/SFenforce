// Parking Citation Officer
Ext.define('SFenforce.model.Pco', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'badge',
        fields: [
            {name: 'badge', type: 'number'},
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
        ],
        proxy: {
           type: 'localstorage',
           id: 'sfenforce-pco'
       }
    }
});
