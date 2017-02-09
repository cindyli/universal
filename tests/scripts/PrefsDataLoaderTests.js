/*!
 * GPII Preferences Data Loader Tests
 *
 * Copyright 2016-2017 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = fluid || require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-pouchdb");
gpii.pouch.loadTestingSupport();

require("../../scripts/shared/prefsDataLoader.js");
require("./DataLoaderTestsUtils.js");

fluid.registerNamespace("gpii.tests.prefsDataLoader");

//*********** Test gpii.dataLoader.prefsDataLoader.dataConverter ***********//
fluid.defaults("gpii.tests.prefsDataLoader.dataConverter", {
    gradeNames: ["gpii.dataLoader.prefsDataLoader.dataConverter"],
    dataPath: "%universal/tests/scripts/data/prefs/",
    expected: [{
        "_id": "carla",
        "value": {
            "flat": {
                "contexts": {
                    "gpii-default": {
                        "name": "Default preferences",
                        "preferences": {
                            "http://registry.gpii.net/applications/com.texthelp.readWriteGold": {
                                "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": true,
                                "ApplicationSettings.Speech.optSAPI5Speed.$t": 50,
                                "ApplicationSettings.Speech.optAutoUseScreenReading.$t": false
                            }
                        }
                    }
                }
            }
        }
    }, {
        "_id": "sammy",
        "value": {
            "flat": {
                "contexts": {
                    "gpii-default": {
                        "name": "Default preferences",
                        "preferences": {
                            "http://registry.gpii.net/common/fontSize": 24,
                            "http://registry.gpii.net/common/foregroundColor": "white",
                            "http://registry.gpii.net/common/backgroundColor": "black",
                            "http://registry.gpii.net/common/fontFaceFontName": ["Comic Sans"],
                            "http://registry.gpii.net/common/fontFaceGenericFontFace": "sans serif",
                            "http://registry.gpii.net/common/magnification": 2.0,
                            "http://registry.gpii.net/common/tracking": ["mouse"],
                            "http://registry.gpii.net/common/invertColours": true
                        }
                    }
                }
            }
        }
    }]
});

jqUnit.asyncTest("Test gpii.dataLoader.prefsDataLoader.dataConverter", function () {
    gpii.tests.prefsDataLoader.dataConverter({
        listeners: {
            "onPrefsDataStructureConstructed.assert": {
                listener: "jqUnit.assertDeepEq",
                args: ["The converted data structure is expected", "{that}.options.expected", "{arguments}.0"]
            },
            "onPrefsDataStructureConstructed.runTests": {
                listener: "jqUnit.start",
                priority: "last"
            }
        }
    });
});

//*********** Test gpii.dataLoader.prefsDataLoader ***********//

//*********** 1. The successful data loading test case ***********//
fluid.defaults("gpii.tests.prefsDataLoader.success", {
    gradeNames: ["gpii.dataLoader.prefsDataLoader"],
    dbName: "preferences",
    dataPath: "%universal/tests/scripts/data/prefs",
    couchDbUrl: "http://localhost:1234"
});

// This component must be name as "testEnvironment" because of the reason described at line 25
fluid.defaults("gpii.tests.prefsDataLoader.success.testEnvironment", {
    gradeNames: ["gpii.tests.dataLoader.testEnvironment"],
    dataLoaderGrade: "gpii.tests.prefsDataLoader.success",
    events: {
        onFixturesConstructed: {
            events: {
                onDataLoaded: "onDataLoaded"
            }
        }
    }
});

fluid.defaults("gpii.tests.prefsTestCaseHolder.success", {
    gradeNames: ["gpii.tests.dataLoader.baseTestCaseHolder"],
    expected: {
        total: {
            doc_count: 2
        }
    },
    rawModules: [{
        name: "Testing Prefs Data Loader - success",
        tests: [{
            name: "Testing a successful preferences data loading process",
            type: "test",
            sequence: [{
                func: "{totalRequest}.send"
            }, {
                listener: "gpii.tests.dataLoader.checkResponse",
                event:    "{totalRequest}.events.onComplete",
                args:     ["The total number of records should be as expected", "{totalRequest}.nativeResponse", "{arguments}.0", 200, "{testCaseHolder}.options.expected.total"]
            }]
        }]
    }],
    components: {
        totalRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/preferences",
                port: 1234,
                method: "GET"
            }
        }
    }
});

fluid.defaults("gpii.tests.prefsDataLoaderTests.success", {
    gradeNames: ["gpii.tests.prefsDataLoader.success.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.tests.prefsTestCaseHolder.success"
        }
    }
});

//*********** 2. The error data loading test case ***********//
fluid.defaults("gpii.tests.prefsDataLoader.error", {
    gradeNames: ["gpii.dataLoader.prefsDataLoader"],
    dbName: "preferences",
    dataPath: "%universal/nonExistent/",
    couchDbUrl: "http://localhost:1234"
});

// This component must be name as "testEnvironment" because of the reason described at line 25
fluid.defaults("gpii.tests.prefsDataLoader.error.testEnvironment", {
    gradeNames: ["gpii.tests.dataLoader.testEnvironment"],
    dataLoaderGrade: "gpii.tests.prefsDataLoader.error"
});

fluid.defaults("gpii.tests.prefsTestCaseHolder.error", {
    gradeNames: ["gpii.tests.dataLoader.baseTestCaseHolder"],
    rawModules: [{
        name: "Testing Preferences Data Loader - error",
        tests: [{
            name: "Testing the non-existence of a data path",
            type: "test",
            sequence: [{
                event: "{testEnvironment}.events.onDataLoadedError",
                listener: "gpii.tests.dataLoader.checkError",
                args: ["{arguments}.0", "The provided data path does not exist\:.*\/nonExistent\/"]
            }, {
                func: "{verifyDbRequest}.send"
            }, {
                listener: "jqUnit.assertEquals",
                event:    "{verifyDbRequest}.events.onComplete",
                args:     ["The total number of records should be as expected", "{verifyDbRequest}.nativeResponse.statusCode", 404]
            }]
        }]
    }],
    components: {
        verifyDbRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/auth",
                port: 1234,
                method: "GET"
            }
        }
    }
});

fluid.defaults("gpii.tests.prefsDataLoaderTests.error", {
    gradeNames: ["gpii.tests.prefsDataLoader.error.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.tests.prefsTestCaseHolder.error"
        }
    }
});

fluid.test.runTests([
    "gpii.tests.prefsDataLoaderTests.success",
    "gpii.tests.prefsDataLoaderTests.error"
]);
