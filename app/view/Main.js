Ext.define('SFenforce.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',

    requires: [
        'SFenforce.view.Map',
        'Ext.SegmentedButton',
        'Ext.Label'
    ],

    config: {
        fullscreen: true,
        autoDestroy: false,
        mapConfig: null,
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'top'
        },
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            id: 'mapToolbar',
            items: [{
                xtype: 'segmentedbutton',
                id: 'locateButton',
                items:[{
                    iconMask: true,
                    iconCls: 'locate'
                }]
            }, {
                id: 'refreshButton',
                iconMask: true,
                iconCls: 'refresh'
            }, {
                id: 'lastRefresh',
                xtype: 'label',
                width: 200
            },{
                xtype: 'spacer',
                flex: 1
            }, {
                id: 'zoomButton',
                iconMask: true,
                iconCls: 'favorites'
            }, {
                id: 'legendButton',
                iconMask: true,
                iconCls: 'bookmarks'
            }]
        }]
    }
});
