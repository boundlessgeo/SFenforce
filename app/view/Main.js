Ext.define('SFenforce.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',

    requires: [
        'SFenforce.view.Map',
        'SFenforce.view.MapToolbar'
    ],

    config: {
        fullscreen: true,
        layout: 'fit',
        beats: null,
        portrait: null,
        autoDestroy: false
    },

    constructor: function(config) {
        config.items = [{
            xtype: 'maptoolbar'
        }, {
            layout: 'vbox',
            id: 'vboxcontainer',
            pack: 'start',
            align: 'stretch',
            hidden: !config.portrait,
            items: config.portrait ? [{
                layout: 'fit',
                flex: 1,
                items: [{
                    xtype: 'map',
                    beats: config.beats
                }]
            }, {
                height: Ext.Viewport.getHeight()*0.2, 
                cls: 'featureinfo',
                layout: 'vbox', 
                items: [{
                    height: 60,
                    html: '<p class="emptytext">' + SFenforce.util.Config.getFeatureInfoEmptyText() + '</p>',
                    id: 'featureinfo'
                }, {
                    xtype: 'list',
                    disableSelection: true,
                    scrollable: false,
                    flex: 1,
                    id: 'updateList',
                    store: Ext.getStore('DispositionCodes')
                }, {
                    xtype: 'toolbar',
                    height: 50,
                    ui: 'sfbutton',
                    items: [{
                        id: 'saveButton',
                        xtype: 'button',
                        ui: 'sfbutton',
                        text: SFenforce.util.Config.getSaveButtonText()
                    }]
                }]
            }]: null
        }, {
            layout: 'hbox',
            id: 'hboxcontainer',
            hidden: config.portrait,
            pack: 'start',
            align: 'stretch',
            items: !config.portrait ? [{
                flex: 1,
                layout: 'fit',
                items: [{
                    xtype: 'map',
                    beats: config.beats
                }]
            }, {
                width: '20%',
                cls: 'featureinfo',
                layout: 'vbox',
                items: [{
                    height: 60,
                    html: '<p class="emptytext">' + SFenforce.util.Config.getFeatureInfoEmptyText() + '</p>',
                    id: 'featureinfo'
                }, {
                    xtype: 'list',
                    disableSelection: true,
                    scrollable: false,
                    flex: 1,
                    id: 'updateList',
                    store: Ext.getStore('DispositionCodes')
                }, {
                    xtype: 'toolbar',
                    height: 50,
                    ui: 'sfbutton',
                    items: [{
                        id: 'saveButton',
                        xtype: 'button',
                        ui: 'sfbutton',
                        text: SFenforce.util.Config.getSaveButtonText()
                    }]
                }]
            }]: null
        }];
        this.callParent(arguments);
    }

});
