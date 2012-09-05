Ext.define('SFenforce.controller.Update', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.LoadMask', 'Ext.util.DelayedTask'],
    config: {
        refs: {
            map: 'map',
            updateList: '#updateList',
            saveButton: '#saveButton',
            popup: '#featureinfo'
        },

        control: {
            saveButton: {
                tap: 'doTransaction'
            }
        }

    },

    doTransaction: function() {
        var attributes = this.getPopup().feature.attributes;
        var fids = [];
        var table = SFenforce.util.Config.getUpdateTable();
        var featureNS = SFenforce.util.Config.getFeatureNS();
        var dispositionCodeField = SFenforce.util.Config.getDispositionCodeField();
        var badgeField = SFenforce.util.Config.getBadgeField();
        var entryDateField = SFenforce.util.Config.getEntryDateField();
        var badgeValue = SFenforce.userInfo['badge'];
        var programField = SFenforce.util.Config.getLastUpdatedProgramField();
        var programValue = SFenforce.util.Config.getLastUpdatedProgramValue();
        var userField = SFenforce.util.Config.getLastUpdatedUserField();
        var fields = SFenforce.util.Config.getOpportunityIdFields();
        for (var i=0, ii=fields.length; i<ii; ++i) {
            var value = attributes[fields[i]];
            if (value !== null) {
                fids.push(table + "." + value);
            }
        }
        var features = [];
        var hasSelection = this.getUpdateList().hasSelection();
        if (fids.length === 0 || !hasSelection) {
            return;
        }
        for (var j=0, jj=fids.length;j<jj; ++j) {
            var code = this.getUpdateList().getSelection()[0].get('value');
            var attr = {};
            var curTime = new Date().toISOString();
            var updatedUser = SFenforce.util.Config.getDefaultLastUpdatedUser();
            attr[dispositionCodeField] = code;
            attr[badgeField] = badgeValue;
            attr[entryDateField] = curTime;
            attr[programField] = programValue;
            attr[userField] = updatedUser;
            var feature = new OpenLayers.Feature.Vector(null, attr);
            feature.fid = fids[j];
            feature.state = OpenLayers.State.UPDATE;
            features.push(feature);
        }
        if (features.length > 0) {
            var format = new OpenLayers.Format.WFST({
                featurePrefix: SFenforce.util.Config.getPrefix(), 
                featureType: table, 
                geometryName: null,
                featureNS: featureNS, 
                version: "1.1.0"
            });
            var xml = format.write(features);
            var url = SFenforce.util.Config.getGeoserverUrl();
            this.getUpdateList().mask({
                xtype: 'loadmask', 
                message: SFenforce.util.Config.getSaveLoadMask()
            });
            OpenLayers.Request.POST({
                url: url,
                callback: function(response) {
                    this.getUpdateList().unmask();
                    this.getUpdateList().deselectAll();
                    var cfg, label = Ext.getCmp('submitLabel');
                    var success = format.read(response.responseText).success;
                    var map = this.getMap().getMap();
                    var vectorLayer = map.getLayersByName(SFenforce.util.Config.getCitationLayerName())[0];
                    if (!success) {
                        label.setHtml('&nbsp;&nbsp;' + SFenforce.util.Config.getTransactionErrorText());
                    } else {
                        label.setHtml('&nbsp;&nbsp;' + SFenforce.util.Config.getTransactionSuccessText());
                        var mapFeature = this.getPopup().feature;
                        if (mapFeature && mapFeature.layer) {
                            mapFeature.layer.events.triggerEvent("featureunselected", {feature: mapFeature});
                            mapFeature.layer.destroyFeatures([mapFeature]);
                            // redraw the WMS layer
                            map.getLayersByName(SFenforce.util.Config.getNoDataLayerName())[0].redraw(true);
                        }
                    }
                    if (!this.task) {
                        this.task = Ext.create('Ext.util.DelayedTask', function() {
                            label.setHtml('');
                        });
                    }
                    if (vectorLayer) {
                        vectorLayer.events.on({
                            'featureselected': function() {
                                label.setHtml('');
                            }
                        });
                    }
                    this.task.delay(2500);
                },
                scope: this,
                data: xml
            });
        }
    }

});
