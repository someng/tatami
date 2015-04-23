module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // You can set arbitrary key-value pairs.
        // You can also set the value of a key as parsed JSON.
        // Allows us to reference properties we declared in package.json.

        pkg: grunt.file.readJSON('package.json'),
        // Grunt tasks are associated with specific properties.
        // these names generally match their npm package name.

        uglify: {
           js: {
               compress: true,
               mangle: true,
               sourceMap: true,
               sourceMapIncludeSources: true,
               src: ['src/main/webapp/app/**/*.js', '!**/*.min.js'],
               dest: 'src/main/webapp/<%= pkg.name %>.min.js'
           }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};