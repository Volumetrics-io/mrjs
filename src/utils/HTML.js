import { URL } from 'url';

/**
 * @namespace html
 * @description Useful namespace for helping with html utility functions
 */
let html = {};

/**
 * @function
 * @memberof html
 * @param {string} path - either a relative or full path inputted to an element.
 * Additionally removes all queries from the end of the url, leaving the input as just the origin and its pathname.
 * For ex: 'https://example.com/images/photo.png?version=2' becomes 'https://example.com/images/photo.png'
 * @description Given the path returns an absolute path resolved so relative linking works as expected.
 * @returns {string} a.href - the absolute path
 */
html.resolvePath = function (path) {
    let a = document.createElement('a');
    a.href = html.removeUrlQueries(path);
    return a.href;
};

html.removeUrlQueries = function (path) {
    let urlObj = new URL(path);
    let cleanUrl = urlObj.origin + urlObj.pathname;
    return cleanUrl.toString();
}

export { html };
