/*!
 * GPII Auth Data Loader Tests
 *
 * Copyright 2017 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = fluid || require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-pouchdb");
gpii.pouch.loadTestingSupport();

require("../../scripts/shared/authDataLoader.js");
require("./DataLoaderTestsUtils.js");

//*********** 1. The successful data loading test case ***********//
fluid.defaults("gpii.tests.authDataLoader.success", {
    gradeNames: ["gpii.dataLoader.authDataLoader"],
    dbName: "auth",
    dataFile: [
        "%universal/testData/security/TestOAuth2DataStore.json",
        "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
    ],
    couchDbUrl: "http://localhost:1234"
});

// This component must be name as "testEnvironment" because of the reason described at line 25
fluid.defaults("gpii.tests.authDataLoader.success.testEnvironment", {
    gradeNames: ["gpii.tests.dataLoader.testEnvironment"],
    dataLoaderGrade: "gpii.tests.authDataLoader.success",
    events: {
        onFixturesConstructed: {
            events: {
                onDataLoaded: "onDataLoaded"
            }
        }
    }
});

fluid.defaults("gpii.tests.authTestCaseHolder.success", {
    gradeNames: ["gpii.tests.dataLoader.baseTestCaseHolder"],
    expected: {
        total: {
            doc_count: 17
        }
    },
    rawModules: [{
        name: "Testing Auth Data Loader - success",
        tests: [{
            name: "Testing the successful loading",
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
                path: "/auth",
                port: 1234,
                method: "GET"
            }
        }
    }
});

fluid.defaults("gpii.tests.authDataLoaderTests.success", {
    gradeNames: ["gpii.tests.authDataLoader.success.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.tests.authTestCaseHolder.success"
        }
    }
});

//*********** 2. The error data loading test case ***********//
fluid.defaults("gpii.tests.authDataLoader.error", {
    gradeNames: ["gpii.dataLoader.authDataLoader"],
    dbName: "auth",
    dataFile: [
        "%universal/tests/nonExistent.json",
        "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
    ],
    couchDbUrl: "http://localhost:1234"
});

// This component must be name as "testEnvironment" because of the reason described at line 25
fluid.defaults("gpii.tests.authDataLoader.error.testEnvironment", {
    gradeNames: ["gpii.tests.dataLoader.testEnvironment"],
    dataLoaderGrade: "gpii.tests.authDataLoader.error"
});

fluid.defaults("gpii.tests.authTestCaseHolder.error", {
    gradeNames: ["gpii.tests.dataLoader.baseTestCaseHolder"],
    rawModules: [{
        name: "Testing Auth Data Loader - error",
        tests: [{
            name: "Testing the non-existence of data files",
            type: "test",
            sequence: [{
                event: "{testEnvironment}.events.onDataLoadedError",
                listener: "gpii.tests.dataLoader.checkError",
                args: ["{arguments}.0", "Data file\\(s\\) not found in the file system\:.*nonExistent.json"]
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

fluid.defaults("gpii.tests.authDataLoaderTests.error", {
    gradeNames: ["gpii.tests.authDataLoader.error.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.tests.authTestCaseHolder.error"
        }
    }
});

fluid.test.runTests([
    "gpii.tests.authDataLoaderTests.success",
    "gpii.tests.authDataLoaderTests.error"
]);
