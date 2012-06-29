Ext.define('SFenforce.controller.Update', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            updateForm: '#updateForm',
            saveButton: '#saveButton',
            popup: 'gxm_featurepopup',
            popupPanel: '#popuppanel'
        },

        control: {
            saveButton: {
                tap: 'doTransaction'
            }
        }

    },

    doTransaction: function() {
        var attributes = this.getPopup().getFeature().attributes;
        var fids = [];
        var table = SFenforce.util.Config.getUpdateTable();
        var featureNS = SFenforce.util.Config.getFeatureNS();
        var dispositionCodeField = SFenforce.util.Config.getDispositionCodeField();
        var badgeField = SFenforce.util.Config.getBadgeField();
        var entryDateField = SFenforce.util.Config.getEntryDateField();
        var badgeValue = SFenforce.userInfo['badge'];
        var fields = SFenforce.util.Config.getOpportunityIdFields();
        for (var i=0, ii=fields.length; i<ii; ++i) {
            var value = attributes[fields[i]];
            if (value !== null) {
                fids.push(table + "." + value);
            }
        }
        var features = [];
        for (var j=0, jj=fids.length;j<jj; ++j) {
            var code = this.getUpdateForm().getValues()['code'];
            var attr = {};
            var curTime = new Date().toISOString();
            attr[dispositionCodeField] = code;
            attr[badgeField] = badgeValue;
            attr[entryDateField] = curTime;
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
            var xml = format.write([feature]);
            var url = SFenforce.util.Config.getGeoserverUrl();
            OpenLayers.Request.POST({
                url: url,
                callback: function(response) {
                    var success = format.read(response.responseText).success;
                    if (!success) {
                        Ext.Msg.alert(SFenforce.util.Config.getErrorTitle(), SFenforce.util.Config.getTransactionErrorText());
                    } else {
                        this.getPopupPanel().hide();
                        var mapFeature = this.getPopup().getFeature();
                        if(mapFeature && mapFeature.layer){
                            mapFeature.attributes[dispositionCodeField] = 1;
                            mapFeature.layer.drawFeature(mapFeature);    
                        }
                    }
                },
                scope: this,
                data: xml
            });
        }
    }

});
