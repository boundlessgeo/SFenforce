Ext.define('SFenforce.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',

    requires: [
        'SFenforce.view.Map',
        'SFenforce.view.MapToolbar'
    ],

    config: {
        fullscreen: true,
        autoDestroy: false
    }
});
