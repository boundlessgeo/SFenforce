Ext.define('SFenforce.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',

    requires: [
        'SFenforce.view.Map',
        'SFenforce.view.MapToolbar'
    ],

    config: {
        fullscreen: true,
        autoDestroy: false,
        map: null,
        layout: {
            type: 'fit'
        },
        items: [{
            xtype: 'maptoolbar'
        }, {
            xtype: 'component',
            id: 'mapwrapper'
        }]
    },
    setMap: function(newMap){
        var map = newMap && newMap.getMap();
        if(map){
            this.down('#mapwrapper').setHtml(map.div);
            map.updateSize();
        }
    }
});
