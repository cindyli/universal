/*!
Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/**
 * The components required by ../prefsDataLoader.js
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    fs = require("fs"),
    JSON5 = require("json5");

fluid.setLogging(true);

require("./dataLoader.js");

fluid.defaults("gpii.dataLoader.prefsDataLoader", {
    gradeNames: ["fluid.component"],
    components: {
        dataConverter: {
            type: "gpii.dataLoader.prefsDataLoader.dataConverter",
            options: {
                listeners: {
                    "onPrefsDataStructureConstructed.escalate": {
                        listener: "{prefsDataLoader}.events.onCreateLoader.fire",
                        args: ["{arguments}.0"]
                    }
                }
            }
        },
        loader: {
            type: "gpii.dataLoader",
            createOnEvent: "onCreateLoader",
            options: {
                databases: {
                    preferences: {
                        data: "{arguments}.0"
                    }
                },
                listeners: {
                    "onCreate.escalate": "{prefsDataLoader}.events.onLoaderReady.fire"
                }
            }
        }
    },
    events: {
        onCreateLoader: null,
        onLoaderReady: null
    },
    listeners: {
        "onLoaderReady.load": {
            listener: "gpii.dataLoader.prefsDataLoader.loadData",
            args: ["{that}.loader"]
        }
    },
    distributeOptions: {
        "couchDbUrl": {
            source: "{that}.options.couchDbUrl",
            target: "{that > loader}.options.couchDbUrl"
        },
        "dataPath": {
            source: "{that}.options.dataPath",
            target: "{that > dataConverter}.options.dataPath"
        }
    }
});

gpii.dataLoader.prefsDataLoader.loadData = function (loader) {
    var promise = loader.load();
    promise.then(function () {
        console.log("The preferences data has been loaded successfully.");
    }, function (err) {
        console.log("Error at loading the preferences data. Error details: ", err);
    });
};

/*
 * Converts the physical data files into the structure that can be imported into CouchDB
 */
fluid.defaults("gpii.dataLoader.prefsDataLoader.dataConverter", {
    gradeNames: ["fluid.component"],
    dataPath: "%universal/testData/preferences/",
    events: {
        onPrefsDataStructureConstructed: null
    },
    listeners: {
        "onCreate.constructPrefsDataStructure": {
            listener: "gpii.dataLoader.prefsDataLoader.dataConverter.constructPrefsDataStructure",
            args: ["{that}.options.dataPath", "{that}.events.onPrefsDataStructureConstructed"]
        }
    }
 });

gpii.dataLoader.prefsDataLoader.dataConverter.constructPrefsDataStructure = function (dataPath, onPrefsDataStructureConstructedEvent) {
    var prefsDataStructure = [];
    var actualDataPath = fluid.module.resolvePath(dataPath);
    var prefsDataList = fs.readdirSync(actualDataPath);

    fluid.each(prefsDataList, function (filename) {
        var fileExtension = filename.slice(-5);
        // Only json files contain preferences data
        if (fileExtension === ".json") {
            var gpiiToken = filename.substring(0, filename.length - 5);
            var fullPath = actualDataPath + filename;

            var data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
            var prefsData = {};
            // fluid.set(prefsData, "a", data);
            fluid.set(prefsData, gpiiToken, data);
            prefsDataStructure.push(prefsData);
        }
    });

    onPrefsDataStructureConstructedEvent.fire(prefsDataStructure);
};