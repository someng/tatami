module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // You can set arbitrary key-value pairs.

        // You can also set the value of a key as parsed JSON.
        // Allows us to reference properties we declared in package.json.
        pkg: grunt.file.readJSON('package.json'),
        // Grunt tasks are associated with specific properties.
        // these names generally match their npm package name.
        concat: {
            // Specify some options, usually specific to each plugin.
            options: {
                // Specifies string to be inserted between concatenated files.
                separator: '\n'
            },
            // 'dist' is what is called a "target."
            // It's a way of specifying different sub-tasks or modes.
            dist: {
                // The files to concatenate:
                // Notice the wildcard, which is automatically expanded.
                src: ['src/**/*.js'],
                // The destination file:
                // Notice the angle-bracketed ERB-like templating,
                // which allows you to reference other properties.
                // This is equivalent to 'dist/main.js'.
                dest: '/main.js'
                // You can reference any grunt config property you want.
                // Ex: '<%= concat.options.separator %>' instead of ';'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat']);

};