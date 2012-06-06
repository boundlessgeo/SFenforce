Ext.define('SFenforce.util.Config', {
    singleton : true,

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
        legendSize: [200, 125],

        /* classification */
        unpaidColor: "#FF0000",
        occupiedColor: "#EFEF20",
        citedColor: "#22FF11",
        selectedStrokeColor: "blue",
        scaleBreak: 2500,
        minPointRadius: 5,
        maxPointRadius: 10,
        unpaidRuleFilter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "METER_EXPIRED_FLAG",
            value: 1
        }),
        commercialRuleFilter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "COMMERCIAL_OCCUPIED_FLAG",
            value: 1
        }),
        citedRuleFilter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "DISPOSITION_CODE",
            value: 1
        }),
        /* end classification */

        /* data model */
        beatField: "PCO_BEAT",
        parkingSessionField: "PARKING_SESSION_ID",
        dispositionCodeField: "DISPOSITION_CODE",
        citationView: "CITATION_OPPORTUNITY_VW",
        citationGeomField: "GEOM",
        updateTable: "RT_CITATION_OPPORTUNITY",
        opportunityIdFields: ['MTR_EXPIRED_OPP_ID', 'COMML_OCC_OPP_ID'],
        beatNameField: "BEATNAME",
        dispositionCodeLookupValueField: "VALUE",
        dispositionCodeLookupTextField: "DESCRIPTION",
        beatsFeatureType: "PCO_BEATS",
        dispositionCodesFeatureType: "DISPOSITION_CODES_TMP",
        /* end data model */

        /* i18n */
        badgeValidationMsg: "Please enter badge number",
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
        saveButtonText: "Save",
        doneButtonText: "Done",
        errorTitle: "Error",
        transactionErrorText: "Failure updating disposition code"
        /* end i18n */
    },

    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
