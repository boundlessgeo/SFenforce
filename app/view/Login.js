Ext.define('SFenforce.view.Login', {
    extend: 'Ext.form.FormPanel',
    alias: 'widget.login',
    requires: [
        'SFenforce.view.MultiSelect', 
        'Ext.form.FieldSet', 
        'SFenforce.store.Beats'
    ],
    formInstructions: "Login to the enforcement application",
    pcoLabel: "PCO",
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
                items: [{xtype: 'spacer', flex: 1}, {
                    xtype: 'button',
                    id: 'login-btn',
                    text: 'Login',
                    handler: function() {
                        this.fireEvent("login", this);
                    },
                    scope: this
                }]
            }, {
                xtype: 'textfield',
                name: 'name',
                label: this.pcoLabel,
                clearIcon: true
            }, {
                xtype: 'multiselectfield',
                name: "beats",
                label: this.beatsLabel,
                displayField: 'name',
                valueField: 'name',
                store: 'Beats'
            }]
        }]);
        me.callParent();
    }
});
