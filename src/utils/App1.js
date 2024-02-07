/**
 * @namespace app
 * @description Useful namespace for helping with app utility functions.
 */
let App = {
    get scale() {
        if (mrjsUtils.xr.isPresenting) {
            return 0.5;
        }
        return 1;
    },
};

export { App };
