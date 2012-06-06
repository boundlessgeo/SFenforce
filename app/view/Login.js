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
    initialize: function() {
        var me = this;
        me.add([{
            xtype: 'fieldset',
            id: 'fieldset',
            instructions: {
                title: SFenforce.util.Config.getLoginFormInstructions(),
                docked: 'top'
            },
            defaults: {
                required: true,
                labelAlign: 'left',
                labelWidth: '40%'
            },
            items: [{
                xtype: 'toolbar',
                docked: 'bottom',
                layout: {
                    align: 'stretch',
                    pack: 'center'
                },
                items: [{
                    xtype: 'spacer',
                    flex: 2
                }, {
                    xtype: 'button',
                    id: 'loginButton',
                    flex: 1,
                    ui: 'confirm',
                    text: SFenforce.util.Config.getLoginButtonText()
                }]
            }, {
                xtype: 'numberfield',
                name: 'badge',
                label: SFenforce.util.Config.getLoginNameLabel(),
                clearIcon: true
            }, {
                xtype: 'multiselectfield',
                name: "beats",
                required: false,
                label: SFenforce.util.Config.getLoginBeatsLabel(),
                usePicker: false,
                displayField: 'name',
                valueField: 'name',
                store: 'Beats'
            }, {
                xtype: 'toolbar',
                id: 'zoomSelectorToolbar',
                layoyut: {
                    pack: 'center',
                    align: 'center'
                },
                items: [{
                    xtype: 'label',
                    html: SFenforce.util.Config.getLoginZoomToLabel(),
                    width: 100
                }, {
                    xtype: 'segmentedbutton',
                    id: "zoomSelector",
                    submit: false,
                    required: false,
                    allowDepress: false,
                    allowMultiple: false,
                    flex: 1,
                    layout: {
                        pack: 'center'
                    },
                    items: [{
                        text: SFenforce.util.Config.getLoginMyBeatsLabel(),
                        value: "mybeats",
                        pressed: true,
                        flex: 1
                    }, {
                        text: SFenforce.util.Config.getLoginAllBeatsLabel(),
                        value: "allbeats",
                        flex: 1
                    }, {
                        text: SFenforce.util.Config.getLoginMyLocationLabel(),
                        value: "mylocation",
                        flex: 1
                    }]
                }]
            }, {
                xtype: 'hiddenfield',
                name: 'zoomTo',
                submit: false
            }]
        }]);
        me.callParent();
    }
});
