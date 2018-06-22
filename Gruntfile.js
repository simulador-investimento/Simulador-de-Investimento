module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                },
                files: {
                    "dist/css/bootstrap.min.css": "src/bootstrap.less"
                }
            }
        },
        copy: {
            main: {
                files: [{
                        expand: true,
                        cwd: 'src',
                        src: 'script.js',
                        dest: 'dist/js',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jquery-mask-plugin/dist',
                        src: 'jquery.mask.min.js',
                        dest: 'dist/js',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/js',
                        src: 'bootstrap.min.js',
                        dest: 'dist/js',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/fonts',
                        src: '**',
                        dest: 'dist/fonts',
                        filter: 'isFile'
                    },
                ]
            }
        },
        watch: {
            styles: {
                files: ['src/**/*.css'],
                tasks: ['less', 'copy'],
                options: {
                    nospawn: true
                }
            },
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['less', 'copy'],
                options: {
                    nospawn: true
                }
            }
        },

    });

    grunt.registerTask('default', ['less', 'copy', 'watch']);
};