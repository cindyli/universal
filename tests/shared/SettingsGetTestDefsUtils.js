/*
 * GPII Flow Manager Get/Put shared est Definitions
 *
 * Copyright 2020 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsGet");

// Define http requests used for testing GET /settings endpoint
fluid.defaults("gpii.tests.cloud.oauth2.settingsGet.requests", {
    gradeNames: ["fluid.component"],
    components: {
        accessTokenRequest_settings: {
            type: "kettle.test.request.http",
            options: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                path: "/access_token",
                method: "POST"
            }
        },
        settingsRequestNoSrVersion: {
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/settings/%device",
                termMap: {
                    gpiiKey: "{testCaseHolder}.options.gpiiKey",
                    device: "@expand:{gpii.tests.cloud.oauth2.settingsGet.requests}.computeDevice()"
                }
            }
        },
        settingsRequestWithSrVersion: {
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/settings/%device?srVersion=%srVersion",
                termMap: {
                    gpiiKey: "{testCaseHolder}.options.gpiiKey",
                    device: "@expand:{gpii.tests.cloud.oauth2.settingsGet.requests}.computeDevice()",
                    srVersion: "{testCaseHolder}.options.srVersionInRequest"
                }
            }
        }
    },
    invokers: {
        computeDevice: {
            funcName: "gpii.test.cloudBased.computeDevice",
            args: [
                [
                    "com.microsoft.windows.mouseTrailing",
                    "com.microsoft.windows.mouseKeys",
                    "com.microsoft.windows.stickyKeys"
                ],
                "win32"
            ]
        }
    }
});

// Test data
gpii.tests.cloud.oauth2.settingsGet.testData = {
    expectedPreferences: {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/applications/com.microsoft.windows.mouseTrailing": {
                        "MouseTrails": {
                            "value": 10
                        }
                    },
                    "http://registry.gpii.net/applications/com.microsoft.windows.mouseKeys": {
                        "MouseKeysOn": {
                            "value": true
                        },
                        "MaxSpeed": {
                            "value": 100
                        },
                        "Acceleration": {
                            "value": 1000
                        }
                    },
                    "http://registry.gpii.net/applications/com.microsoft.windows.stickyKeys": {
                        "StickyKeysOn": {
                            "value": true
                        }
                    }
                }
            }
        }
    },
    expectedMatchMakerOutput: {
        "inferredConfiguration": {
            "gpii-default": {
                "applications": {
                    "com.microsoft.windows.mouseKeys": {
                        "active": true,
                        "settings": {
                            "http://registry.gpii.net/applications/com.microsoft.windows.mouseKeys": {
                                "MouseKeysOn": {
                                    "value": true
                                },
                                "MaxSpeed": {
                                    "value": 100
                                },
                                "Acceleration": {
                                    "value": 1000
                                }
                            }
                        }
                    },
                    "com.microsoft.windows.mouseTrailing": {
                        "active": true,
                        "settings": {
                            "http://registry.gpii.net/applications/com.microsoft.windows.mouseTrailing": {
                                "MouseTrails": {
                                    "value": 10
                                }
                            }
                        }
                    },
                    "com.microsoft.windows.stickyKeys": {
                        "active": true,
                        "settings": {
                            "http://registry.gpii.net/applications/com.microsoft.windows.stickyKeys": {
                                "StickyKeysOn": {
                                    "value": true
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    stickyKeysSettingsHandlers: {
        version1: {
            "configure": {
                "type": "gpii.windows.spiSettingsHandler",
                "liveness": "live",
                "options": {
                    "getAction": "SPI_GETSTICKYKEYS",
                    "setAction": "SPI_SETSTICKYKEYS",
                    "uiParam": "struct_size",
                    "pvParam": {
                        "type": "struct",
                        "name": "STICKYKEYS"
                    }
                },
                "supportedSettings": {
                    "StickyKeysOn": {
                        "schema": {
                            "title": "Sticky Keys On",
                            "description": "Whether or not sticky keys should be turned on.",
                            "properties": {
                                "path": {
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "object",
                                            "properties": {
                                                "get": {
                                                    "type": "string",
                                                    "required": true
                                                },
                                                "set": {
                                                    "type": "string",
                                                    "required": true
                                                }
                                            }
                                        }
                                    ],
                                    "required": true
                                },
                                "value": {
                                    "type": "boolean",
                                    "required": true
                                }
                            }
                        }
                    }
                },
                "capabilitiesTransformations": {
                    "StickyKeysOn": {
                        "value": "http://registry\\.gpii\\.net/common/stickyKeys",
                        "path": {
                            "literalValue": "pvParam.dwFlags.SKF_STICKYKEYSON"
                        }
                    }
                },
                "inverseCapabilitiesTransformations": {
                    "http://registry\\.gpii\\.net/common/stickyKeys": "StickyKeysOn.value"
                }
            }
        },
        version2: {
            "configure": {
                "type": "gpii.windows.spiSettingsHandler",
                "liveness": "live",
                "options": {
                    "getAction": "SPI_GETSTICKYKEYS",
                    "setAction": "SPI_SETSTICKYKEYS",
                    "uiParam": "struct_size",
                    "pvParam": {
                        "type": "struct",
                        "name": "STICKYKEYS"
                    }
                },
                "supportedSettings": {
                    "StickyKeysOn": {
                        // TODO: Make a general pattern for SPI settings.
                        schema: {
                            "title": "Sticky Keys On",
                            "description": "Whether or not sticky keys should be turned on.",
                            "properties": {
                                "path": {
                                    oneOf: [
                                        { "type":  "string"},
                                        {
                                            "type":  "object",
                                            "properties": {
                                                "get": { "type":  "string", "required": true },
                                                "set": { "type":  "string", "required": true }
                                            }
                                        }
                                    ],
                                    "required": true
                                },
                                "value": { "type":  "boolean", "required":  true}
                            }
                        },
                        "path": "pvParam.dwFlags.SKF_STICKYKEYSON"
                    }
                },
                "capabilitiesTransformations": {
                    "StickyKeysOn": {
                        "value": "http://registry\\.gpii\\.net/common/stickyKeys"
                    }
                },
                "inverseCapabilitiesTransformations": {
                    "http://registry\\.gpii\\.net/common/stickyKeys": "StickyKeysOn.value"
                }
            }
        }
    }
};
