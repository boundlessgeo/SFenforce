Ext.define('SFenforce.controller.Main', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.view.Map'],
    config: {
        refs: {
            main: 'main'
        },

        control: {
            main: {
                initialize: 'addMap'
            }
        }

    },
    
    addMap: function(){
        var mapConfig = this.getMain().getMapConfig();
        if(mapConfig){
            mapConfig = Ext.applyIf({flex: 1}, mapConfig);
            this.getMain().add(Ext.create('SFenforce.view.Map', mapConfig));
        }
    }
});