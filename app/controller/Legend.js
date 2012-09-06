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
            var rules = [{
                name: SFenforce.util.Config.getUnpaidRuleTitle(),
                symbolizer: {
                    graphicWidth: 32,
                    graphicHeight: 37,
                    graphicYOffset: -19,
                    externalGraphic: "resources/icons/parking-space.png"
                }
            }, {
                name: SFenforce.util.Config.getCommercialRuleTitle(),
                symbolizer: {
                    graphicWidth: 32,
                    graphicHeight: 37,
                    graphicYOffset: -19,
                    externalGraphic: "resources/icons/parking-space-commercial.png"
                }
            }];
            for (var i=0, ii=rules.length; i<ii; ++i) {
                var rule = rules[i];
                items.push({
                    xtype: 'container',
                    layout: 'hbox',
                    pack: 'start',
                    align: 'stretch',
                    items: [{
                        xtype: 'gxm_renderer',
                        minWidth: 32,
                        minHeight: 37,
                        symbolType: "Point",
                        width: 35,
                        symbolizers: [
                            rule.symbolizer
                        ]
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
                    width: 37,
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
                zIndex: 1000,
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
