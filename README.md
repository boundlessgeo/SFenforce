SFenforce
=========

Enforcement app for City of San Francisco.

Go into externals/openlayers/build and build the full.cfg profile for now (TODO: make an application specific profile).

For debugging purposes you can change the reference in index.html to lib/OpenLayers.js instead.

For GXM and the application code the Ext Loader is used.

To use the Sencha SDK use e.g. in the root dir of your github clone:

sencha app build testing

this will output everything needed in build/testing

To create a production build perform the following steps:

sencha app build production
mkdir build/production/externals/openlayers/build/
cp externals/openlayers/build/OpenLayers.js build/production/externals/openlayers/build/
