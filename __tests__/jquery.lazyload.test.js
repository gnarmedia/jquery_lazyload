/* Add dependencies */
const jQuery = require('jquery');

global.jQuery = global.$ = jQuery;

/* Mock implementations */
const mocks = {
    height: 100,
    width: 100
};

global.window = Object.assign(window, {
    innerHeight: mocks.windowHeight,
    innerWidth: mocks.windowWidth
});

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
                }),
                top = Constructor.getElementTop(),
                topThreshold = Constructor.getElementTop(null, threshold);

            spyOffset.mockRestore();

            expect(top).toBe(offsetTop);
            expect(topThreshold).toBe(offsetTop - threshold);
        });
    });

    describe('getElementBottom()', () => {
        it('should return element\'s bottom + threshold', () => {
            const top = 100,
                height = 50,
                threshold = 50,
                mockGetElementTop = jest.spyOn(Constructor, 'getElementTop').mockImplementation(
                    () => top
                ),
                mockGetElementHeight = jest.spyOn(Constructor, 'getElementHeight').mockImplementation(
                    () => height
                ),
                bottom = Constructor.getElementBottom({}),
                bottomThreshold = Constructor.getElementBottom({}, threshold);

            mockGetElementTop.mockRestore();
            mockGetElementHeight.mockRestore();

            expect(bottom).toBe(top + height);
            expect(bottomThreshold).toBe(top + height + threshold);
        });
    });

    describe('getElementLeft()', () => {
        it('should return element\'s left + threshhold', () => {
            const offsetLeft = 100,
                threshold = 50,
                spyOffset = jest.spyOn($.fn, 'offset').mockImplementation(() => {
                    return { left: offsetLeft };
                }),
                left = Constructor.getElementLeft(),
                leftThreshold = Constructor.getElementLeft(null, threshold);

            spyOffset.mockRestore();

            expect(left).toBe(offsetLeft);
            expect(leftThreshold).toBe(offsetLeft - threshold);
        });
    });

    describe('getElementRight()', () => {
        it('should return element\'s right + threshhold', () => {
            const left = 100,
                width = 50,
                threshold = 50,
                mockGetElementLeft = jest.spyOn(Constructor, 'getElementLeft').mockImplementation(
                    () => left
                ),
                mockGetElementWidth = jest.spyOn(Constructor, 'getElementWidth').mockImplementation(
                    () => width
                ),
                right = Constructor.getElementRight({}),
                leftThreshold = Constructor.getElementRight({}, threshold);

            mockGetElementLeft.mockRestore();
            mockGetElementWidth.mockRestore();

            expect(right).toBe(left + width);
            expect(leftThreshold).toBe(left + width + threshold);
        });
    });

    describe('getElementHeight()', () => {
        it('should return innerHeight when innerHeight is set', () => {
            const height = 420,
                mockElement = { innerHeight: height },
                elementHeight = Constructor.getElementHeight(mockElement);

            expect(elementHeight).toEqual(height);
        });

        it('should return $.fn.height() when innerHeight is not set', () => {
            const height = 420,
                mockElement = {},
                mockHeight = jest.spyOn($.fn, 'height').mockImplementation(
                    () => 420
                ),
                elementHeight = Constructor.getElementHeight(mockElement);

            mockHeight.mockRestore();

            expect(elementHeight).toBe(height);
        });
    });

    describe('getElementWidth()', () => {
        it('should return innerWidth when innerWidth is set', () => {
            const width = 420,
                mockWindow = { innerWidth: width },
                elementWidth = Constructor.getElementWidth(mockWindow);

            expect(elementWidth).toEqual(width);
        });

        it('should return $.fn.width() when innerWidth is not set', () => {
            const width = 420,
                mockWindow = {},
                mockWidth = jest.spyOn($.fn, 'width').mockImplementation(
                    () => width
                ),
                elementWidth = Constructor.getElementWidth(mockWindow);

            mockWidth.mockRestore();

            expect(elementWidth).toBe(width);
        });
    });

    describe('getFoldTop()', () => {
        it('should return fold top', () => {
            const scrollTop = 25,
                mockScrollTop = jest.spyOn($.fn, 'scrollTop').mockImplementation(
                    () => scrollTop
                ),
                foldTop = Constructor.getFoldTop(window);

            mockScrollTop.mockRestore();

            expect(foldTop).toBe(scrollTop);
        });
    });

    describe('getFoldBottom()', () => {
        it('should return fold bottom', () => {
            const elementHeight = 100,
                foldTop = 25,
                mockGetFoldTop = jest.spyOn(Constructor, 'getFoldTop').mockImplementation(
                    () => foldTop
                ),
                mockGetElementHeight = jest.spyOn(Constructor, 'getElementHeight').mockImplementation(
                    () => elementHeight
                ),
                foldBottom = Constructor.getFoldBottom(null);

            mockGetFoldTop.mockRestore();
            mockGetElementHeight.mockRestore();

            expect(foldBottom).toBe(foldTop + elementHeight);
        });
    });

    describe('getFoldLeft()', () => {
        it('should return fold left', () => {
            const scrollLeft = 25,
                mockScrollLeft = jest.spyOn($.fn, 'scrollLeft').mockImplementation(
                    () => scrollLeft
                ),
                foldLeft = Constructor.getFoldLeft(window);

            mockScrollLeft.mockRestore();

            expect(foldLeft).toBe(scrollLeft);
        });
    });

    describe('getFoldRight()', () => {
        it('should return fold right', () => {
            const elementWidth = 100,
                foldLeft = 25,
                mockGetFoldLeft = jest.spyOn(Constructor, 'getFoldLeft').mockImplementation(
                    () => foldLeft
                ),
                mockGetElementWidth = jest.spyOn(Constructor, 'getElementWidth').mockImplementation(
                    () => elementWidth
                ),
                foldRight = Constructor.getFoldRight(null);

            mockGetFoldLeft.mockRestore();
            mockGetElementWidth.mockRestore();

            expect(foldRight).toBe(foldLeft + elementWidth);
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
            const elementTop = 100,
                foldBottom = 50,
                mockGetElementTop = jest.spyOn(Constructor, 'getElementTop')
                .mockImplementation(() => elementTop),
                mockGetFoldBottom = jest.spyOn(Constructor, 'getFoldBottom')
                    .mockImplementation(() => foldBottom),
                $belowTheFold = $.belowthefold(null, {threshold: 0});

            mockGetElementTop.mockRestore();
            mockGetFoldBottom.mockRestore();

            expect($belowTheFold).toBe(true);
        });

        it('should return false when not below the fold', () => {
            const elementTop = 50,
                foldBottom = 100,
                mockGetElementTop = jest.spyOn(Constructor, 'getElementTop')
                .mockImplementation(() => elementTop),
                mockGetFoldBottom = jest.spyOn(Constructor, 'getFoldBottom')
                    .mockImplementation(() => foldBottom),
                $belowTheFold = $.belowthefold(null, {threshold: 0});

            mockGetElementTop.mockRestore();
            mockGetFoldBottom.mockRestore();

            expect($belowTheFold).toBe(false);
        });
    });

    describe('$.rightoffold()', () => {
        it('should return true when right of the fold', () => {
            const elementLeft = 100,
                foldRight = 50,
                mockGetElementLeft = jest.spyOn(Constructor, 'getElementLeft')
                .mockImplementation(() => elementLeft),
                mockGetFoldRight = jest.spyOn(Constructor, 'getFoldRight')
                    .mockImplementation(() => foldRight),
                $rightOfFold = $.rightoffold(null, {threshold: 0});

            mockGetElementLeft.mockRestore();
            mockGetFoldRight.mockRestore();

            expect($rightOfFold).toBe(true);
        });

        it('should return false when not right of the fold', () => {
            const elementLeft = 50,
                foldRight = 100,
                mockGetElementLeft = jest.spyOn(Constructor, 'getElementLeft')
                .mockImplementation(() => elementLeft),
                mockGetFoldRight = jest.spyOn(Constructor, 'getFoldRight')
                    .mockImplementation(() => foldRight),
                $rightOfFold = $.rightoffold(null, {threshold: 0});

            mockGetElementLeft.mockRestore();
            mockGetFoldRight.mockRestore();

            expect($rightOfFold).toBe(false);
        });
    });

    describe('$.abovethetop()', () => {
        it('should return true when above the top', () => {
            const mockGetElementBottom = jest.spyOn(Constructor, 'getElementBottom')
                .mockImplementation(() => 100),
                mockGetFoldTop = jest.spyOn(Constructor, 'getFoldTop')
                    .mockImplementation(() => 50),
                $abovethetop = $.abovethetop(null, {threshold: 0});

                mockGetElementBottom.mockRestore();
                mockGetFoldTop.mockRestore();

            expect($abovethetop).toBe(true);
        });

        it('should return false when not below the fold', () => {
            const mockGetElementBottom = jest.spyOn(Constructor, 'getElementBottom')
                .mockImplementation(() => 50),
                mockGetFoldTop = jest.spyOn(Constructor, 'getFoldTop')
                    .mockImplementation(() => 100),
                $abovethetop = $.abovethetop(null, {threshold: 0});

            mockGetElementBottom.mockRestore();
            mockGetFoldTop.mockRestore();

            expect($abovethetop).toBe(false);
        });
    });

    describe('$.leftobegin()', () => {
        it('should return true when left of the beginning', () => {
            const mockGetElementRight = jest.spyOn(Constructor, 'getElementRight')
                .mockImplementation(() => 100),
                mockGetFoldLeft = jest.spyOn(Constructor, 'getFoldLeft')
                    .mockImplementation(() => 50),
                $leftofbegin = $.leftofbegin(null, {threshold: 0});

            mockGetElementRight.mockRestore();
            mockGetFoldLeft.mockRestore();

            expect($leftofbegin).toBe(true);
        });

        it('should return false when not below the fold', () => {
            const mockGetElementRight = jest.spyOn(Constructor, 'getElementRight')
                .mockImplementation(() => 50),
                mockGetFoldLeft = jest.spyOn(Constructor, 'getFoldLeft')
                    .mockImplementation(() => 100),
                $leftofbegin = $.leftofbegin(null, {threshold: 0});

            mockGetElementRight.mockRestore();
            mockGetFoldLeft.mockRestore();

            expect($leftofbegin).toBe(false);
        });
    });
});
