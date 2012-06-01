Ext.define('SFenforce.util.Config', {
    singleton : true,

    config : {
        geoserverUrl: '/geoserver22beta2/ows'
    },

    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
