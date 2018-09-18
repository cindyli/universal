/**
Shared GPII PSP Integration Test definitions

Copyright 2014, 2017 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/
"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.logObjectRenderChars = 1024000;

fluid.registerNamespace("gpii.tests.pspIntegration");
fluid.require("%gpii-universal");
gpii.loadTestingSupport();

fluid.defaults("gpii.tests.pspIntegration.environmentChangedRequestType", {
    gradeNames: "kettle.test.request.http",
    path: "/environmentChanged",
    method: "PUT"
});

fluid.defaults("gpii.tests.pspIntegration.client", {
    gradeNames: "kettle.test.request.ws",
    path: "/pspChannel",
    port: 8081
});

gpii.tests.pspIntegration.sendMsg = function (client, path, value) {
    client.send({
        path: path,
        value: value,
        type: "ADD"
    });
};

gpii.tests.pspIntegration.sendContextChange = function (client, newContext) {
    gpii.tests.pspIntegration.sendMsg(client, ["activeContextName"], newContext);
};

gpii.tests.pspIntegration.checkPayload = function (data, expectedType) {
    jqUnit.assertEquals("Checking message from PSP: ", expectedType, data.type);
};

gpii.tests.pspIntegration.connectionSucceeded = function (data) {
    jqUnit.assertValue("Connection between client and server can be established", data);
};

gpii.tests.pspIntegration.data = {
    initial: {
        "settingsHandlers": {
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Magnification": 150
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }]
            },
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.cursors": [{ // cursor size stuff
                    "settings": {
                        "No": "%SystemRoot%\\cursors\\aero_unavail_xl.cur",
                        "Hand": "%SystemRoot%\\cursors\\aero_link_xl.cur",
                        "Help": "%SystemRoot%\\cursors\\aero_helpsel_xl.cur",
                        "Wait": "%SystemRoot%\\cursors\\aero_busy_xl.ani",
                        "Arrow": "%SystemRoot%\\cursors\\aero_arrow_xl.cur",
                        "NWPen": "%SystemRoot%\\cursors\\aero_pen_xl.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\aero_ns_xl.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\aero_ew_xl.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\aero_move_xl.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\aero_up_xl.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\aero_nesw_xl.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\aero_nwse_xl.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\aero_working_xl.ani"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Cursors",
                        "dataTypes": {
                            "Arrow": "REG_SZ",
                            "Hand": "REG_SZ",
                            "Help": "REG_SZ",
                            "AppStarting": "REG_SZ",
                            "No": "REG_SZ",
                            "NWPen": "REG_SZ",
                            "SizeAll": "REG_SZ",
                            "SizeNESW": "REG_SZ",
                            "SizeNS": "REG_SZ",
                            "SizeNWSE": "REG_SZ",
                            "SizeWE": "REG_SZ",
                            "UpArrow": "REG_SZ",
                            "Wait": "REG_SZ"
                        }
                    }
                }]
            }
        }
    },
    afterChange1: {
        "settingsHandlers": {
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Magnification": 300
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }]
            },
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.cursors": [{ // cursor size stuff
                    "settings": {
                        "No": "%SystemRoot%\\cursors\\aero_unavail_xl.cur",
                        "Hand": "%SystemRoot%\\cursors\\aero_link_xl.cur",
                        "Help": "%SystemRoot%\\cursors\\aero_helpsel_xl.cur",
                        "Wait": "%SystemRoot%\\cursors\\aero_busy_xl.ani",
                        "Arrow": "%SystemRoot%\\cursors\\aero_arrow_xl.cur",
                        "NWPen": "%SystemRoot%\\cursors\\aero_pen_xl.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\aero_ns_xl.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\aero_ew_xl.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\aero_move_xl.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\aero_up_xl.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\aero_nesw_xl.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\aero_nwse_xl.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\aero_working_xl.ani"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Cursors",
                        "dataTypes": {
                            "Arrow": "REG_SZ",
                            "Hand": "REG_SZ",
                            "Help": "REG_SZ",
                            "AppStarting": "REG_SZ",
                            "No": "REG_SZ",
                            "NWPen": "REG_SZ",
                            "SizeAll": "REG_SZ",
                            "SizeNESW": "REG_SZ",
                            "SizeNS": "REG_SZ",
                            "SizeNWSE": "REG_SZ",
                            "SizeWE": "REG_SZ",
                            "UpArrow": "REG_SZ",
                            "Wait": "REG_SZ"
                        }
                    }
                }]
            }
        }
    },
    afterChange2: {
        "settingsHandlers": {
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Magnification": 300
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }]
            }
        }
    },
    bright: {
        "settingsHandlers": {
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Magnification": 200
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }]
            }
        }
    }
};

gpii.tests.pspIntegration.testDefs = [
    {
        name: "Simple settings change by PSP",
        expect: 8,
        sequence: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onSnapshotComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{pspClient}.connect"
                }, {
                    event: "{pspClient}.events.onConnect",
                    listener: "gpii.tests.pspIntegration.connectionSucceeded"
                }, {
                    event: "{pspClient}.events.onReceiveMessage",
                    listener: "gpii.tests.pspIntegration.checkPayload",
                    args: ["{arguments}.0", "modelChanged"]
                }, {
                    funcName: "gpii.tests.pspIntegration.sendMsg",
                    args: [ "{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
                }, {
                    event: "{pspClient}.events.onReceiveMessage",
                    listener: "gpii.tests.pspIntegration.checkPayload",
                    args: ["{arguments}.0", "preferencesApplied"]
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    // }, {
    //     name: "Settings change by PSP with scoped common term",
    //     expect: 9,
    //     sequence: [
    //         [
    //             {
    //                 func: "gpii.test.expandSettings",
    //                 args: [ "{tests}", [ "contexts" ]]
    //             }, {
    //                 func: "gpii.test.snapshotSettings",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onSnapshotComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{loginRequest}.send"
    //             }, {
    //                 event: "{loginRequest}.events.onComplete",
    //                 listener: "gpii.test.loginRequestListen"
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{pspClient}.connect"
    //             }, {
    //                 event: "{pspClient}.events.onConnect",
    //                 listener: "gpii.tests.pspIntegration.connectionSucceeded"
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 funcName: "gpii.tests.pspIntegration.sendMsg",
    //                 args: [ "{pspClient}", [ "preferences","http://registry\\.gpii\\.net/applications/com\\.microsoft\\.windows\\.magnifier.http://registry\\.gpii\\.net/common/magnification"], 3]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "preferencesApplied"]
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{logoutRequest}.send"
    //             }, {
    //                 event: "{logoutRequest}.events.onComplete",
    //                 listener: "gpii.test.logoutRequestListen"
    //             }, {
    //                 func: "gpii.test.checkRestoredConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }
    //         ]
    //     ]
    // }, {
    //     name: "Sequential setting changes by the PSP",
    //     expect: 10,
    //     sequence: [
    //         [
    //             {
    //                 func: "gpii.test.expandSettings",
    //                 args: [ "{tests}", [ "contexts" ]]
    //             }, {
    //                 func: "gpii.test.snapshotSettings",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onSnapshotComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{loginRequest}.send"
    //             }, {
    //                 event: "{loginRequest}.events.onComplete",
    //                 listener: "gpii.test.loginRequestListen"
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{pspClient}.connect"
    //             }, {
    //                 event: "{pspClient}.events.onConnect",
    //                 listener: "gpii.tests.pspIntegration.connectionSucceeded"
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 funcName: "gpii.tests.pspIntegration.sendMsg",
    //                 args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "preferencesApplied"]
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 funcName: "gpii.tests.pspIntegration.sendMsg",
    //                 args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/volume"], 0.75]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "preferencesApplied"]
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.afterChange2.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{logoutRequest}.send"
    //             }, {
    //                 event: "{logoutRequest}.events.onComplete",
    //                 listener: "gpii.test.logoutRequestListen"
    //             }, {
    //                 func: "gpii.test.checkRestoredConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }
    //         ]
    //     ]
    // }, {
    //     name: "Context change via the PSP",
    //     expect: 8,
    //     sequence: [
    //         [
    //             {
    //                 func: "gpii.test.expandSettings",
    //                 args: [ "{tests}", [ "contexts" ]]
    //             }, {
    //                 func: "gpii.test.snapshotSettings",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onSnapshotComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{loginRequest}.send"
    //             }, {
    //                 event: "{loginRequest}.events.onComplete",
    //                 listener: "gpii.test.loginRequestListen"
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{pspClient}.connect"
    //             }, {
    //                 event: "{pspClient}.events.onConnect",
    //                 listener: "gpii.tests.pspIntegration.connectionSucceeded"
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 funcName: "gpii.tests.pspIntegration.sendContextChange",
    //                 args: ["{pspClient}", "bright"]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.bright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{logoutRequest}.send"
    //             }, {
    //                 event: "{logoutRequest}.events.onComplete",
    //                 listener: "gpii.test.logoutRequestListen"
    //             }, {
    //                 func: "gpii.test.checkRestoredConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }
    //         ]
    //     ]
    // }, {
    //     name: "Settings change from PSP followed by context change via the PSP (new context should be applied)",
    //     expect: 10,
    //     sequence: [
    //         [
    //             {
    //                 func: "gpii.test.expandSettings",
    //                 args: [ "{tests}", [ "contexts" ]]
    //             }, {
    //                 func: "gpii.test.snapshotSettings",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onSnapshotComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{loginRequest}.send"
    //             }, {
    //                 event: "{loginRequest}.events.onComplete",
    //                 listener: "gpii.test.loginRequestListen"
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{pspClient}.connect"
    //             }, {
    //                 event: "{pspClient}.events.onConnect",
    //                 listener: "gpii.tests.pspIntegration.connectionSucceeded"
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 funcName: "gpii.tests.pspIntegration.sendMsg",
    //                 args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "preferencesApplied"]
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 funcName: "gpii.tests.pspIntegration.sendContextChange",
    //                 args: ["{pspClient}", "bright"]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.bright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{logoutRequest}.send"
    //             }, {
    //                 event: "{logoutRequest}.events.onComplete",
    //                 listener: "gpii.test.logoutRequestListen"
    //             }, {
    //                 func: "gpii.test.checkRestoredConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }
    //         ]
    //     ]
    // }, {
    //     // This test checks that the manually changed context from the user is not overridden
    //     // by a context change triggered by changes in the environment
    //     name: "Manual context change via the PSP followed by a change in environment",
    //     expect: 11,
    //     sequence: [
    //         [
    //             {
    //                 func: "gpii.test.expandSettings",
    //                 args: [ "{tests}", [ "contexts" ]]
    //             }, {
    //                 func: "gpii.test.snapshotSettings",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onSnapshotComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{loginRequest}.send"
    //             }, {
    //                 event: "{loginRequest}.events.onComplete",
    //                 listener: "gpii.test.loginRequestListen"
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{pspClient}.connect"
    //             }, {
    //                 event: "{pspClient}.events.onConnect",
    //                 listener: "gpii.tests.pspIntegration.connectionSucceeded"
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 funcName: "gpii.tests.pspIntegration.sendMsg",
    //                 args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "preferencesApplied"]
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 funcName: "gpii.tests.pspIntegration.sendContextChange",
    //                 args: ["{pspClient}", "bright"]
    //             }, {
    //                 event: "{pspClient}.events.onReceiveMessage",
    //                 listener: "gpii.tests.pspIntegration.checkPayload",
    //                 args: ["{arguments}.0", "modelChanged"]
    //             }, {
    //                 func: "gpii.test.checkConfiguration",
    //                 args: ["{tests}.options.data.bright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{environmentChangedRequest}.send", // change the environment to match "noise context"
    //                 args: { "http://registry.gpii.net/common/environment/auditory.noise": 30000 }
    //             }, {
    //                 event: "{environmentChangedRequest}.events.onComplete"
    //             }, {
    //                 func: "gpii.test.checkConfiguration", // should still be bright since manual overrides automatic context
    //                 args: ["{tests}.options.data.bright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }, {
    //                 func: "{logoutRequest}.send"
    //             }, {
    //                 event: "{logoutRequest}.events.onComplete",
    //                 listener: "gpii.test.logoutRequestListen"
    //             }, {
    //                 func: "gpii.test.checkRestoredConfiguration",
    //                 args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
    //             }, {
    //                 event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
    //                 listener: "fluid.identity"
    //             }
    //         ]
    //     ]
    }
];

fluid.defaults("gpii.tests.pspIntegration.testCaseHolder.common.windows", {
    gradeNames: [
        "gpii.test.integration.testCaseHolder.windows"
    ],
    components: {
        pspClient: {
            type: "gpii.tests.pspIntegration.client"
        },
        environmentChangedRequest: {
            type: "gpii.tests.pspIntegration.environmentChangedRequestType"
        }
    },
    gpiiKey: "context2",
    data: gpii.tests.pspIntegration.data
});
