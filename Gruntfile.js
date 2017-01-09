module.exports = grunt => {
	'use strict';

	const watchlist = {
		js: [
			'Gruntfile.js',
			'app.js',
			'components.js',
			'store.js',
		],
		html: ['index.html'],
		css: ['style.css'],
	};

	grunt.initConfig({
		watch: {
			js: {
				files: watchlist.js,
				options: {
					livereload: true,
					interrupt: true,
					reload: true,
				},
			},
			html: {
				files: watchlist.html,
				options: {
					livereload: true,
					interrupt: true,
					reload: true,
				},
			},
			css: {
				files: watchlist.css,
				options: {
					livereload: true,
					interrupt: true,
					reload: true,
				},
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);
};