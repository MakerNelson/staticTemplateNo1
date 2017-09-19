'use strict';

var gulp = require('gulp');                        //获取gulp
var browsersync = require('browser-sync').create();//获取browsersync
var mkdirp = require('mkdirp');
var del=require('del');
var uglify = require('gulp-uglify'); 
var less=require('gulp-less')
var htmlmin = require('gulp-htmlmin');
var fs = require('fs');
var watch = require('gulp-watch');
var path = require('path');

var clients = [/*"admin",*/"pc"];
var client_inside_dir = ['scripts','styles','images'];
var clientType = '+('+clients.join("|")+')';

//创建文件夹结构
gulp.task('tree',function(){
    var dirs = [];
    for(var i in clients){
        for(var j in client_inside_dir){
            if(client_inside_dir[j] === 'scripts') dirs.push('./src/'+clients[i]+'/'+client_inside_dir[j]+'/lib/');
            else dirs.push('./src/'+clients[i]+'/'+client_inside_dir[j]+'/');
        }
    }
    dirs.push('./src/publicLib/');
    dirs.forEach(dir => {
    mkdirp.sync(dir);
    });
    for(var i in clients){
        fs.writeFile('./src/'+clients[i]+'/index.html','',function(err){
            if(err) console.log("build 'index.html' error!");
            else console.log("Finished 'index.html' "); 
        });
    }
});

gulp.task("lib", function () {
    gulp.src('./src/'+clientType+'/scripts/lib/**/*.*')
    .pipe(gulp.dest('./dist/'));

    gulp.src('./src/publicLib/**/*.*')
    .pipe(gulp.dest('./dist/publicLib/'))
    .pipe(browsersync.stream());
});


//删除dist目录下文件

gulp.task('clean',function(cb){
    return del(['./dist/*'],cb);
})

//操作js文件
              //js压缩插件
//var concat = require('gulp-concat');               //js合并插件
gulp.task('scripts', function() {
    gulp.src(['./src/'+clientType+'/scripts/**/*.js','!./src/'+clientType+'/scripts/lib/**/*.js'])               //需要操作的源文件
        .pipe(uglify())               //压缩js文件
        //.pipe(concat('app.js'))       //把js文件合并成app.js文件
        // .pipe(gulp.dest('./dist/'+clientType+'/scripts/**/*.js'))   //把操作好的文件放到dist/js目录下
        .pipe(gulp.dest('./dist/'))   //把操作好的文件放到dist/js目录下
        .pipe(browsersync.stream());  //文件有更新自动执行
});

//操作css文件
//var cssnano = require('gulp-clean-css');    //css压缩插件
             //less文件编译
gulp.task('style', function() {
    gulp.src('./src/'+clientType+'/styles/**/*.{css,less}')
        .pipe(less())                     //编译less文件
        //.pipe(cleanCSS())                  //css压缩
        .pipe(gulp.dest('./dist/'))
        .pipe(browsersync.stream());
});

// var imagemin = require('gulp-imagemin');    //图片压缩插件
gulp.task('image', function() {
    // gulp.src('./src/'+clientType+'/images/**/*.{png,jpg,jpeg,gif,svg}')
    gulp.src('./src/'+clientType+'/images/**/*.*')
        // .pipe(imagemin())
        .pipe(gulp.dest('./dist/'))
        .pipe(browsersync.stream());
});

      //html压缩插件
gulp.task('html', function() {
    gulp.src('./src/'+clientType+'/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,            //压缩html
            collapseBooleanAttributes: true,     //省略布尔属性的值
            removeComments: true,                //清除html注释
            removeEmptyAttributes: true,         //删除所有空格作为属性值
            removeScriptTypeAttributes: true,    //删除type=text/javascript
            removeStyleLinkTypeAttributes: true, //删除type=text/css
            minifyJS:true,                       //压缩页面js
            minifyCSS:true                       //压缩页面css
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(browsersync.stream());
});

gulp.task('src_dir',function(){
    gulp.src('./src/*.*')
        .pipe(gulp.dest('./dist/'));
});
//任务：watcher  用来监听全部文件，可以实现src和dist两个文件夹的文件同步问题，即添加/删除/修改同步
function assignDel(file){
    //删除文件
	var distFile = './dist/' + path.relative('./src', file); //计算相对路径
	fs.existsSync(distFile) && fs.unlink(distFile,function(err){if(err) console.log('function fs.unlink() have an error')});
}
gulp.task('watcher',function(){
    watch('./src/'+clientType+'/scripts/**/*.js')
		.on('add', function(file){gulp.start('scripts');})
		.on('change', function(file){gulp.start('scripts');})
		.on('unlink', assignDel);
    watch(['./src/publicLib/**/*.*','./src/'+clientType+'/scripts/lib/**/*.*'])
		.on('add', function(file){gulp.start('lib');})
		.on('change', function(file){gulp.start('lib');})
		.on('unlink', assignDel);
    watch('./src/'+clientType+'/styles/**/*.{css,less}')
		.on('add', function(file){gulp.start('style');})
		.on('change', function(file){gulp.start('style');})
		.on('unlink', assignDel);
    watch('./src/'+clientType+'/images/**/*.*')
		.on('add', function(file){gulp.start('image');})
		.on('change', function(file){gulp.start('image');})
		.on('unlink', assignDel);
    watch('./src/'+clientType+'/**/*.html')
		.on('add', function(file){gulp.start('html');})
		.on('change', function(file){gulp.start('html');})
		.on('unlink', assignDel);
    watch('./src/*.*')
        .on('add', function(file){gulp.start('src_dir')})
		.on('change', function(file){gulp.start('src_dir')})
		.on('unlink', assignDel);
});

gulp.task('onServe', ['clean'],function() {
    gulp.start('scripts','lib','style','image','html','src_dir','watcher');
    browsersync.init({
        port: 3000,
        server: {
            baseDir: './dist/pc/'
            // index: 'index.html'
        }
    });

});
gulp.task('offServe',['clean'], function() {
    gulp.start('scripts','lib','style','image','html','src_dir','watcher');
});
gulp.task('default',['onServe']);
gulp.task('dev:on',['onServe']);
gulp.task('dev:off',['offServe']);

gulp.task('pro',['clean'],function(){
    gulp.start('scripts','lib','style','image','html','src_dir');
});
//空文件夹，想要生成目录结构，使用gulp tree
/*
在开发模式中，可以使用gulp dev:on或gulp dev:off 前者开启静态服务器，实时刷新浏览器得效果，后者则不开启静态浏览器。
但两者都有使用watch监听文件变化从而更新文件
*/
//开发完成，在生产模式中可以使用gulp pro进行打包，得出成品