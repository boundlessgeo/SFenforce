Ext.define('SFenforce.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',

    requires: [
        'SFenforce.view.Login',
        'SFenforce.view.Map'
    ],

    config: {
        fullscreen: true,
        autoDestroy: false,

        navigationBar: {
            backButton: {
                iconCls: 'back'
            },
            items: [{
                iconMask: true,
                id: 'locateButton',
                hidden: true,
                iconCls: 'locate'
            }]
        }
    },

    pop: function() {
        this.fireEvent('beforepop', this);
        this.callParent(arguments);
    }
});
