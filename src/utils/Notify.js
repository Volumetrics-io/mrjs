/**
 * @namespace error
 * @description Useful namespace for helping with error utility functions
 */
let error = {};

/**
 * @function
 * @memberof error
 * @description Function helper to error in console if a child class is expected to overwrite a parent
 * class's function but didnt.
 */
error.emptyParentFunction = function () {
    console.error('Empty parent function was reached; this must be overridden in children.');
}

/**
 * @function
 * @memberof error
 * @description Function helper separated out to console error for when we eventually have a more robust
 * erroring system.
 */
error.err = function(string) {
    console.error(string);
}

/**
 * @namespace warn
 * @description Useful namespace for helping with error utility functions
 */
let warn = {};

/**
 * @function
 * @memberof warn
 * @description Function helper to warn in console if a child class might want to overwrite a parent
 * class's function but didnt. Useful for base classes that are more abstract classes (if in Java or C++)
 * to remind the user of the child class that there is more to implement.
 */
warn.EmptyParentFunction = function () {
    console.warn('Empty parent function was reached, make sure this was overridden in children if more execution was expected.');
}

/**
 * @function
 * @memberof warn
 * @description Function helper separated out to console warn for when we eventually have a more robust
 * warning system.
 */
warn.warn = function(string) {
    console.warn(string);
}

export { error, warn };
