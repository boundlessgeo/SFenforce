Ext.define('SFenforce.controller.Legend', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Label', 'GXM.FeatureRenderer'],
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
                        xtype: 'gxm_renderer',
                        symbolType: "Point",
                        width: 25,
                        symbolizers: [Ext.apply(
                            Ext.applyIf({
                                pointRadius: SFenforce.util.Config.getMinPointRadius()
                            }, style.defaultStyle), 
                            rule.symbolizer
                        )]
                    }, {
                        flex: 1,
                        xtype: 'label',
                        html: rule.name
                    }]
                });
            }
            // add another one for the WMS layer
            items.push({
                xtype: 'container',
                layout: 'hbox',
                pack: 'start',
                align: 'stretch',
                items: [{
                    xtype: 'gxm_renderer',
                    symbolType: "Point",
                    width: 25,
                    symbolizers: [{
                        graphicName: "circle",
                        pointRadius: 2,
                        fillColor: "black"
                    }]
                }, {
                    flex: 1,
                    xtype: 'label',
                    html: SFenforce.util.Config.getNoDataRuleTitle()
                }]
            });
            this.legend = Ext.Viewport.add({
                xtype: 'panel', 
                width: SFenforce.util.Config.getLegendSize()[0], 
                height: SFenforce.util.Config.getLegendSize()[1],
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
