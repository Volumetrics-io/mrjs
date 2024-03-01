/**
 * @namespace error
 * @description Useful namespace for helping with error utility functions
 */
let error = {};

error.emptyParentFunction = function () {
    console.error('Empty parent function was reached; this must be overridden in children.');
}

error.warnOfEmptyParentFunction = function () {
    console.warn('Empty parent function was reached, make sure this was overridden in children if more execution was expected.');
}
