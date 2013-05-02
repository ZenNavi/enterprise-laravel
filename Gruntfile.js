module.exports = function (grunt) {
    grunt.initConfig({

        meta: {
            src: "public/js/application.js",
            dist: "public/js/application.min.js"
        },

        // file watcher
        regarde: {

            // watch the JS files specified, then run concat on the client javascript files, and trigger live reload
            js: {
                files: ["client/js/**/*"],
                spawn: false,
                tasks: ['concat', 'livereload']
            },

            // watch the scss files, run the dev compass option, then trigger live reload
            css: {
                files: ["client/scss/**/*.scss"],
                events: true,
                spawn: false,
                tasks: ['compass:dev', 'livereload']
            },

            // watch the server files
            server: {
                files: ["app/views/**/*","app/models/**/*","app/controllers/**/*","app/routes.php"],
                events: true,
                spawn: false,
                tasks: ['livereload']
            }
        },
        compass: {                  // Task
            dist: {                   // Target
                options: {              // Target options
                    sassDir: 'client/scss',
                    cssDir: 'public/css',
                    environment: 'production'
                }
            },
            dev: {                    // Another target
                options: {
                    sassDir: 'client/sass',
                    cssDir: 'public/css',
					environment: 'development'
                }
            }
        },
        files: {
            vendor: [
                    'client/components/jquery/jquery.js'
                    ]
        },
        uglify: {
            production: {
                options: {
                    beautify: true,
                    sourceMap: 'public/js/source-map.js',
                    sourceMapRoot: 'public/js/',
                    sourceMapIn: 'public/js/source-map.js'
                },
                files: {
                    "<%= meta.dist %>": "<%= meta.src %>"
                }
            }
        },
        shell: {
            startServer: {
                command: 'php artisan serve',
                options: {
                    stdout: true
                }
            }
        },
        // the compass scss processor settings
        // both are set to force: true to actually do the compile and not wait for a file change
        compass: {
            // production settings using config.rb
            dist: {
                options: {
                    config: 'config.rb'
                } ,
                force: true
            },

            //dev settings using config-dev.rb which has verbose expanded output
            dev: {
                options: {
                    config: 'config.rb' //Not using it right now
                },
                force: true
            }
        },
        // task to concat the files from files.src above into the scripts.js file
        concat: {
            "<%= meta.src %>": ["<%= files.vendor %>"]
        }
    });
    // load the task plugins required
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');

    // run the server and get live reload going, though a plugin is still needed in the browser
    grunt.registerTask("server", ["livereload-start", "regarde"]);

    // the default task for development which processes all scss files, creates the scripts.js file
    grunt.registerTask("default", ["compass:dev", "concat","server"]);
};