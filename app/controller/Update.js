Ext.define('SFenforce.controller.Update', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
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
        for (var j=0, jj=fids.length;j<jj; ++j) {
            var code = this.getUpdateList().getSelection()[0].get('code');
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
            OpenLayers.Request.POST({
                url: url,
                callback: function(response) {
                    var success = format.read(response.responseText).success;
                    if (!success) {
                        Ext.Msg.show({
                            title: SFenforce.util.Config.getErrorTitle(),
                            message: SFenforce.util.Config.getTransactionErrorText(),
                            buttons: [{text: 'OK', ui: 'sfbutton'}],
                            promptConfig: false
                        });
                    } else {
                        var mapFeature = this.getPopup().feature;
                        if(mapFeature && mapFeature.layer){
                            mapFeature.layer.destroyFeatures([mapFeature]);    
                        }
                    }
                },
                scope: this,
                data: xml
            });
        }
    }

});
