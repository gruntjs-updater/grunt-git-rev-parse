/*
 * grunt-git-describe
 * https://github.com/ika18/grunt-git-rev-parse
 *
 * Copyright (c) 2013 Ika Wu
 * Licensed under the Apache 2 license.
 */


 "use strict";

module.exports = function (grunt) {
    var CWD = "cwd";
    var PROP = "prop";
    var NUM = "number";
    var REV = "rev";
    var SILENT = "silent";
    
    grunt.registerMultiTask("git-rev-parse", "Get git revision id", function (prop, cwd) {
        // Start async task
        var done = this.async();

        // Define default options
        var options = {};
        options[CWD] = ".";
        options[NUM] = 6;
        options[REV] = "HEAD";
        options[SILENT] = false;
    
        // Load cli options (with defaults)
        options = this.options(options);

        // Override options
        options[PROP] = prop || options[PROP];
        options[CWD] = cwd || options[CWD];
        options[NUM] = grunt.option(NUM) || options[NUM];
        options[REV] = grunt.option(REV) || options[REV];
        options[SILENT] = grunt.option(SILENT) || options[SILENT];

        // Log flags (if verbose)
        grunt.log.verbose.writeflags(options);

        // Spawn git
        grunt.util.spawn({
            "cmd" : "git",
            "args" : [ "rev-parse", "--verify", "--short=" +  options[NUM], options[REV]],
            "opts" : {
                "cwd" : options[CWD]
            }
        }, function (err, result) {
            // If an error occurred...
            if (err) {
                // Log the problem and let grunt continue
                grunt.log.error(err,result);
                done();
                return;
            }

            // Convert result to string
            result = String(result);

            // Output
            if (!options[SILENT] || grunt.log.verbose) {
                grunt.log.ok(result);
            }

            // If we were passed a prop we should update
            if (options[PROP]) {
                grunt.config(options[PROP], result);
            }
            
            // Done with result
            done();
        });
    });
};
