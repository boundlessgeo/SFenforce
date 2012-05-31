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
        var table = 'RT_CITATION_OPPORTUNITY';
        var featureNS = "http://www.sfpark.org/SFenforce";
        var field = 'DISPOSITION_CODE';
        var fields = ['MTR_EXPIRED_OPP_ID', 'OVER_TL_OPP_ID', 'COMML_OCC_OPP_ID'];
        for (var i=0, ii=fields.length; i<ii; ++i) {
            var value = attributes[fields[i]];
            if (value !== null) {
                fids.push(table + "." + value);
            }
        }
        var features = [];
        for (var j=0, jj=fids.length;j<jj; ++j) {
            var attr = {};
            attr[field] = this.getUpdateForm().getValues()['code'];
            var feature = new OpenLayers.Feature.Vector(null, attr);
            feature.fid = fids[j];
            feature.state = OpenLayers.State.UPDATE;
            features.push(feature);
        }
        if (features.length > 0) {
            var format = new OpenLayers.Format.WFST({
                featurePrefix: "SFenforce", 
                featureType: table, 
                geometryName: null,
                featureNS: featureNS, 
                version: "1.1.0"
            });
            var xml = format.write([feature]);
            var url = "/geoserver22beta2/wfs";
            OpenLayers.Request.POST({
                url: url,
                callback: function(response) {
                    var success = format.read(response.responseText).success;
                    if (!success) {
                        Ext.Msg.alert('Error', 'Failure updating disposition code');
                    } else {
                        this.getPopupPanel().hide();
                        var mapFeature = this.getPopup().getFeature();
                        if(mapFeature && mapFeature.layer){
                            mapFeature.attributes[field] = 1;
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
