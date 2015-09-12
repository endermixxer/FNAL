module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 3000,
                    open: {
                        target: 'http://localhost:3000'
                    },
                    keepalive: true
                }
            }
        }
    });

    grunt.registerTask('default', ['connect']);

}
