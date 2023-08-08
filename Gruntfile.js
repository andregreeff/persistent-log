module.exports = function(grunt) {
  var srcFiles = ["Gruntfile.js", "karma.conf.js", "./lib/**/*.js", "./specs/**/*.js"];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    jshint: {
      build: {
        src: srcFiles,
      },
      dev: {
        src: srcFiles,
        options: {
          force: true,
        },
      },
    },

    browserify: {
      browser: {
        files: {
          "./dist/storage-logger.js": ["./browser.js"],
        },
      },
    },

    karma: {
      build: {
        options: {
          configFile: "karma.conf.js",
          singleRun: true,
        },
      },
      dev: {
        options: {
          configFile: "karma.conf.js",
          background: true,
          autoWatch: false,
        },
      },
    },

    watch: {
      dev: {
        files: srcFiles,
        tasks: ["jshint:dev", "browserify", "karma:dev:run"],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Load grunt plugins
  require("load-grunt-tasks")(grunt);

  grunt.registerTask("default", ["jshint:build", "browserify", "karma:build"]);
  grunt.registerTask("dev", ["karma:dev", "watch:dev"]);
};
