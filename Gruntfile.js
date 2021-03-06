'use strict';

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: {
      src: 'example',
      dist: 'demo',
      tmp: '.sass-cache',
    },
    connect: {
      app: {
        options: {
          port: 9000,
          hostname: 'localhost',
          open: true,
          base: '<%= app.dist %>'
        }
      }
    },
    clean: {
      app: {
        files: [{
          dot: true,
          src: [
            '<%= app.tmp %>',
            '<%= app.dist %>'
          ]
        }]
      }
    },
    sass: {
      app: {
        files: [{
          expand: true,
          cwd: '<%= app.src %>',
          src: ['*.scss'],
          dest: '<%= app.dist %>',
          ext: '.css'
        }]
      }
    },
    copy: {
      app: {
        src: '<%= app.src %>/index.html',
        dest: '<%= app.dist %>/index.html'
      }
    }
  });

  grunt.registerTask('build', 'Build example', [
    'clean',
    'sass',
    'copy'
  ]);

  grunt.registerTask('preview', 'Serve example in node server', [
    'connect:app:keepalive'
  ]);

  grunt.registerTask('default', [
    'build',
    'preview'
  ]);
};
