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
                height: Ext.Viewport.getSize().height*0.3,
                cls: 'featureinfo',
                layout: 'vbox',
                items: [{
                    height: 25,
                    cls: 'portrait',
                    html: '<p class="emptytext">' + SFenforce.util.Config.getFeatureInfoEmptyText() + '</p>',
                    id: 'featureinfo'
                }, {
                    xtype: 'list',
                    disableSelection: true,
                    cls: ['list-disabled', 'portrait'],
                    scrollable: false,
                    flex: 1,
                    id: 'updateList',
                    store: Ext.getStore('DispositionCodes')
                }, {
                    xtype: 'toolbar',
                    height: 35,
                    ui: 'sfbutton',
                    items: [{
                        xtype: 'label',
                        cls: 'transactionLabel',
                        id: 'submitLabel',
                        flex: 1
                    }, {
                        id: 'saveButton',
                        flex: 2,
                        xtype: 'button',
                        disabled: true,
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
                    height: 70,
                    html: '<p class="emptytext">' + SFenforce.util.Config.getFeatureInfoEmptyText() + '</p>',
                    id: 'featureinfo'
                }, {
                    xtype: 'list',
                    disableSelection: true,
                    cls: 'list-disabled',
                    scrollable: false,
                    flex: 1,
                    id: 'updateList',
                    store: Ext.getStore('DispositionCodes')
                }, {
                    xtype: 'toolbar',
                    height: 35,
                    ui: 'sfbutton',
                    items: [{
                        xtype: 'label',
                        cls: 'transactionLabel',
                        id: 'submitLabel',
                        flex: 1
                    }, {
                        id: 'saveButton',
                        xtype: 'button',
                        disabled: true,
                        flex: 2,
                        ui: 'sfbutton',
                        text: SFenforce.util.Config.getSaveButtonText()
                    }]
                }]
            }]: null
        }];
        this.callParent(arguments);
    }

});
