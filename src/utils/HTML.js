/**
 * @namespace html
 * @description Useful namespace for helping with html utility functions
 */
let html = {};

/**
 * @function
 * @memberof html
 * @param {string} path - either a relative or full path inputted to an element. This can also be a path that has items separated by ',' so
 * that you can resolve multiple items at once, since we allow users to send us multiple files that way.
 * @param {string} baseUrl - a separate entry for if you want your url to start differently. this defaults to your window.location.origin.
 * Additionally removes all queries from the end of the url, leaving the input as just the origin and its pathname.
 * For ex: 'https://example.com/images/photo.png?version=2' becomes 'https://example.com/images/photo.png'
 * @description Given the path returns an absolute path resolved so relative linking works as expected.
 * @returns {string} a.href - the absolute path (or paths)
 */
html.resolvePath = function (path, baseUrl) {
    const fixPath = (path, baseUrl) => {
        let a = document.createElement('a');
        a.href = html.removeUrlQueries(path, baseUrl);
        return a.href;
    };

    // multiple paths
    if (path.includes(',')) {
        let returnedPathStr = '';
        let pathList = path.split(',');
        for (let i = 0; i < pathList.length; ++i) {
            returnedPathStr += fixPath(pathList[i], baseUrl) + (i != pathList.length - 1 ? ',' : '');
        }
        return returnedPathStr;
    }

    // singular path
    return fixPath(path, baseUrl);
};

/**
 * @function
 * @memberof html
 * @param {string} path - either a relative or full path inputted to an element.
 * @param {string} baseUrl - a separate entry for if you want your url to start differently. this defaults to your window.location.origin.
 * @description Removes all queries from the end of the url, leaving the input as just the origin and its pathname.
 * For ex: 'https://example.com/images/photo.png?version=2' becomes 'https://example.com/images/photo.png'
 * @returns {string} a.href - the absolute path
 */
html.removeUrlQueries = function (path, baseUrl) {
    try {
        // Check if path is absolute. If not, use baseUrl as the second parameter
        let urlObj;
        if (baseUrl) {
            urlObj = new URL(path, baseUrl);
        } else {
            urlObj = new URL(path);
        }
        let cleanUrl = urlObj.origin + urlObj.pathname;
        return cleanUrl;
    } catch (error) {
        console.warn('Error processing URL:', error.message);
        return path; // Return the original path if there's an error
    }
};

export { html };
