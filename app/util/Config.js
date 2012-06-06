Ext.define('SFenforce.util.Config', {
    singleton : true,

    config : {
        /* @private */
        beatsBounds: null,
        bounds: new OpenLayers.Bounds(-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212),
        geoserverUrl: '/geoserver/ows',
        featureNS: 'http://www.sfpark.org/SFenforce',
        noDataLayerName: "No Data Spaces",
        citationLayerName: "Citation opportunities",
        style: null,
        defaultDispositionValue: 1,

        /* i18n */
        loginFormInstructions: "Login to the enforcement application",
        loginNameLabel: "Badge number",
        loginBeatsLabel: "Beats",
        loginButtonText: "Login",
        loginZoomToLabel: "Zoom To : ",
        loginMyBeatsLabel: "My Beats",
        loginAllBeatsLabel: "All Beats",
        loginMyLocationLabel: "My Location"
        /* end i18n */
    },

    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
