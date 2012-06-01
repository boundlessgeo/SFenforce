Ext.define('SFenforce.util.Config', {
    singleton : true,

    config : {
        geoserverUrl: '/geoserver22beta2/ows',
        featureNS: 'http://www.sfpark.org/SFenforce'
    },

    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
