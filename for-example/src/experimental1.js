/**
 * CONTENT
 * @description library for minification  javascript files
 * @module
 */
"TEST2";

// Modules & utils

let fs = require('fs');

// Code
/**/
/* */
/***/
// dsgdfs
//////

/**
 * It is a frame for other classes
 */
class Frame {
	constructor () {
		this.active = 'constructor'; // oioioiyu
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
			mess2 : `Class ${this.active}/${a}: ${mess}`,
			mess2 : 'ONE',
			mess2 : 'Double',
			class : c
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
		log.warn(/*HA -ha -ha */that._mess(mess).mess);
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

}
exports.file = (cb) => new MinifyFile(opt, cb);
exports.files =null;
exports.dirs = null;
