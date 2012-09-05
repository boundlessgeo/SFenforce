Ext.define('SFenforce.view.Login', {
    extend: 'Ext.form.FormPanel',
    alias: 'widget.login',
    requires: [
        'SFenforce.view.MultiSelect',
        'Ext.form.FieldSet',
        'Ext.field.Number',
        'Ext.field.Hidden',
        'SFenforce.store.Beats',
        'SFenforce.store.Pco'
    ],
    config: {
        layout : {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [{xtype: 'fieldset',
            ui: 'login',
            width: '45em',
            id: 'fieldset',
            defaults: {
                labelAlign: 'left',
                labelWidth: '25%'
            },
            items: [{
                xtype: 'toolbar',
                ui: 'zoomselector',
                docked: 'bottom',
                margin: '2em',
                layout: {
                    align: 'stretch',
                    pack: 'center'
                },
                items: [{
                    xtype: 'spacer',
                    flex: 2
                }, {
                    xtype: 'button',
                    ui: 'sfbutton',
                    id: 'loginButton',
                    flex: 1,
                    text: SFenforce.util.Config.getLoginButtonText()
                }, {
                    xtype: 'spacer',
                    flex: 3
                }]
            }, {
                xtype: 'numberfield',
                listeners: {
                    'blur': function() {
                        Ext.Viewport.maximize();
                    }
                },
                name: 'badge',
                placeHolder: SFenforce.util.Config.getLoginNamePlaceholder(),
                label: SFenforce.util.Config.getLoginNameLabel(),
                clearIcon: true
            }, {
                xtype: 'multiselectfield',
                name: "beats",
                placeHolder: SFenforce.util.Config.getLoginBeatsPlaceholder(),
                label: SFenforce.util.Config.getLoginBeatsLabel(),
                usePicker: false,
                displayField: 'name',
                valueField: 'name',
                store: 'Beats'
            }, {
                xtype: 'toolbar',
                ui: 'zoomselector',
                id: 'zoomSelectorToolbar',
                layout: {
                    pack: 'center',
                    align: 'center'
                },
                items: [{
                    xtype: 'label',
                    cls: 'zoom-label',
                    html: SFenforce.util.Config.getLoginZoomToLabel(),
                    width: '25.4%'
                }, {
                    xtype: 'segmentedbutton',
                    id: "zoomSelector",
                    submit: false,
                    allowDepress: false,
                    allowMultiple: false,
                    flex: 1,
                    layout: {
                        pack: 'center'
                    },
                    defaults: {
                        ui: 'zoomselector',
                        flex: 1
                    },
                    items: [{
                        text: SFenforce.util.Config.getLoginMyBeatsLabel(),
                        data: "mybeats",
                        pressed: true
                    }, {
                        text: SFenforce.util.Config.getLoginAllBeatsLabel(),
                        data: "allbeats"
                    }, {
                        text: SFenforce.util.Config.getLoginMyLocationLabel(),
                        data: "mylocation"
                    }]
                }]
            }, {
                xtype: 'hiddenfield',
                name: 'zoomTo',
                submit: false
            }]
        }]
    }
});
