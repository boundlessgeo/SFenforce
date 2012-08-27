Ext.define('SFenforce.view.MapToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'maptoolbar',

    requires: [
        'Ext.SegmentedButton',
        'SFenforce.view.RefreshLabel'        
    ],

    config: {
        docked: 'top',
        id: 'mapToolbar',
        defaults: {
            iconMask: 'true'
        },
        items: [{
            id: 'backLoginButton',
            ui: 'back',
            text: SFenforce.util.Config.getBackToLoginText()
        }, {
            xtype: 'spacer',
            width: 32
        }, {
            id: 'myPosition',
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
            width: 32
        }, {
            id: 'refreshButton',
            iconCls: 'refresh'
        }, {
            id: 'lastRefresh',
            xtype: 'refreshlabel',
            width: 250
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
