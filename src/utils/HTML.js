/**
 * @namespace html
 * @description Useful namespace for helping with html utility functions
 */
let html = {};

/**
 * @function
 * @memberof html
 * @param {string} path - either a relative or full path inputted to an element. This can be a path that has items separated by ',' so
 * that you can resolve multiple items at once.
 * @param {string} baseUrl - a separate entry for if you want your url to start differently. this defaults to your window.location.origin.
 * Additionally removes all queries from the end of the url, leaving the input as just the origin and its pathname.
 * For ex: 'https://example.com/images/photo.png?version=2' becomes 'https://example.com/images/photo.png'
 * @description Given the path returns an absolute path resolved so relative linking works as expected.
 * @returns {string} a.href - the absolute path
 */
html.resolvePath = function (path, baseUrl) {
    const fixPath = (path, baseUrl) => {
        let a = document.createElement('a');
        a.href = html.removeUrlQueries(path, baseUrl);
        return a.href;
    }

    // singular path
    if (path.includes(",")) {
        // multiple paths
        // handle multiple paths
        let retPath = "";
        let paths = path.split(',');
        console.log(paths);
        for (let i=0; i<paths.length; ++i) {
            console.log('path:', paths[i]);
            retPath += fixPath(paths[i], baseUrl) + ((i != paths.length-1) ? "," : "");
        }
        console.log(retPath);
        return retPath;
    } else {
        // singular path
        return fixPath(path, baseUrl);
    }
    // console.log(path);
    // console.log(paths);
    // if (paths == 0) {
    //     let p = fixPath(path, baseUrl);
    //     console.log(p);
    //     return p;
    // }
    
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
