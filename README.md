SFenforce
=========

Enforcement app for City of San Francisco.

Go into externals/openlayers/build and build the mobile profile:

./build.py mobile.cfg

The app.json file references the build/OpenLayers.js file.

For debugging purposes you can change this to lib/OpenLayers.js

For GXM and the application code the Ext Loader is used.

To use the Sencha SDK use e.g. in the root dir of your github clone:

sencha app build testing

this will output everything needed in build/testing
