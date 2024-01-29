/**
 * @namespace HTML
 * @description Useful namespace for helping with HTML utility functions
 */
let HTML = {};

/**
 * @function
 * @memberof HTML
 * @param {string} path - either a relative or full path inputted to an element
 * @description Given the path returns an absolute path resolved so relative linking works as expected.
 * @returns {string} a.href - the absolute path
 */
HTML.resolvePath = function (path) {
    let a = document.createElement('a');
    a.href = path;
    return a.href;
};

export { HTML };
