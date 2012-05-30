testmobile
=========

Copy the application-specific OpenLayers build profile named openlayers.cfg into the externals/openlayers/build directory.
Go into externals/openlayers/build and build using:

    ./build.py -c closure openlayers.cfg

For debugging purposes you can change the reference in index.html to lib/OpenLayers.js instead.

For GXM and the application code the Ext Loader is used.

To use the Sencha SDK use e.g. in the root dir of your github clone:

    sencha app build testing

this will output everything needed in build/testing

To create a production build perform the following steps:

    sencha app build production
