module.exports = function(grunt) {
    "use strict"

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        concat: {
            options: {
                separator: "\n"
            },
            dist: {
                src: [
                    "src/jsgrid.core.js",
                    "src/jsgrid.load-strategies.js",
                    "src/jsgrid.sort-strategies.js",
                    "src/jsgrid.field.js",
                    "src/jsgrid.field.text.js",
                    "src/jsgrid.field.textarea.js",
                    "src/jsgrid.field.select.js",
                    "src/jsgrid.field.checkbox.js",
                    "src/jsgrid.field.control.js"
                ],
                dest: "dist/<%= pkg.name %>.js"
            }
        },

        uglify: {
            options: {
                banner: "/* <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */"
            },
            build: {
                src: "<%= concat.dist.dest %>",
                dest: "dist/<%= pkg.name %>.min.js"
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["concat", "uglify"]);
};