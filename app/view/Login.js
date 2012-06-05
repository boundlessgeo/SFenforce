Ext.define('SFenforce.view.Login', {
    extend: 'Ext.form.FormPanel',
    alias: 'widget.login',
    requires: [
        'SFenforce.view.MultiSelect', 
        'Ext.form.FieldSet', 
        'Ext.field.Number',
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
            instructions: {title: this.formInstructions, docked: 'top'},
            defaults: {
                required: true,
                labelAlign: 'left',
                labelWidth: '40%'
            },
            items: [{
                xtype: 'toolbar',
                docked: 'bottom',
                layout: {
                    align:'stretch', 
                    pack: 'center'
                },
                items: [{
                        xtype: 'spacer',
                        flex: 2
                    }, {
                        xtype: 'button',
                        id: 'loginButton',
                        flex: 1,
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
                xtype: 'checkboxfield',
                required: false,
                name: 'zoomtobeats',
                label: "Zoom to beats' extent"
            }]
        }]);
        me.callParent();
    }
});
