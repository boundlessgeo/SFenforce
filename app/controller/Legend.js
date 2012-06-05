Ext.define('SFenforce.controller.Legend', {
    extend: 'Ext.app.Controller',
    requires: ['SFenforce.view.FeatureRenderer'],
    config: {
        refs: {
            legendButton: '#legendButton'
        },

        control: {
            legendButton: {
                tap: 'showLegend'
            }
        }

    },

    showLegend: function() {
        if (!this.legend) {
            var items = [];
            var style = SFenforce.util.Config.getStyle();
            for (var i=0, ii=style.rules.length; i<ii; ++i) {
                var rule = style.rules[i];
                items.push({
                    xtype: 'container',
                    layout: 'hbox',
                    pack: 'start',
                    align: 'stretch',
                    items: [{
                        xtype: 'featurerenderer',
                        symbolType: "Point",
                        width: 25,
                        symbolizers: [Ext.apply(Ext.apply({}, style.defaultStyle), rule.symbolizer)]
                    }, {
                        flex: 1,
                        xtype: 'label',
                        html: rule.name
                    }]
                });
            }
            this.legend = Ext.Viewport.add({
                xtype: 'panel', 
                width: 200, 
                height: 125,                             
                centered: true,
                modal: true,
                hideOnMaskTap: true,
                items: items
            });
        } else {
            this.legend.show();
        }
    }

});
