module.exports = function(grunt) {
    "use strict"

    var banner =
        "/*!\n" +
        " * jsGrid v<%= pkg.version %> (<%= pkg.homepage %>)\n" +
        " * (c) 2014-<%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
        " * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n" +
        " */\n";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        copy: {
            imgs: {
                expand: true,
                cwd: "css/",
                src: "*.png",
                dest: "dist/"
            }
        },

        concat: {
            options: {
                separator: "\n"
            },
            js: {
                options : {
                    banner: banner + "\n"
                },
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
                options : {
                    banner: banner + "\n"
                },
                src: [
                    "css/jsgrid.css",
                    "css/theme.css"
                ],
                dest: "dist/<%= pkg.name %>.css"
            }
        },

        imageEmbed: {
            dist: {
                src: "<%= concat.css.dest %>",
                dest: "<%= concat.css.dest %>"
            },
            options: {
                deleteAfterEncoding : true
            }
        },

        uglify: {
            options : {
                banner: banner + "\n"
            },
            build: {
                src: "<%= concat.js.dest %>",
                dest: "dist/<%= pkg.name %>.min.js"
            }
        },

        cssmin: {
            options : {
                banner: banner
            },
            build: {
                src: "<%= concat.css.dest %>",
                dest: "dist/jsgrid.min.css"
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-image-embed");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    grunt.registerTask("default", ["copy", "concat", "imageEmbed", "uglify", "cssmin"]);
};