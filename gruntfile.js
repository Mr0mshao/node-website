module.exports = function(grunt){
	grunt.initConfig({
		watch : {
			jade : {
				files : ['views/**'],
				options : {
					livereload : true
				}
			},
			js : {
				files : ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				// tasks :['jshint'],
				options : {
					livereload : true
				}
			}
		},
		nodemon : {
			dev : {
				options : {
					file : 'app.js',//入口文件
					args : [],
					ignoredFiles : ['readme.txt','node_modules/**', '.DS_Stroe'],
					watchedExtensions : ['js'],
					// watchedFolder : ['app', 'config'],
					watchedFolder : ['./'],
					debug : true,
					delayTime : 1,//延时启动
					env : {
						PORT : 3000
					},
					cwd : __dirname
				}
			}
		},
		concurrent : {
			tasks : ['nodemon', 'watch'],
			options : {
				logConcurrentOutput : true
			}
		}



		
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.option('force', true);

	grunt.registerTask('default', ['concurrent']);
};