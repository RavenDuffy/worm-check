import excludeDirectories from "./exclude-directories.js";
import directories from "./directories.js";
import verbose from "./verbose.js";
import help from "./help.js";
import out from "./out.js";

/** @type {Flag[]} */
const flagList = [directories, excludeDirectories, verbose, help, out];
export default flagList;

/**
 * @typedef {Object} Flag
 * @property {String[]} name
 * @property {String} desc
 * @property {Boolean} takesArgs
 * @property {String[]} [args]
 * @property {Function} handler
 * @property {Boolean} [mandatory]
 * @property {('define'|'log'|'block')} type
 */
