module.exports = (grunt) => {
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
	const options = {
		livereload: true,
		interrupt: true,
		reload: true,
	};
	grunt.initConfig({
		watch: {
			js: { files: watchlist.js, options },
			html: { files: watchlist.html, options },
			css: { files: watchlist.css, options },
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);
};