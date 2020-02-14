/**
GPII "GET /settings" tests using a production configuration where there are
separate docker containers running a cloud-based flowmanaer, preferences server
and couch data base

Requirements:
* an internet connection
* a cloud based flow manager
* a preferences server
* a couchdb containing at least the standard snapset GPII keys and prefs safes

---

Copyright 2015 Raising the Floor - International
Copyright 2018-2020 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

WARNING:  Do not run these tests directly.  They are called from within the
"vagrantCloudBasedContainers.sh" after it has initialized the environment.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

fluid.registerNamespace("gpii.tests.productionConfigTesting");
fluid.registerNamespace("gpii.test.cloudBased.oauth2");

/*
 * ========================================================================
 * Testing of untrusted local config with the live cloud based flow manager
 * ========================================================================
 */

 // Since the universal VM used for running the production config tests is a Linux-like GNOME system and
 // the solution registry version for linux is at the lowest version 1, original test cases are refactored
 // from using Windows platform that has 2 versions into using Linux platform that has 1 version only.

require("./ProductionTestsUtils.js");
require("../shared/SettingsGetTestDefs.js");

gpii.loadTestingSupport();

// GET /settings tests
fluid.defaults("gpii.tests.productionConfigTesting.settingsGet.testCaseHolder", {
    gradeNames: [
        "gpii.test.cloudBased.oauth2.testCaseHolder",
        "gpii.tests.cloud.oauth2.accessTokensDeleteRequests"
    ],
    productionHostConfig: {
        hostname: gpii.tests.productionConfigTesting.cloudUrl.hostname,
        port: gpii.tests.productionConfigTesting.cloudUrl.port
    },
    distributeOptions: {
        // Override the host config to point to CBFM
        "accessTokenRequest.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that accessTokenRequest}.options"
        },
        "accessTokenRequestSettings.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that accessTokenRequest_settings}.options"
        },
        "settingsRequestNoSrVersion.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that settingsRequestNoSrVersion}.options"
        },
        "settingsRequestWithSrVersion.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that settingsRequestWithSrVersion}.options"
        },

        // Override the calculation of "device" value to simulate Linux platform
        "testCaseHolder.settingsRequestNoSrVersion": {
            record: "@expand:{that}.computeDeviceForLinux()",
            target: "{that settingsRequestNoSrVersion}.options.termMap.device"
        },
        "testCaseHolder.settingsRequestWithSrVersion": {
            record: "@expand:{that}.computeDeviceForLinux()",
            target: "{that settingsRequestWithSrVersion}.options.termMap.device"
        }
    },
    invokers: {
        computeDeviceForLinux: {
            funcName: "gpii.test.cloudBased.computeDevice",
            args: [
                [
                    "org.gnome.desktop.a11y.magnifier",
                    "org.gnome.desktop.interface",
                    "org.alsa-project"
                ],
                "linux"
            ]
        }
    }
});

gpii.tests.productionConfigTesting.settingsGet.testData = {
    expectedPreferences: {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen"
                    },
                    "http://registry.gpii.net/applications/org.gnome.desktop.interface": {
                        "cursor-size": 90,
                        "text-scaling-factor": 0.75
                    },
                    "http://registry.gpii.net/applications/org.alsa-project": {
                        "masterVolume": 50
                    }
                }
            }
        }
    },
    expectedMatchMakerOutput: {
        "inferredConfiguration": {
            "gpii-default": {
                "applications": {
                    "org.gnome.desktop.a11y.magnifier": {
                        "active": true,
                        "settings": {
                            "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
                                "mag-factor": 1.5,
                                "screen-position": "full-screen"
                            }
                        }
                    },
                    "org.gnome.desktop.interface": {
                        "active": true,
                        "settings": {
                            "http://registry.gpii.net/applications/org.gnome.desktop.interface": {
                                "cursor-size": 90,
                                "text-scaling-factor": 0.75
                            }
                        }
                    },
                    "org.alsa-project": {
                        "active": true,
                        "settings": {
                            "http://registry.gpii.net/applications/org.alsa-project": {
                                "masterVolume": 50
                            }
                        }
                    }
                }
            }
        }
    }
};

gpii.tests.productionConfigTesting.settingsGet.buildTestDefs = function (testCases, srVersionInfos) {
    var testCasesForLinux = fluid.transform(testCases, function (testCase) {
        var testCaseTogo = fluid.copy(testCase);
        var testDef = fluid.get(testCase, "testDef");
        if (testDef.username === "os_win") {
            testCaseTogo.testDef.username = "os_gnome";
            testCaseTogo.testDef.gpiiKey = "os_gnome";
            testCaseTogo.testDef.expectedPreferences = gpii.tests.productionConfigTesting.settingsGet.testData.expectedPreferences;
            testCaseTogo.testDef.expectedMatchMakerOutput = gpii.tests.productionConfigTesting.settingsGet.testData.expectedMatchMakerOutput;
        }
        return testCaseTogo;
    });
    return gpii.tests.cloud.oauth2.settingsGet.buildTestDefs(testCasesForLinux, srVersionInfos);
};

// Build test cases to test CBFM with requests using various solution registry versions. Since the current
// linux solution registry version is at verion 1, the lowest, no matter what request it is, CBFM always
// returns solutionsRegistryEntries in version 1.
gpii.tests.productionConfigTesting.settingsGet.withSrVersionTests = gpii.tests.productionConfigTesting.settingsGet.buildTestDefs(gpii.tests.cloud.oauth2.settingsGetTestsWithSrVersion, {
    "noVersion": {
        settingsRequest: "{settingsRequestNoSrVersion}"
    },
    "version1": {
        settingsRequest: "{settingsRequestWithSrVersion}",
        srVersionInRequest: 1
    },
    "version2": {
        settingsRequest: "{settingsRequestWithSrVersion}",
        srVersionInRequest: 2
    },
    // When the SR version is not provided, fall back to the lowest version
    "versionNotProvided": {
        settingsRequest: "{settingsRequestWithSrVersion}",
        srVersionInRequest: ""
    },
    // When the SR version is not an int, convert to int before proceeding
    "versionNotInt": {
        settingsRequest: "{settingsRequestWithSrVersion}",
        srVersionInRequest: "random"
    }
});

gpii.tests.productionConfigTesting.settingsGetTests = gpii.tests.productionConfigTesting.settingsGet.withSrVersionTests.concat(gpii.tests.cloud.oauth2.settingsGetTestsWithoutSrVersion);

gpii.test.cloudBased.oauth2.clearAccessTokenCache();

gpii.test.cloudBased.oauth2.runDisruptedTests(
    gpii.tests.productionConfigTesting.settingsGetTests,
    gpii.tests.productionConfigTesting.config,
    "gpii.test.serverEnvironment",
    "gpii.tests.productionConfigTesting.settingsGet.testCaseHolder"
);
