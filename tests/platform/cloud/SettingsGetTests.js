/*!
Copyright 2017-2020 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");
require("./DisruptionSettingsSequenceGradeConfig.js");
require("../../shared/SettingsGetTestDefs.js");

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsGet");

gpii.loadTestingSupport();

// Build test cases that need to be tested against various solution registry versions
gpii.tests.cloud.oauth2.srVersionTests = gpii.tests.cloud.oauth2.settingsGet.buildTestDefs(gpii.tests.cloud.oauth2.settingsGetTestsWithSrVersion, {
    "noVersionRequest": {
        settingsRequest: "{settingsRequestNoSrVersion}",
        solutionToVerify: "com.microsoft.windows.stickyKeys",
        expectedSr: gpii.tests.cloud.oauth2.settingsGet.testData.stickyKeysSettingsHandlers.version1
    },
    "version1": {
        settingsRequest: "{settingsRequestWithSrVersion}",
        srVersionInRequest: 1,
        solutionToVerify: "com.microsoft.windows.stickyKeys",
        expectedSr: gpii.tests.cloud.oauth2.settingsGet.testData.stickyKeysSettingsHandlers.version1
    },
    "version2": {
        settingsRequest: "{settingsRequestWithSrVersion}",
        srVersionInRequest: 2,
        solutionToVerify: "com.microsoft.windows.stickyKeys",
        expectedSr: gpii.tests.cloud.oauth2.settingsGet.testData.stickyKeysSettingsHandlers.version2
    },
    // When the SR version is not provided, fall back to the lowest version
    "versionNotProvided": {
        settingsRequest: "{settingsRequestWithSrVersion}",
        srVersionInRequest: "",
        solutionToVerify: "com.microsoft.windows.stickyKeys",
        expectedSr: gpii.tests.cloud.oauth2.settingsGet.testData.stickyKeysSettingsHandlers.version1
    },
    // When the SR version is not an int, convert to int before proceeding
    "versionNotInt": {
        settingsRequest: "{settingsRequestWithSrVersion}",
        srVersionInRequest: "random",
        solutionToVerify: "com.microsoft.windows.stickyKeys",
        expectedSr: gpii.tests.cloud.oauth2.settingsGet.testData.stickyKeysSettingsHandlers.version1
    }
});

// Concat all tests that need or don't need to be tested against various solution registry versions
gpii.tests.cloud.oauth2.settingsGetTests = gpii.tests.cloud.oauth2.srVersionTests.concat(gpii.tests.cloud.oauth2.settingsGetTestsWithoutSrVersion);

gpii.test.cloudBased.oauth2.runDisruptedTests(
    gpii.tests.cloud.oauth2.settingsGetTests,
    gpii.tests.cloud.oauth2.settings.config,
    "gpii.test.couchEnvironment"
);
