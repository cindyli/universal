/**
GPII Data Loader Tests Utils

Copyright 2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

// The base testEnvironment grade used by all successful and failed test cases.
// This component must be name as "testEnvironment" because its base grade "gpii.test.pouch.environment"
// looks up this compnent name for port and events.
// See: https://github.com/GPII/gpii-pouchdb/blob/master/src/test/environment.js#L55
fluid.defaults("gpii.tests.dataLoader.testEnvironment", {
    gradeNames: ["gpii.test.pouch.environment"],
    port: 1234,
    // Must be supplied with a "gpii.dataLoader.dataLoader" grade to ensure what's defined in "dataLoader" sub-component makes sense
    dataLoaderGrade: null,
    distributeOptions: {
        source: "{that}.options.dataLoaderGrade",
        target: "{that > dataLoader}.options.gradeNames"
    },
    components: {
        dataLoader: {
            type: "fluid.component",
            createOnEvent: "onHarnessReady",
            options: {
                listeners: {
                    "onDataLoaded.escalate": "{testEnvironment}.events.onDataLoaded.fire",
                    "onDataLoadedError.escalate": "{testEnvironment}.events.onDataLoadedError.fire"
                }
            }
        }
    },
    events: {
        onDataLoaded: null,
        onDataLoadedError: null
    }
});

fluid.defaults("gpii.tests.dataLoader.baseTestCaseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    sequenceEnd: [{
        func: "{gpii.test.pouch.environment}.events.onCleanup.fire"
    }, {
        event:    "{gpii.test.pouch.environment}.events.onCleanupComplete",
        listener: "fluid.log",
        args:     ["Database cleanup complete"]
    }]
});

/**
 * The utility function that uses regex to compare whether a string or each string in an given array
 * match the regex pattern provided in the expected string or array.
 * @param toCompare {String|Array} A string or an array of strings to be compared
 * @param expectedMatches {String|Array} A string or an array of regex patterns to be matched
 * @return {Boolean} true if all strings in the toCompare match regex patterns in expectedMatches in order, otherwise, return false.
 */
gpii.tests.dataLoader.verifyMatches = function (toCompare, expectedMatches) {
    toCompare = fluid.makeArray(toCompare);
    expectedMatches = fluid.makeArray(expectedMatches);

    var matched = [];
    fluid.each(toCompare, function (one, i) {
        var matchResult = one.match(expectedMatches[i]);
        if (matchResult && matchResult.length > 0) {
            matched.push(one);
        }
    });

    return toCompare.length === matched.length;
};

/**
 * The kettle testing assert function to verify the response of a kettle request
 * @param msg {String} A message to be displayed by jqUnit assertion
 * @param response {Object} A http response
 * @param body {Object} The response carried by the `onComplete` event of a kettle request
 * @param expectedStatus {Number} The expected http status code
 * @param expected {Object} The expected response data
 * @return None
 */
gpii.tests.dataLoader.checkResponse = function (msg, response, body, expectedStatus, expected) {
    expectedStatus = expectedStatus ? expectedStatus : 200;
    var bodyData = JSON.parse(body);

    gpii.test.express.helpers.isSaneResponse(response, body, expectedStatus);
    jqUnit.assertLeftHand(msg, expected, bodyData);
};

/**
 * The testing assert function to verify an error message
 * @param msg {String} A message to verify
 * @param expectedMatchedError {String} A regex match pattern to match the msg against. Using regex
 * is to avoid the verification of the real machine path that is different when a test runs on different machines.
 * @return None
 */
gpii.tests.dataLoader.checkError = function (msg, expectedMatchedError) {
    var isErrorMatch = gpii.tests.dataLoader.verifyMatches(msg, expectedMatchedError);
    jqUnit.assertTrue("The expected error is reported", isErrorMatch);
};
