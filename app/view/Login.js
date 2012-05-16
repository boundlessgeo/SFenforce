Ext.define('SFenforce.view.Login', {
    extend: 'Ext.form.FormPanel',
    requires: ['SFenforce.view.MultiSelect', 'Ext.form.FieldSet', 'SFenforce.store.Beats'],
    formInstructions: "Login to the enforcement application",
    initialize: function() {
        var me = this;
        me.add([{
            xtype: 'fieldset',
            id: 'fieldset',
            instructions: this.formInstructions,
            defaults: {
                required: true,
                labelAlign: 'left',
                labelWidth: '40%'
            },
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                items: [{
                    xtype: 'button',
                    text: 'Login',
                    handler: function() {
                        console.log(this.getValues());
                        var app = this.up('panel');
                        app.setActiveItem(1);
                    },
                    scope: this
                }]
            }, {
                xtype: 'textfield',
                name: 'name',
                label: 'Surveyor',
                clearIcon: true
            }, {
                xtype: 'multiselectfield',
                label: "Beats",
                displayField: 'name',
                valueField: 'name',
                store: 'Beats'
            }]
        }]);
        me.callParent();
    }
});
