/**
 * @TODO: Consider mocking jQuery
 */
let jQuery = require('jquery');
global.jQuery = global.$ = jQuery;

require('../jquery.lazyload');

describe('general', () => {
    it('should add lazyload() function to global {jQuery} object', () => {
        expect($.fn).toHaveProperty('lazyload');
        expect(typeof $.fn.lazyload).toBe('function');
    });
});