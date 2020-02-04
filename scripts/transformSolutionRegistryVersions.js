/*!
Copyright 2020 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script reads solution registry files (referred as SR below) from the given solution registry directory,
// finds the current version for each solution registry from metadata.json5 in the same directory. If the current
// version is greater than 1, this script creates subdirectories in the solution registry directory, one for each
// historical SR format, which contain replicas of the most recent SR transformed into all historical formats.

// Usage: node scripts/transformSolutionRegistryVersions.js {solution_registry_directory}

// A sample command that runs this script in the universal root directory:
// node scripts/transformSolutionRegistryVersions.js testData/solutions/

"use strict";

var fs = require("fs"),
    rimraf = require("rimraf"),
    JSON5 = require("json5"),
    fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("../gpii/node_modules/solutionsRegistry/src/js/transformSolutionVersions.js");

var srDir = process.argv[2];

if (process.argv.length < 2) {
    console.log("Usage: node scripts/transformSolutionRegistryVersions.js SolutionRegistryFolder");
    process.exit(1);
}

console.log("Converting solutions registry in the Solution Registry directory " + srDir + " to historical versions, each in a subdirectory...");

// Read metadata for solution registries
var metadata = JSON5.parse(fs.readFileSync(srDir + "metadata.json5"));

// Read all files from the input directory
var filenames = fs.readdirSync(srDir);

// Remove subdirectories that hold previously transformed solution registries
filenames.forEach(function (filename) {
    var isOldSubdir = filename.match(/V[0-9]+/);
    if (isOldSubdir) {
        rimraf.sync(srDir + filename);
    }
});

// Loop thru SR files in the input directory and transform them if the current version > 1
filenames.forEach(function (filename) {
    if (filename.endsWith(".json5") && filename !== "metadata.json5") {
        var platform = filename.substr(0, filename.indexOf("."));
        var currentVersion = metadata[platform].encodingVersion;
        if (currentVersion > 1) {
            console.log("Processing " + filename + " whose current version is " + currentVersion);
            var srContent = JSON5.parse(fs.readFileSync(srDir + filename));
            // Loop from higher to lower versions to create all historical SRs for this particular SR
            for (var i = currentVersion - 1; i >= 1; i--) {
                var subDir = srDir + "V" + i;

                // Create the subdirectory if it doen't exist
                if (!fs.existsSync(subDir)) {
                    fs.mkdirSync(subDir);
                    console.log("Created version " + i + " subdirectory: ", subDir);
                }
                var transformed = gpii.solutionsRegistry.transformSolutionsBtwVersions(srContent, currentVersion, i);

                var targetFile = subDir + "/" + filename;
                fs.writeFileSync(targetFile, JSON.stringify(transformed, null, 4));
                // Append a new line at the end of the created file so the linting doesn't complain
                fs.appendFileSync(targetFile, "\n");
                console.log("Transformed " + filename + " to version " + i);
            }
            console.log("Finished processing " + filename);
        }
    }
});

console.log("Finished transforming ALL Solution Registry files");
