Ext.define('SFenforce.view.Popup', {
    extend: 'Ext.Panel',
    alias: 'widget.popup',
    requires: [
        'Ext.form.Panel', 
        'Ext.field.Select', 
        'Ext.Toolbar', 
        'Ext.Button'
    ],
    config: {
        map: null,
        feature: null,
        layout: 'fit',
        id: 'popupPanel',
        width: SFenforce.util.Config.getFeaturePopupSize()[0],
        height: SFenforce.util.Config.getFeaturePopupSize()[1],
        xy: null,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        tpl: new Ext.XTemplate(SFenforce.util.Config.getFeatureTpl())

    },
    updateFeature: function(newFeature){
        if(newFeature){
            this._feature = newFeature;
            if(newFeature.layer && newFeature.layer.map){
                this.setMap(newFeature.layer.map);
            }
        } else {
            return false;
        }
    },
    applyFeature: function(feature){
        if(!feature){
            return false;
        } else {
            return feature;
        }
    },
    applyMap: function(map){
        if(map.getMap){
            //this is the map panel. we want the actual OL Map
            return map.getMap();
        } else {
            return map;
        }
    },
    updateXy: function(newXY, oldXY){
        var xy = (newXY) ? newXY : (oldXY) ? oldXY : null;
        if(xy){
            this.setTop(xy.y + SFenforce.util.Config.getFeaturePopupOffset()[1]);
            this.setLeft(xy.x + SFenforce.util.Config.getFeaturePopupOffset()[0]);
        }
    }
});