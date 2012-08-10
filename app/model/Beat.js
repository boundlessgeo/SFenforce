Ext.define('SFenforce.model.Beat', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string', mapping: 'properties.' + SFenforce.util.Config.getBeatNameField()},
            {name: 'geometry', convert: function(val, rec){
                if(val){
                    var f = new OpenLayers.Format.GeoJSON().read(val, 'Geometry');
                    return f || val; 
                } else {
                    return false;
                }
            }}
        ]
    }
});
