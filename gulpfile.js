var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');

var tsProject = ts.createProject('./server/tsconfig.json');

/* SERVER:BUILD */
gulp.task('server:templates', function() {
	gulp.src("./server/templates/**/*").pipe(gulp.dest('./dist/templates'));
});

gulp.task('server:build', function() {
	gulp.src("./static/**/*").pipe(gulp.dest('./dist/static'));
	var tsResult = gulp.src("./server/**/*.ts")
		.pipe(sourcemaps.init())
		.pipe(tsProject());
	return tsResult.js
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./dist'));
});

/* SERVER:NODEMON */
gulp.task('server:nodemon', ['server:templates', 'server:build'], function () {
	nodemon({
		script: './dist/app.js',
		ext: 'html js',
		watch: ['dist'],
		ignore: ['dist/static'],
		//tasks: ['tslint']
	}).on('restart', function () {
		 //console.log('restarted!');
	});
});

gulp.task('start', ['server:nodemon'], function () {
	gulp.watch('src/server/**/*.ts', ['server:build']);
	gulp.watch('src/server/templates/**/*.html', ['server:templates']);
});

