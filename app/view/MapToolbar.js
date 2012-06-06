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
            cls: 'refreshLabel',
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
    }
});
