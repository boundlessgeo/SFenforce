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
            layout: 'vbox',
            id: 'vboxcontainer',
            pack: 'start',
            align: 'stretch',
            hidden: !config.portrait,
            items: config.portrait ? [{
                layout: 'fit',
                flex: 1,
                items: [{
                    xtype: 'maptoolbar'
                }, {
                    xtype: 'map',
                    beats: config.beats
                }]
            }, {
                height: Ext.Viewport.getHeight()*0.25, 
                cls: 'featureinfo',
                layout: 'vbox',
                items: [{
                    flex: 1,
                    html: '<p class="emptytext">' + SFenforce.util.Config.getFeatureInfoEmptyText() + '</p>',
                    id: 'featureinfo'
                }, {
                    xtype: 'list',
                    disableSelection: true,
                    cls: ['list-disabled', 'portrait'],
                    scrollable: false,
                    height: 100,
                    id: 'updateList',
                    store: Ext.getStore('DispositionCodes')
                }, {
                    xtype: 'toolbar',
                    flex: 3,
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
                    xtype: 'maptoolbar'
                }, {
                    xtype: 'map',
                    beats: config.beats
                }]
            }, {
                width: '25%',
                cls: 'featureinfo',
                layout: 'vbox',
                items: [{
                    flex: 1,
                    html: '<p class="emptytext">' + SFenforce.util.Config.getFeatureInfoEmptyText() + '</p>',
                    id: 'featureinfo'
                }, {
                    xtype: 'list',
                    disableSelection: true,
                    cls: 'list-disabled',
                    scrollable: false,
                    height: 500,
                    id: 'updateList',
                    store: Ext.getStore('DispositionCodes')
                }, {
                    xtype: 'toolbar',
                    flex: 3,
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
