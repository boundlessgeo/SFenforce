Ext.define('SFenforce.view.MapToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'maptoolbar',

    requires: [
        'Ext.SegmentedButton',
        'Ext.Label'
    ],

    config: {
        docked: 'top',
        id: 'mapToolbar',
        defaults: {
            iconMask: 'true'
        },
        items: [{
            id: 'zoomToPosition',
            iconCls: 'user'
        }, {
            xtype: 'segmentedbutton',
            id: 'locateButton',
            items:[{
                iconMask: 'true',
                iconCls: 'locate'
            }]
        }, {
            xtype: 'spacer',
            width: 48
        }, {
            id: 'refreshButton',
            iconCls: 'refresh'
        }, {
            id: 'lastRefresh',
            cls: 'refreshLabel',
            xtype: 'label',
            width: 200
        },{
            xtype: 'spacer',
            flex: 1
        }, {
            id: 'zoomButton',
            iconCls: 'favorites'
        }, {
            id: 'legendButton',
            iconCls: 'maps'
        }]
    }
});
