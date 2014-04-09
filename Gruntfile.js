'use strict';

module.exports = function(grunt) {
  //mac uses 0.0.0.0 to share localhost ports, but on windows it breaks, so use localhost on windows
  var myHost = !!process.platform.match(/^win/) ? 'localhost' : '0.0.0.0';
  // Load grunt tasks automatically from npm_modules folder
  require('load-grunt-tasks')(grunt);

  //load/register tasks from "task" folder.



  // Project configuration.
  grunt.initConfig({

     


    pkg: grunt.file.readJSON('package.json'),

    // Watches files for changes and runs tasks based on the changed files
    yeoman: {
      // configurable paths
      app: './app',
      distBaseUrl: 'http://s3.amazonaws.com/datehookup/dhspa/deploy/<%= yeoman.distBranch %>/dist/app/',
      distBranch: 'junk'
    },

    watch: {

    },
    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        //on mac it's 0.0.0.0.  on windows it's localhost.  because windows fails with 0.0.0.0
        hostname: myHost,
        // livereload: 35729,
      },

      proxies: [
        {
            context: '/qwer',
            host: myHost,
            port: '8086',
            //ws: true,
            https: false,
            changeOrigin: true,
            //xforward: false,
            headers: {
                "x-custom-added-header": 'asdfasdfasdfasdf'
            }
        },
        {
            context: '/zxcv',
            host: myHost,
            port: '8085',
            ws: true,
            https: false,
            //changeOrigin: true,
            //xforward: false,
            // rewrite: {
            //     '^/qwer': '/asdf'
            // },
            headers: {
                "x-custom-added-header": 'asdfasdfasdfasdf'
            }
        },
        {
            context: '/signalr',
            //host: 'tj-pc.office.okcupid.com',
            host: 'test.datehookup.com',

            //port: '8085',
            //ws: true,
            https: false,
            changeOrigin: true,
            //xforward: false,
            // rewrite: {
            //     '^/qwer': '/asdf'
            // },
            headers: {
                "x-custom-added-header": 'asdfasdfasdfasdf'
            }
        }
      ],
      imgserver: {
        options: {
          port: 9009,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      livereload: {
        options: {
          //open: 'http://'+myHost+':9000/dev.html',
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ],


          middleware: function (connect, options) { //PROXY STUFF
              var middlewares = [];
              var directory = options.directory || options.base[options.base.length - 1];
              if (!Array.isArray(options.base)) {
                  options.base = [options.base];
              }
                           // Setup the proxy
                           middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

              options.base.forEach(function(base) {
                  // Serve static files.
                  middlewares.push(connect.static(base));
              });

              // Make directory browse-able.
              middlewares.push(connect.directory(directory));

              return middlewares;
          }
        }
      }
    }

  });



  //-------------
  // LOCALHOST SERVER TASK AND SUBTASKS


  // Launch application server, setup file watch, setup proxy
  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'connect:livereload',
      'connect:imgserver',
      'watch'
    ]);
  });








  // Default task.
  grunt.registerTask('default', ['serve']);





};
