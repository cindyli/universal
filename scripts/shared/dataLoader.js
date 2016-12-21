/*!
Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// The underlying data loader implementation shared by ../authDataLoader.js and ../prefsDataLoader.js
// to load GPII test data into CouchDB.
// Steps to load data:
// 1. Check the existence of the database;
// 2. If the database already exists, delete and recreate the database to ensure a clean data load; otherwise, create the database;
// 3. Load data in bulk using CouchDB /_bulk_docs request - http://docs.couchdb.org/en/2.0.0/api/database/bulk-api.html#db-bulk-docs

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    gpii = fluid.registerNamespace("gpii");

var fs = require("fs");

// Data Source used to interact with CouchDB
fluid.defaults("gpii.dataLoader.dataSource", {
    gradeNames: ["kettle.dataSource.URL"],
    readOnlyGrade: "gpii.dataLoader.dataSource",
    termMap: {
        couchDbUrl: "noencode:%couchDbUrl",
        dbName: "%dbName"
    }
});

fluid.defaults("gpii.dataLoader.dataSource.writable", {
    gradeNames: ["gpii.dataLoader.dataSource", "kettle.dataSource.URL.writable"],
    writable: true
});

// Data loader
fluid.defaults("gpii.dataLoader", {
    gradeNames: ["fluid.component"],
    // Accepted format:
    // dbName1: {
    //     data: ["pathToDataFile1", "pathToDataFile1"...]
    // },
    // dbName2: {
    //     data: ["pathToDataFile1", "pathToDataFile1"...]
    // }
    databases: {  // Supplied by integrators
    },
    couchDbUrl: null,   // Supplied by integrators
    components: {
        getDbDataSource: {
            type: "gpii.dataLoader.dataSource",
            options: {
                url: "%couchDbUrl/%dbName"
            }
        },
        deleteDbDataSource: {
            type: "gpii.dataLoader.dataSource",
            options: {
                url: "%couchDbUrl/%dbName",
                method: "DELETE"
            }
        },
        createDbDataSource: {
            type: "gpii.dataLoader.dataSource",
            options: {
                url: "%couchDbUrl/%dbName",
                method: "PUT"
            }
        },
        loadDataSource: {
            type: "gpii.dataLoader.dataSource.writable",
            options: {
                url: "%couchDbUrl/%dbName/_bulk_docs",
                writeMethod: "POST"
            }
        }
    },
    invokers: {
        load: {
            funcName: "gpii.dataLoader.load",
            args: ["{that}"]
        }
    }
});

gpii.dataLoader.load = function (that) {
    var promiseTogo = fluid.promise();
    var loadDataPromises = [];

    // Process databases one by one
    fluid.each(that.options.databases, function (dbData, dbName) {
        var directModel = {
            couchDbUrl: that.options.couchDbUrl,
            dbName: dbName
        };

        // Delete the database if it already exists
        var prepareDbPromise = gpii.dataLoader.prepareDB(that, directModel);

        prepareDbPromise.then(function () {
            // load data files
            var dataFilePaths = fluid.makeArray(dbData.dataFile);
            fluid.each(dataFilePaths, function (oneDataFile) {
                loadDataPromises.push(gpii.dataLoader.loadDataFile(that.loadDataSource, oneDataFile, directModel));
            });

            // load direct data
            loadDataPromises.push(gpii.dataLoader.loadData(that.loadDataSource, dbData.data, directModel));

            var loadDataPromise = fluid.promise.sequence(loadDataPromises);
            fluid.promise.follow(loadDataPromise, promiseTogo);
        });
    });

    return promiseTogo;
};

gpii.dataLoader.createDb = function (that, directModel) {
    return that.createDbDataSource.get(directModel);
};

// If the database already exists, delete and recreate; otherwise, create the database.
gpii.dataLoader.prepareDB = function (that, directModel) {
    var promiseTogo = fluid.promise();
    var getDbPromise = that.getDbDataSource.get(directModel);

    getDbPromise.then(function () {
        // The database already exists, delete and recreate to ensure a clean database for loading data
        var deleteDbPromise = that.deleteDbDataSource.get(directModel);
        deleteDbPromise.then(function () {
            var createDbPromise = gpii.dataLoader.createDb(that, directModel);
            fluid.promise.follow(createDbPromise, promiseTogo);
        });
    }, function () {
        // The database does not exist, create it
        var createDbPromise = gpii.dataLoader.createDb(that, directModel);
        fluid.promise.follow(createDbPromise, promiseTogo);
    });

    return promiseTogo;
};

gpii.dataLoader.loadData = function (loadDataSource, data, directModel) {
    if (!data) {
        return fluid.promise();
    }

    // Convert to couchDB accepted doc format for using /_bulk_docs end point
    var data = {
        "docs": data
    };

    console.log("data: ", data.docs[0].condTest);
    fs.writeFileSync(__dirname + "/debug.log", data, "utf-8");
    return loadDataSource.set(directModel, data);
};

gpii.dataLoader.loadDataFile = function (loadDataSource, dataFile, directModel) {
    var actualPath = fluid.module.resolvePath(dataFile);
    var data = require(actualPath);

    return gpii.dataLoader.loadData(loadDataSource, data, directModel);
};
