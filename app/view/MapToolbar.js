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
            ui: 'back mapbutton',
            text: SFenforce.util.Config.getBackToLoginText()
        }, {
            xtype: 'spacer',
            width: 32
        }, {
            id: 'myPosition',
            ui: 'mapbutton',
            iconCls: 'user'
        }, {
            xtype: 'segmentedbutton',
            id: 'locateButton',
            items:[{
                ui: 'mapbutton',
                iconMask: 'true',
                iconCls: 'locate'
            }]
        }, {
            xtype: 'spacer',
            width: 32
        }, {
            id: 'refreshButton',
            ui: 'mapbutton',
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
            ui: 'mapbutton',
            iconCls: 'favorites'
        }, {
            id: 'legendButton',
            ui: 'mapbutton',
            iconCls: 'maps'
        }]
    }
});
