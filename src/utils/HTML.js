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
html.resolvePath = function (path, baseUrl = window.location.href) {
    let a = document.createElement('a');
    a.href = html.removeUrlQueries(path, baseUrl);
    return a.href;
};

html.removeUrlQueries = function (path, baseUrl) {
    try {
        // Check if path is absolute. If not, use baseUrl as the second parameter
        let urlObj = new URL(path, baseUrl);
        let cleanUrl = urlObj.origin + urlObj.pathname;
        return cleanUrl;
    } catch (error) {
        console.error("Error processing URL:", error.message);
        return path; // Return the original path if there's an error
    }
}

export { html };
