Ext.define('SFenforce.view.DispositionList', {
    extend: 'Ext.List',
    xtype: 'sflist',

    config: {
        scrollable: false,
        itemTpl: '<div class="value-{value}">{text}</div>'
    },

    initialize: function() {
        this.callParent(arguments);
        for (var i=0, ii=this.container.getViewItems().length; i<ii; ++i) {
            var item = Ext.get(this.container.getViewItems()[i]);
            var last = item.last().last();
            for (var j=0, jj=SFenforce.util.Config.getSpecialValues().length; j<jj; j++) {
                var cls = 'value-' + SFenforce.util.Config.getSpecialValues()[j];
                if (last.hasCls(cls)) {
                    item.addCls('special-item');
                }
            }
       }
   }
});
