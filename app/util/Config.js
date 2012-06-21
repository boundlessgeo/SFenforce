Ext.define('SFenforce.util.Config', {
    singleton : true,

    config : {
        /**
         * @cfg {Array} bounds
         * The bounds of the all the beats in EPSG:900913.
         */
        bounds: [-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212],

        /**
         * @cfg {String} geoserverUrl
         * The URL where GeoServer WMS/WFS can be accessed. This needs to be on the same origin as the web app.
         */
        geoserverUrl: '/geoserver/ows',

        /**
         * @cfg {String} featureNS
         * The namespace URI used on the WFS.
         */
        featureNS: 'http://sfpark.org',
 
        /**
         * @cfg {String} prefix
         * The prefix of the namespace.
         */
        prefix: "sfpark",

        /**
         * @cfg {Integer} defaultDispositionValue
         * The default value to use in the disposition code combo box.
         */
        defaultDispositionValue: 1,

        /**
         * @cfg {Array} featureTpl
         * Template to be used in the feature info popup.
         */
        featureTpl: ['{feature.attributes.POST_ID}<br/>',
            '<tpl if="feature.attributes.METER_EXPIRED_FLAG == 1">Meter expired<br/></tpl>',
            '<tpl if="feature.attributes.COMMERCIAL_OCCUPIED_FLAG == 1">Commercial occupied</tpl>'
        ],

        /**
         * @cfg {Array} featurePopupOffset
         * The offset in the X and Y direction of the feature popup wrt the feature itself.
         */
        featurePopupOffset: [15, 15],

        /**
         * @cfg {Array} featurePopupSize
         * The width and height of the feature popup.
         */
        featurePopupSize: [350, 150],

        /**
         * @cfg {Array} legendSize
         * The width and height of the legend popup.
         */
        legendSize: [200, 200],
        
        /**
         * @cfg {Number} geolocationZoomLevel
         * The new zoom level of the map after selecting 'zoom to my location'
         */
        geolocationZoomLevel: 18,

        /** classification */
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
        commercialRuleFilter: new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters:[
                new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "COMMERCIAL_OCCUPIED_FLAG",
                    value: 1
                }),
                new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                    property: "METER_EXPIRED_FLAG",
                    value: 1
                })
            ]
        }), 
        citedRuleFilter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "DISPOSITION_CODE",
            value: 1
        }),
        /** end classification */

        /** data model */
        beatField: "PCO_BEAT",
        parkingSessionField: "PARKING_SESSION_ID",
        dispositionCodeField: "DISPOSITION_CODE",
        dispositionFlagField: "DISPOSITION_CODE_FLAG",
        citationView: "CITATION_OPPORTUNITY_VW",
        citationGeomField: "GEOM",
        updateTable: "RT_CITATION_OPPORTUNITY",
        opportunityIdFields: ['MTR_EXPIRED_OPP_ID', 'COMML_OCC_OPP_ID'],
        beatNameField: "BEATNAME",
        dispositionCodeLookupValueField: "VALUE",
        dispositionCodeLookupTextField: "DESCRIPTION",
        beatsFeatureType: "PCO_BEATS",
        dispositionCodesFeatureType: "DISPOSITION_CODES_TMP",
        /** end data model */

        /** i18n */
        noDataLayerName: "No Data Spaces",
        citationLayerName: "Citation opportunities",
        badgeValidationMsg: "Please enter badge number",
        loginFormInstructions: "Login to the enforcement application",
        loginNameLabel: "Badge number",
        loginBeatsLabel: "Beats",
        loginButtonText: "Next",
        loginZoomToLabel: "Zoom To : ",
        loginMyBeatsLabel: "My Beats",
        loginAllBeatsLabel: "All Beats",
        loginMyLocationLabel: "My Location",
        backToLoginText: "Back",
        mapQuestAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        unpaidRuleTitle: "Unpaid vehicle",
        commercialRuleTitle: "Vehicle at commercial space",
        citedRuleTitle: "Vehicle already visited",
        noDataRuleTitle: "Data unavailable, check in field",
        dispositionCodeLabel: "Category",
        saveButtonText: "Save",
        doneButtonText: "Done",
        errorTitle: "Error",
        transactionErrorText: "Failure updating disposition code",
        /** end i18n */

        /** private properties */
        beatsBounds: null,
        style: null
        /** end private properties */
    },

    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
