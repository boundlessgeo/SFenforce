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
        featureNS: 'http://www.sfpark.org/SFenforce',

        /**
         * @cfg {String} prefix
         * The prefix of the namespace.
         */
        prefix: "SFenforce",

        /**
         * @cfg {Integer} defaultDispositionValue
         * The default value to use in the disposition code combo box.
         */
        defaultDispositionValue: 1,

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
        
        /**
         * @cfg {RegEx} badgeFormat
         * A regex for validating the badge number
         */
        badgeFormat: /^\d+$/,

        /** classification */
        unpaidColor: "#FF0000",
        occupiedColor: "#EFEF20",
        citedColor: "#22FF11",
        selectedStrokeColor: "blue",
        /* point size in meters */
        pointSize: 5,
        /* minimum point radius in pixels */
        minPointRadius: 3,
        /* hit ratio for better touch selection */
        hitRatio: 2.5,
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
        badgeField: "PCO_BADGE_NO",
        entryDateField: "DISPOSITION_ENTRY_DT",
        lastUpdatedProgramField: "LAST_UPD_PGM",
        lastUpdatedProgramValue: "Mobile device",
        lastUpdatedUserField: "LAST_UPD_USER",
        defaultLastUpdatedUser: "Mobile User",
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
        featureInfoEmptyText: "Please select a space.",
        noDataLayerName: "No Data Spaces",
        citationLayerName: "Citation opportunities",
        badgeValidationMsg: "Please enter badge number",
        loginFormInstructions: "SF Enforce",
        loginNameLabel: "Badge Number",
        loginNamePlaceholder: "Enter Badge Number (Required)",
        loginBeatsLabel: "Beats",
        loginBeatsPlaceholder: "Select Beats",
        loginButtonText: "Continue",
        loginZoomToLabel: "Zoom To : ",
        loginMyBeatsLabel: "My Beats",
        loginAllBeatsLabel: "All Beats",
        loginMyLocationLabel: "My Location",
        backToLoginText: "Back",
        unpaidRuleTitle: "Unpaid vehicle",
        commercialRuleTitle: "Vehicle at commercial space",
        citedRuleTitle: "Vehicle already visited",
        noDataRuleTitle: "Data unavailable, check in field",
        dispositionCodeLabel: "Category",
        saveButtonText: "Save",
        doneButtonText: "DONE",
        errorTitle: "Sorry, but an error occurred.",
        transactionErrorText: "Failure updating disposition code",
        gpsErrorMsg: "GPS information is currently unavailable. Please try again when GPS is available, or enable GPS for this application on your device.",
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
