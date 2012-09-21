Ext.define('SFenforce.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',

    requires: [
        'SFenforce.view.Map',
        'SFenforce.view.MapToolbar',
        'SFenforce.view.DispositionList'
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
                height: Ext.Viewport.getSize().height*0.35,
                cls: 'featureinfo',
                layout: 'vbox',
                items: [{
                    height: 100,
                    cls: 'portrait',
                    html: '<p class="emptytext">' + SFenforce.util.Config.getFeatureInfoEmptyText() + '</p>',
                    id: 'featureinfo'
                }, {
                    xtype: 'sflist',
                    disableSelection: true,
                    cls: ['list-disabled', 'portrait'],
                    flex: 1,
                    id: 'updateList',
                    store: Ext.getStore('DispositionCodes')
                }, {
                    xtype: 'toolbar',
                    minHeight: '3em',
                    defaults: {
                        minHeight: '3em'
                    },
                    ui: 'sfbutton',
                    items: [{
                        xtype: 'label',
                        cls: 'transactionLabel',
                        id: 'submitLabel',
                        flex: 1
                    }, {
                        id: 'saveButton',
                        flex: 1,
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
                    height: 100,
                    html: '<p class="emptytext">' + SFenforce.util.Config.getFeatureInfoEmptyText() + '</p>',
                    id: 'featureinfo'
                }, {
                    xtype: 'sflist',
                    disableSelection: true,
                    cls: 'list-disabled',
                    flex: 1,
                    id: 'updateList',
                    store: Ext.getStore('DispositionCodes')
                }, {
                    xtype: 'toolbar',
                    ui: 'sfbutton',
                    minHeight: '3em',
                    defaults: {
                        minHeight: '3em'
                    },
                    items: [{
                        xtype: 'label',
                        cls: 'transactionLabel',
                        id: 'submitLabel',
                        flex: 1
                    }, {
                        id: 'saveButton',
                        xtype: 'button',
                        disabled: true,
                        flex: 1,
                        ui: 'sfbutton',
                        text: SFenforce.util.Config.getSaveButtonText()
                    }]
                }]
            }]: null
        }];
        this.callParent(arguments);
    }

});
