var gulp = require('gulp'),
	compass = require('gulp-compass'),
	concat = require('gulp-concat'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber');

var PATH = {
    app:
    {
        root: '.',
        source:{},
        public:{}
    },
	dist:
	{
	    root: './dist'
	}
};

PATH.app.source = {
	js:PATH.app.root + '/source/js',
	coffee:PATH.app.root + '/source/coffee',
	libs:PATH.app.root + '/source/libs',
	sass:PATH.app.root + '/source/sass'

}

PATH.app.public = {
	root: PATH.app.root + '/public',
	css: PATH.app.root + '/public/css',
	js: PATH.app.root + '/public/js',
	libs: PATH.app.root + '/public/js/libs',
	img: PATH.app.root + '/public/img'
}

var MATCHES = {
	html:'/*.html',
	sass:'/**/*.scss',
	coffee:'/**/*.coffee',
	js:'/**/*.js',
	css:'/**/*.css'
}

var USE_COFFEESCRIPT = true;
// bundles formados pelo browserify
var BUNDLES = [
	'main'
]

/* ---------- ESTRUTURA DE DEV ---------- */
gulp.task('browserify', function(){

	for (var i = 0; i < BUNDLES.length; i+=1) {

		var folders = BUNDLES[i].split('/');
		var filename,
			path = "/";

		if (folders.length === 0){
			return;
		}
		else if (folders.length == 1){
			filename = BUNDLES[i];
		}
		else{
			filename = folders.splice(folders.length-1, 1)[0];
			path += folders.join("/") + "/";
		}

		var filenameInput = filename + ".js";
		var filenameOutput = filenameInput;
		var srcInput = PATH.app.source.js;

		if (USE_COFFEESCRIPT){
			filenameInput = filename + ".coffee";
			srcInput = PATH.app.source.coffee;
		}

		var src = srcInput + path + filenameInput;
		var distFolder = PATH.app.public.js + path;

		// console.log(">>>>");
		// console.log(src, filenameInput, distFolder);
		var bundler = watchify(browserify({
			cache: {},
			packageCache: {},
			entries:[src],
			extensions: ['.coffee']
		}))

		var bundle = function(){
			return bundler
				.bundle()
				.on('error', handleErrors)
				.pipe(plumber())
				.pipe(source(filenameOutput))
				.pipe(gulp.dest(distFolder))
		}

		bundler.on('update', bundle)
		bundle()
	}
});

gulp.task('concatLibs', function(){
	gulp.src([PATH.app.source.libs + MATCHES.js], {base: PATH.app.source.libs})
		.pipe(concat('libs.js'))
		.on('error', handleErrors)
		.pipe(gulp.dest(PATH.app.public.libs));
})

gulp.task('compass', function (){
	return gulp.src(PATH.app.source.sass + MATCHES.sass)
        .pipe(compass({
			sass: PATH.app.source.sass,
			css: PATH.app.public.css,
			image: PATH.app.public.img
		}))
		.on('error', handleErrors)
    .pipe(gulp.dest(PATH.app.public.css));
});

gulp.task('watch', function (){
	//gulp.watch(PATH.app.source.sass + MATCHES.sass, ['compass']);
	gulp.watch(PATH.app.source.js + MATCHES.js, ['browserify']);
	gulp.watch(PATH.app.source.coffee + MATCHES.coffee, ['browserify']);
	//gulp.watch(PATH.app.source.libs + MATCHES.js, ['concatLibs']);
});

function handleErrors (){
	var args = Array.prototype.slice.call(arguments);

	notify.onError({
		title: "Compile Error",
		message: "<%= error.message %>"
	}).apply(this, args);

	this.emit('end');
}


// TODO: falta prod

gulp.task('default',  ['browserify','watch']);