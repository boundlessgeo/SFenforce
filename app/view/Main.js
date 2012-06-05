Ext.define('SFenforce.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',

    requires: [
        'SFenforce.view.Login',
        'SFenforce.view.Map',
        'Ext.SegmentedButton',
        'Ext.Label'
    ],

    config: {
        fullscreen: true,
        autoDestroy: false,

        navigationBar: {
            backButton: {
                iconCls: 'back'
            },
            items: [{
                xtype: 'segmentedbutton',
                id: 'locateButton',
                hidden: true,
                items:[{
                    iconMask: true,
                    iconCls: 'locate'
                }]
            }, {
                id: 'refreshButton',
                iconMask: true,
                iconCls: 'refresh',
                hidden: true
            }, {
                id: 'lastRefresh',
                hidden: true,
                xtype: 'label'
            },{
                xtype: 'spacer',
                flex: 1
            }, {
                id: 'zoomButton',
                iconMask: true,
                iconCls: 'favorites',
                hidden: true
            }]
        }
    },

    pop: function() {
        this.fireEvent('beforepop', this);
        this.callParent(arguments);
    }
});
