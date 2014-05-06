module.exports = function (grunt) {

	var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
  
    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),
        transport: {
            options : {
                idleading : 'app/test/dist/',
                alias :'<%= pkg.spm.alias %>',
                parsers : {
                '.js' : [script.jsParser],
                '.css' : [style.css2jsParser],
                '.html' : [text.html2jsParser]
                }
            },
            my_test: {
                files : [{
                    cwd: 'seajs_modules/app/test/src/',
                    src: ['*'],
                    dest: '.build'
                }]
            }
        },
        concat : {

                // static_mappings: {
                //   // 静态文件映射，
                //   // 添加或删除文件时需要更新 Gruntfile。
                //   files: [
                //     {src: 'lib/a.js', dest: 'build/a.min.js'},
                //     {src: 'lib/b.js', dest: 'build/b.min.js'},
                //     {src: 'lib/subdir/c.js', dest: 'build/subdir/c.min.js'},
                //     {src: 'lib/subdir/d.js', dest: 'build/subdir/d.min.js'},
                //   ],
                // },
               // dynamic_mappings: {
               //    // 动态文件映射，
               //    // 当任务运行时会自动在 "lib/" 目录下查找 "**/*.js" 并构建文件映射，
               //    // 添加或删除文件时不需要更新 Gruntfile。
               //    files: [
               //      {
               //        expand: true,     // 启用动态扩展
               //        cwd: 'lib/',      // 源文件匹配都相对此目录
               //        src: ['**/*.js'], // 匹配模式
               //        dest: 'build/',   // 目标路径前缀
               //        ext: '.min.js',   // 目标文件路径中文件的扩展名
               //        extDot: 'first'   // 扩展名始于文件名的第一个点号
               //      },
               //    ],
               //  },
               
            options : {
                // paths : ['.build'],
                // include : 'relative',
                noncmd: true
                },
               main : {
                    files : [{
                        expand: true,
                        cwd: '.build/',
                        src: ['*.js'],
                        dest: 'seajs_modules/app/test/dist/',
                        ext: '.js'
                    }]
               },
               other : {
                    files :[{
                        src : ['.build/*.js' ,'!.build/*-debug.js'],
                        dest : 'seajs_modules/app/test/dist/test.js'

                    },{
                        src : ['.build/*-debug.js'],
                        dest : 'seajs_modules/app/test/dist/test-debug.js' 
                    },{
                        expand: true,
                        cwd: '.build/',
                        src: ['*.css'],
                        dest: 'seajs_modules/app/test/dist/',
                        ext: '.css'
                    }]
               } 
        },
        uglify : {
            options: {
              mangle: {
                except: ['require', 'define' , "exports", "module"]
              }
            },
            main :{
                files : [{
                    expand: true,
                    cwd: 'seajs_modules/app/test/dist/',
                    src: ['*.js', '!*-debug.js'],
                    dest: 'seajs_modules/app/test/dist/',
                    ext: '.js'
                }]
            },
            vivi : {
              files : {
                "D:/iivi/iivi1.0/app/webroot/js/vivi.min.js" :  "D:/iivi/iivi1.0/app/webroot/js/vivi.js" 
              }
            }
        },
        cssmin: {
          minstyle: {
            files:[{
                expand: true,
                cwd: 'seajs_modules/app/test/src/',
                src: ['*.css', '!*-debug.css'],
                dest: 'seajs_modules/app/test/dist/',
                ext: '.css'
              }]
          }
        }
    });
   
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.registerTask('build-styles', ['transport:styles', 'concat:styles', 'uglify:styles', 'clean']);
    // grunt.registerTask('build-app1', ['transport:app1', 'concat:app1', 'uglify:app1', 'clean']);

    grunt.registerTask("default",["transport:my_test","concat:other","uglify:main" ,"cssmin:minstyle" ]);
    grunt.registerTask("vivi" , ["uglify:vivi"])
};