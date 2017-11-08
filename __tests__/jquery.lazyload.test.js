/* Add dependencies */
const jQuery = require('jquery');

global.jQuery = global.$ = jQuery;

/* Mock implementations */
const mocks = {
    windowHeight: 100
}
window = Object.assign(window, { innerHeight: mocks.windowHeight });

require('../jquery.lazyload');

const defaultOptions = {
    threshold   : 0,
    placeholder : "data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs="
};

describe('general', () => {
    it('should add lazyload() function to global {jQuery} object', () => {
        expect(typeof $.fn.lazyload).toBe('function');
    });
});

describe('$.fn.lazyload()', () => {
    it('should add \'appear\' listener', () => {
        const $img = $('<img>');
        $img.lazyload();

        expect(jQuery._data($img[0], 'events')).toHaveProperty('appear');
    });

    describe('when element is an image', () => {
        it('should set src to default placeholder when src is falsy', () => {
            const $img = $('<img>');
            $img.lazyload();

            expect($img.attr('src')).toBe(defaultOptions.placeholder);
        });

        it('should not set src to default placeholder when src is set', () => {
            const $img = $('<img src="test.png">');
            $img.lazyload();

            expect($img.attr('src')).toBe('test.png');
        });
    });
});

describe('LazyLoad object', () => {
    const Constructor = $.fn.lazyload.Constructor.prototype;

    it('should add lazyload().Constructor object to $.fn.lazyload()', () => {
        expect(typeof $.fn.lazyload.Constructor).toBe('function');
    });

    describe('getElementTop()', () => {
        it('should return element\'s top + threshhold', () => {
            const offsetTop = 100,
                threshold = 50,
                spyOffset = jest.spyOn($.fn, 'offset').mockImplementation(() => {
                    return { top: offsetTop };
                });

            const top = Constructor.getElementTop(null),
                topThreshold = Constructor.getElementTop(null, threshold);

            expect(top).toBe(offsetTop);
            expect(topThreshold).toBe(offsetTop - threshold);

            spyOffset.mockRestore();
        });
    });

    describe('getWindowHeight()', () => {
        it('should return innerHeight when innerHeight is set', () => {
            const mockWindow = { innerHeight: 420 },
                container = Constructor.getWindowHeight(mockWindow);

            expect(container).toEqual(mockWindow.innerHeight);
        });

        it('should return $.fn.height() when innerHeight is not set', () => {
            const mockWindow = {},
                height = 420,
                heightSpy = jest.spyOn($.fn, 'height').mockImplementation(
                    () => height
                );

            const container = Constructor.getWindowHeight(mockWindow);

            expect(container).toBe(height);

            heightSpy.mockRestore();
        });
    });

    describe('getFoldBottom()', () => {
        it('should return fold bottom when container is window', () => {
            const scrollTop = 25,
                spyScrollTop = jest.spyOn($.fn, 'scrollTop').mockImplementation(
                    () => scrollTop
                ),
                foldBottom = Constructor.getFoldBottom(window);

            expect(foldBottom).toBe(window.innerHeight + scrollTop);

            spyScrollTop.mockRestore();
        });

        it('should return fold bottom when container is custom', () => {
            const offsetTop = 100,
                height = 50,
                spyOffset = jest.spyOn($.fn, 'offset').mockImplementation(
                    () => {
                        return { top: offsetTop };
                    }
                ),
                spyHeight = jest.spyOn($.fn, 'height').mockImplementation(
                    () => height
                ),
                foldBottom = Constructor.getFoldBottom(null);

            expect(foldBottom).toBe(offsetTop + height);

            spyOffset.mockRestore();
            spyHeight.mockRestore();
        });
    });

    describe('getContainer()', () => {
        it('should return window when settings.container is falsy', () => {
            const container = Constructor.getContainer();
            expect(container).toBe(window);
        });
        it('should return container when settings.container is set', () => {
            const container = Constructor.getContainer('test');
            expect(container).toBe('test');
        });
    });
});

describe('positioning functions', () => {
    const Constructor = $.fn.lazyload.Constructor.prototype;

    describe('$.belowthefold()', () => {
        it('should return true when below the fold', () => {
            const spyGetElementTop = jest.spyOn(Constructor, 'getElementTop')
                .mockImplementation(() => 100),
                getContainer = jest.spyOn(Constructor, 'getFoldBottom')
                    .mockImplementation(() => 50),
                result = $.belowthefold(null, {threshold: 0});

            expect(result).toBe(true);
        });

        it('should return false when below the fold', () => {
            const spyGetElementTop = jest.spyOn(Constructor, 'getElementTop')
                .mockImplementation(() => 50),
                getContainer = jest.spyOn(Constructor, 'getFoldBottom')
                    .mockImplementation(() => 10),
                result = $.belowthefold(null, {threshold: 0});

            expect(result).toBe(true);
        });
    });
});
