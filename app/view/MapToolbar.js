Ext.define('SFenforce.view.MapToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'maptoolbar',

    requires: [
        'Ext.SegmentedButton',
        'SFenforce.view.RefreshLabel'        
    ],

    config: {
        minHeight: '3em',
        docked: 'top',
        id: 'mapToolbar',
        defaults: {
            minHeight: '2.6em',
            iconMask: 'true'
        },
        items: [{
            id: 'backLoginButton',
            ui: 'mapbutton',
            minWidth: '3.5em',
            text: SFenforce.util.Config.getBackToLoginText()
        }, {
            xtype: 'spacer',
            width: 32
        }, {
            id: 'myPosition',
            minWidth: '3.5em',
            ui: 'mapbutton',
            iconCls: 'sflocate'
        }, {
            xtype: 'segmentedbutton',
            id: 'locateButton',
            items:[{
                minHeight: '2.6em',
                minWidth: '3.5em',
                ui: 'mapbutton',
                iconMask: 'true',
                iconCls: 'locate4'
            }]
        }, {
            xtype: 'spacer',
            width: 32
        }, {
            id: 'refreshButton',
            ui: 'mapbutton',
            minWidth: '3.5em',
            iconCls: 'refresh'
        }, {
            id: 'lastRefresh',
            xtype: 'refreshlabel',
            width: 275
        },{
            xtype: 'spacer',
            flex: 1
        }, {
            id: 'zoomButton',
            ui: 'mapbutton',
            minWidth: '3.5em',
            iconCls: 'favorites'
        }, {
            id: 'legendButton',
            ui: 'mapbutton',
            minWidth: '3.5em',
            iconCls: 'maps'
        }]
    }
});
