/**
 * Created by igor on 05.10.16.
 * @description library for minification  javascript files
 * @module
 */
"use strict";

// Modules & utils

let fs = require('fs');
let dir = require('dir_cache');
let utils = require('utils-igor')(['type', 'obj']);
let path = require('path');

// Code

/**
 * It is a frame for other classes
 */
class Frame {
	constructor () {
		this.active = 'constructor';
	}
	/**
	 * @method Collected data for message
	 * @param {String} mess
	 * @returns {{mess: *, active: string, class: *}}
	 * @private
	 */
	_mess (mess) {
		let that = this;
		let c = that.constructor.name;
		let a = that.active;
		return {
			active : a,
			mess : `Class ${this.active}/${a}: ${mess}`,
			class : c
		};
	}

	/**
	 * Return error object and set flag for stop process
	 * @method
	 * @param mess
	 * @param data
	 * @returns {{message: *, method: a, class: c, type: string}}
	 */
	err (mess, data) {
		var param = this._mess(mess);

		this.stop = param.mess;

		return {
			message : param.mess,
			method : param.active,
			class : param.class,
			type : 'ERROR',
			data : data || ''
		};

	}

	/**
	 * Get text for message
	 * @method
	 * @param {String} mess
	 * @param {Class} that
	 */
	warn (mess, that) {
		that = that || this;
		log.warn(that._mess(mess).mess);
	}
}

/**
 * Minification one javascript file
 */
class MinifyFile extends Frame {
	/**
	 * @param  {file : String, dist : String}opt
	 * @param {function}cb
	 */
	constructor (opt, cb) {
		super();
		let that = this;
		that._isStop = null;
		cb = utils.type.beFn(cb);
		that.validOptions(opt, (e) => {
			cb(e, that);
		});

	}

	/**
	 * Check flag isStop
	 * @returns {boolean}
	 */
	checkStop() {
		return this._isStop;
	}

	/**
	 * Start process
	 * @param {Function}cb
	 */
	run (cb) {
		let that = this;
		that.active = 'Run';
		cb = utils.type.beFn(cb);

		if (that.checkStop()) {
			return cb(that.err(that._isStop));
		}

		that.fileRead(cb);
	}

	/**
	 * Get file contents
	 * @param {Function}cb
	 */
	fileRead (cb) {

		let that = this;
		that.active = 'fileRead';

		fs.readFile(that.filePath, (e, data) => {

			if (e) {
				that._isStop = 'No read file';
				return cb(that.err(that._isStop, e));
			}

			that.data  = data.toString();
			that.compess().save(cb);
		});
	}

	/**
	 * Save result
	 * @param {Function}cb
	 */
	save (cb) {
		let that = this;
		that.active = 'save';
		fs.writeFile(that.dist, that.data, cb);
	}
	/**
	 * Compress file contents
	 * @param {Function}cb
	 */
	compess()  {
		let that = this;
		that.active = 'compess';
		let d = that.data;
		let qoutesSave = {};
		let i = 0;
		['"', '`', `'`].forEach((q) => {
			let search =  d.match(new RegExp(q +'(.*)' + q, 'g'));

			if (search)
				for (var k = 0; k < search.length; k++) {
					qoutesSave[i] = search[k];
					d = d.replace(search[k], '#' + i);
					i++;
				}
		});

		// Remove comments, tabuliar symbols, Only one space
		d = d.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
			.replace(/(\r|\n|\t)/g, '')
			.replace(/(\s+)/g, ' ');

		// Back qoutes
		utils.obj.for(qoutesSave, (inx, val) => d = d.replace(new RegExp(`#${inx}`,'g'), val));

		that.data = d;
		return that;
	}

	/**
	 * Check options
	 * @param {Object}opt
	 * @param {Function}cb
	 * @returns {*}
	 */
	validOptions (opt, cb) {

		let that = this;
		that.active = 'validOptions';

		if (!opt.file || !opt.dist || !opt.dist.length) {
			that._isStop = 'No js file or dist in options';
			return cb(that.err(that._isStop));
		}

		that.filePath = path.resolve(opt.file);

		fs.exists(that.filePath, (exists) => {

			if (!exists) {
				that._isStop = `No exists file ${opt.file}`;
				return cb(that.err(that._isStop));
			}

			that.file = opt.file;
			that.dist = opt.dist;

			cb(null);

		});

	}
}
exports.file = (opt, cb) => new MinifyFile(opt, cb);
exports.files =null;
exports.dirs = null;
