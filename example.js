/**
 * Created by igor on 05.10.16.
 */
var minify = require('./index');
var async = require('async');
var ut = require('util');

async.series([

		(done) => {
			console.log('Test scan all file in folder');
			minify.file({
				file : './for-example/src/minify-js.js',
				dist : './for-example/minify-js.min.js'
			}, (e, compress) => {

				if (e) {
					console.log('ERROR ', e);
					return done();
				}

				compress.run((e) => {
					// TODO: clear
					console.log('e ', e);
				});
			});
		}
], function (e) {
	console.log('The end :)');
});
