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
    formInstructions: "Login to the enforcement application",
    nameLabel: "Badge number",
    beatsLabel: "Beats",
    initialize: function() {
        var me = this;
        me.add([{
            xtype: 'fieldset',
            id: 'fieldset',
            instructions: {
                title: this.formInstructions,
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
                    text: 'Login'
                }]
            }, {
                xtype: 'numberfield',
                name: 'badge',
                label: this.nameLabel,
                clearIcon: true
            }, {
                xtype: 'multiselectfield',
                name: "beats",
                required: false,
                label: this.beatsLabel,
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
                    html: 'Zoom To : ',
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
                        text: "My Beats",
                        value: "mybeats",
                        pressed: true,
                        flex: 1
                    }, {
                        text: "All Beats",
                        value: "allbeats",
                        flex: 1
                    }, {
                        text: "My Location",
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
