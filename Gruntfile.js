module.exports = function(grunt) {
    "use strict"

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        copy: {
            imgs: {
                expand: true,
                src: ["css/icons.png", "css/icons-2x.png"],
                dest: "dist/"
            }
        },

        concat: {
            options: {
                separator: "\n"
            },
            js: {
                src: [
                    "src/jsgrid.core.js",
                    "src/jsgrid.load-indicator.js",
                    "src/jsgrid.load-strategies.js",
                    "src/jsgrid.sort-strategies.js",
                    "src/jsgrid.field.js",
                    "src/jsgrid.field.text.js",
                    "src/jsgrid.field.number.js",
                    "src/jsgrid.field.textarea.js",
                    "src/jsgrid.field.select.js",
                    "src/jsgrid.field.checkbox.js",
                    "src/jsgrid.field.control.js"
                ],
                dest: "dist/<%= pkg.name %>.js"
            },
            css: {
                src: [
                    "css/jsgrid.css",
                    "css/theme.css"
                ],
                dest: "dist/css/<%= pkg.name %>.css"
            }
        },

        uglify: {
            options: {
                banner: "/* <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */"
            },
            build: {
                src: "<%= concat.js.dest %>",
                dest: "dist/<%= pkg.name %>.min.js"
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["copy", "concat", "uglify"]);
};