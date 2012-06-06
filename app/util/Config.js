Ext.define('SFenforce.util.Config', {
    singleton : true,
    requires: ['Ext.XTemplate'],

    config : {
        /* @private */
        beatsBounds: null,
        bounds: new OpenLayers.Bounds(-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212),
        geoserverUrl: '/geoserver/ows',
        featureNS: 'http://www.sfpark.org/SFenforce',
        prefix: "SFenforce",
        noDataLayerName: "No Data Spaces",
        citationLayerName: "Citation opportunities",
        style: null,
        defaultDispositionValue: 1,
        featureTpl: ['{feature.attributes.POST_ID}<br/>',
            '<tpl if="feature.attributes.METER_EXPIRED_FLAG == 1">Meter expired<br/></tpl>',
            '<tpl if="feature.attributes.COMMERCIAL_OCCUPIED_FLAG == 1">Commercial occupied</tpl>'
        ],
        featurePopupOffset: [15, 15],
        featurePopupSize: [350, 150],

        /* classification */
        unpaidColor: "#FF0000",
        occupiedColor: "#EFEF20",
        citedColor: "#22FF11",
        selectedStrokeColor: "blue",
        scaleBreak: 2500,
        minPointRadius: 5,
        maxPointRadius: 10,
        /* end classification */

        /* data model */
        beatField: "PCO_BEAT",
        parkingSessionField: "PARKING_SESSION_ID",
        meterExpiredField: "METER_EXPIRED_FLAG",
        commercialOccupiedField: "COMMERCIAL_OCCUPIED_FLAG",
        dispositionCodeField: "DISPOSITION_CODE",
        citationView: "CITATION_OPPORTUNITY_VW",
        citationGeomField: "GEOM",
        /* end data model */

        /* i18n */
        loginFormInstructions: "Login to the enforcement application",
        loginNameLabel: "Badge number",
        loginBeatsLabel: "Beats",
        loginButtonText: "Login",
        loginZoomToLabel: "Zoom To : ",
        loginMyBeatsLabel: "My Beats",
        loginAllBeatsLabel: "All Beats",
        loginMyLocationLabel: "My Location",
        mapQuestAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        unpaidRuleTitle: "Unpaid vehicle",
        commercialRuleTitle: "Vehicle at commercial space",
        citedRuleTitle: "Cited",
        dispositionCodeLabel: "Category",
        saveButtonText: "Save"
        /* end i18n */
    },

    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
