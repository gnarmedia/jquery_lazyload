/* Add dependencies */
const jQuery = require('jquery');

global.jQuery = global.$ = jQuery;

require('../jquery.lazyload');

const defaultOptions = {
    threshold: 0,
    placeholder:
        'data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=',
    failurelimit: 'mock failure limit'
    
};

describe('general', () => {
    it('should add lazyload() function to global {jQuery} object', () => {
        expect(typeof $.fn.lazyload).toBe('function');
    });
});

describe('$.fn.lazyload()', () => {
    it("should add 'appear' listener", () => {
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
    const Constructor = $.fn.lazyload.Constructor.prototype,
        mockedWidth = 50;

    function mockFunction(obj, func, prop) {
        return jest.spyOn(obj, func).mockImplementation(() => prop);
    }

    function mockOffset(property, value) {
        const offsetObj = {};
        offsetObj[property] = value;
        return mockFunction($.fn, 'offset', offsetObj);
    }

    function mockWidth(property) {
        return mockFunction($.fn, 'width', property);
    }

    function mockHeight(property) {
        return mockFunction($.fn, 'height', property);
    }

    function mockScrollTop(property) {
        return mockFunction($.fn, 'scrollTop', property);
    }

    function mockScrollLeft(property) {
        return mockFunction($.fn, 'scrollLeft', property);
    }

    function mockGetElementTop(property) {
        return mockFunction(Constructor, 'getElementTop', property);
    }

    function mockGetElementBottom(property) {
        return mockFunction(Constructor, 'getElementBottom', property);
    }

    function mockGetElementLeft(property) {
        return mockFunction(Constructor, 'getElementLeft', property);
    }

    function mockGetElementRight(property) {
        return mockFunction(Constructor, 'getElementRight', property);
    }

    function mockGetElementHeight(property) {
        return mockFunction(Constructor, 'getElementHeight', property);
    }

    function mockGetElementWidth(property) {
        return mockFunction(Constructor, 'getElementWidth', property);
    }

    function mockGetFoldTop(property) {
        return mockFunction(Constructor, 'getFoldTop', property);
    }

    function mockGetFoldBottom(property) {
        return mockFunction(Constructor, 'getFoldBottom', property);
    }

    function mockGetFoldLeft(property) {
        return mockFunction(Constructor, 'getFoldLeft', property);
    }

    function mockGetFoldRight(property) {
        return mockFunction(Constructor, 'getFoldRight', property);
    }

    function mockIsAboveVisibleArea(property) {
        return mockFunction(Constructor, 'isAboveVisibleArea', property);
    }

    function mockIsBelowVisibleArea(property) {
        return mockFunction(Constructor, 'isBelowVisibleArea', property);
    }

    function mockIsLeftOfVisibleArea(property) {
        return mockFunction(Constructor, 'isLeftOfVisibleArea', property);
    }

    function mockIsRightOfVisibleArea(property) {
        return mockFunction(Constructor, 'isRightOfVisibleArea', property);
    }

    function mockIsInVisibleArea(property) {
        return mockFunction(Constructor, 'isInVisibleArea', property);
    }

    it('should add lazyload().Constructor object to $.fn.lazyload()', () => {
        expect(typeof $.fn.lazyload.Constructor).toBe('function');
    });

    describe('general helper functions', () => {
        describe('convertDeprecatedOptions()', () => {
            it('should convert deprecated options to current names', () => {
                const failure_limit = 'mock failure limit',
                    effect_speed = 'mock effect speed',
                    mockOptions = {
                        failurelimit: failure_limit,
                        effectspeed: effect_speed
                    },
                    options = Constructor.convertDeprecatedOptions(mockOptions);

                expect(options.failurelimit).toBeUndefined();
                expect(options.effectspeed).toBeUndefined();
                expect(options.failure_limit).toBe(failure_limit);
                expect(options.effect_speed).toBe(effect_speed);
            });
        });
    });

    describe('private element position functions', () => {
        const threshold = 50,
            mockedPosition = 100,
            mockedDimension = 50;

        describe('getElementTop()', () => {
            it("should return element's top + threshhold", () => {
                const offset_Mock = mockOffset('top', mockedPosition),
                    top = Constructor.getElementTop(),
                    topWithThreshold = Constructor.getElementTop(
                        null,
                        threshold
                    );

                offset_Mock.mockRestore();

                expect(top).toBe(mockedPosition);
                expect(topWithThreshold).toBe(mockedPosition - threshold);
            });
        });

        describe('getElementBottom()', () => {
            it("should return element's bottom + threshold", () => {
                const getElementTop_Mock = mockGetElementTop(mockedPosition),
                    getElementHeight_Mock = mockGetElementHeight(
                        mockedDimension
                    ),
                    bottom = Constructor.getElementBottom({}),
                    bottomWithThreshold = Constructor.getElementBottom(
                        {},
                        threshold
                    );

                getElementTop_Mock.mockRestore();
                getElementHeight_Mock.mockRestore();

                expect(bottom).toBe(mockedPosition + mockedDimension);
                expect(bottomWithThreshold).toBe(
                    mockedPosition + mockedDimension + threshold
                );
            });
        });

        describe('getElementLeft()', () => {
            it("should return element's left + threshhold", () => {
                const offset_Mock = mockOffset('left', mockedPosition),
                    left = Constructor.getElementLeft(),
                    leftWithThreshold = Constructor.getElementLeft(
                        null,
                        threshold
                    );

                offset_Mock.mockRestore();

                expect(left).toBe(mockedPosition);
                expect(leftWithThreshold).toBe(mockedPosition - threshold);
            });
        });

        describe('getElementRight()', () => {
            it("should return element's right + threshhold", () => {
                const getElementLeft_Mock = mockGetElementLeft(mockedPosition),
                    getElementWidth_Mock = mockGetElementWidth(mockedDimension),
                    right = Constructor.getElementRight({}),
                    rightWithThreshold = Constructor.getElementRight(
                        {},
                        threshold
                    );

                getElementLeft_Mock.mockRestore();
                getElementWidth_Mock.mockRestore();

                expect(right).toBe(mockedPosition + mockedDimension);
                expect(rightWithThreshold).toBe(
                    mockedPosition + mockedDimension + threshold
                );
            });
        });
    });

    describe('private element dimension functions', () => {
        const mockDimension = 420;

        describe('getElementWidth()', () => {
            it('should return innerWidth when innerWidth is set', () => {
                const mockWindow = { innerWidth: mockDimension },
                    elementWidth = Constructor.getElementWidth(mockWindow);

                expect(elementWidth).toEqual(mockDimension);
            });

            it('should return $.fn.width() when innerWidth is not set', () => {
                const mockWindow = {},
                    width_Mock = mockWidth(mockDimension),
                    elementWidth = Constructor.getElementWidth(mockWindow);

                width_Mock.mockRestore();

                expect(elementWidth).toBe(mockDimension);
            });
        });

        describe('getElementHeight()', () => {
            it('should return innerHeight when innerHeight is set', () => {
                const mockElement = { innerHeight: mockDimension },
                    elementHeight = Constructor.getElementHeight(mockElement);

                expect(elementHeight).toEqual(mockDimension);
            });

            it('should return $.fn.height() when innerHeight is not set', () => {
                const mockElement = {},
                    height_Mock = mockHeight(mockDimension),
                    elementHeight = Constructor.getElementHeight(mockElement);

                height_Mock.mockRestore();

                expect(elementHeight).toBe(mockDimension);
            });
        });
    });

    describe('private fold boundaries functions', () => {
        const mockedPosition = 25,
            mockedDimension = 100;

        describe('getFoldTop()', () => {
            it('should return fold top', () => {
                const scrollTop_Mock = mockScrollTop(mockedPosition),
                    offset_Mock = mockOffset('top', mockedPosition),
                    foldTop = Constructor.getFoldTop(window),
                    foldTopCustom = Constructor.getFoldTop();

                scrollTop_Mock.mockRestore();
                offset_Mock.mockRestore();

                expect(foldTop).toBe(mockedPosition);
                expect(foldTopCustom).toBe(mockedPosition);
            });
        });

        describe('getFoldBottom()', () => {
            it('should return fold bottom', () => {
                const getFoldTop_Mock = mockGetFoldTop(mockedPosition),
                    getElementHeight_Mock = mockGetElementHeight(
                        mockedDimension
                    ),
                    foldBottom = Constructor.getFoldBottom(null);

                getFoldTop_Mock.mockRestore();
                getElementHeight_Mock.mockRestore();

                expect(foldBottom).toBe(mockedPosition + mockedDimension);
            });
        });

        describe('getFoldLeft()', () => {
            it('should return fold left', () => {
                const scrollLeft_Mock = mockScrollLeft(mockedPosition),
                    offset_Mock = mockOffset('left', mockedPosition),
                    foldLeft = Constructor.getFoldLeft(window),
                    foldLeftCustom = Constructor.getFoldLeft();

                scrollLeft_Mock.mockRestore();
                offset_Mock.mockRestore();

                expect(foldLeft).toBe(mockedPosition);
                expect(foldLeftCustom).toBe(mockedPosition);
            });
        });

        describe('getFoldRight()', () => {
            it('should return fold right', () => {
                const getFoldLeft_Mock = mockGetFoldLeft(mockedPosition),
                    getElementWidth_Mock = mockGetElementWidth(mockedDimension),
                    foldRight = Constructor.getFoldRight(null);

                getFoldLeft_Mock.mockRestore();
                getElementWidth_Mock.mockRestore();

                expect(foldRight).toBe(mockedPosition + mockedDimension);
            });
        });
    });

    describe('getContainer()', () => {
        it('should return window', () => {
            const customContainer = 'test';
            (container = Constructor.getContainer()),
                (containerCustom = Constructor.getContainer(customContainer));
            expect(container).toBe(window);
            expect(containerCustom).toBe(customContainer);
        });
    });

    describe('private relative-to-visible-area functions', () => {
        const Constructor = $.fn.lazyload.Constructor.prototype,
            mockedElementPosition = 100,
            mockedAdjustment = 50,
            threshold = { threshold: 0 };

        describe('isAboveVisibleArea()', () => {
            it('should return true when above the visible area', () => {
                const getFoldTop_Mock = mockGetFoldTop(mockedElementPosition),
                    getElementBottom_Mock = mockGetElementBottom(
                        mockedElementPosition + 50
                    ),
                    isAboveVisibleArea = Constructor.isAboveVisibleArea(
                        null,
                        threshold
                    );

                getElementBottom_Mock.mockRestore();
                getFoldTop_Mock.mockRestore();

                expect(isAboveVisibleArea).toBe(true);
            });

            it('should return false when not above the visible area', () => {
                const getFoldTop_Mock = mockGetFoldTop(mockedElementPosition),
                    getElementBottom_Mock = mockGetElementBottom(
                        mockedElementPosition - 50
                    ),
                    isAboveVisibleArea = Constructor.isAboveVisibleArea(
                        null,
                        threshold
                    );

                getElementBottom_Mock.mockRestore();
                getFoldTop_Mock.mockRestore();

                expect(isAboveVisibleArea).toBe(false);
            });
        });

        describe('isBelowVisibleArea()', () => {
            it('should return true when below the visible area', () => {
                const getFoldBottom_Mock = mockGetFoldBottom(
                        mockedElementPosition
                    ),
                    getElementTop_Mock = mockGetElementTop(
                        mockedElementPosition + mockedAdjustment
                    ),
                    isBelowVisibleArea = Constructor.isBelowVisibleArea(
                        null,
                        threshold
                    );

                getFoldBottom_Mock.mockRestore();
                getElementTop_Mock.mockRestore();

                expect(isBelowVisibleArea).toBe(true);
            });

            it('should return false when not below the visible area', () => {
                const getFoldBottom_Mock = mockGetFoldBottom(
                        mockedElementPosition
                    ),
                    getElementTop_Mock = mockGetElementTop(
                        mockedElementPosition - mockedAdjustment
                    ),
                    isBelowVisibleArea = Constructor.isBelowVisibleArea(
                        null,
                        threshold
                    );

                getFoldBottom_Mock.mockRestore();
                getElementTop_Mock.mockRestore();

                expect(isBelowVisibleArea).toBe(false);
            });
        });

        describe('isLeftOfVisibleArea()', () => {
            it('should return true when left of the visible area', () => {
                const getFoldLeft_Mock = mockGetFoldLeft(mockedElementPosition),
                    getElementRight_Mock = mockGetElementRight(
                        mockedElementPosition + mockedAdjustment
                    ),
                    isLeftOfVisibleArea = Constructor.isLeftOfVisibleArea(
                        null,
                        threshold
                    );

                getFoldLeft_Mock.mockRestore();
                getElementRight_Mock.mockRestore();

                expect(isLeftOfVisibleArea).toBe(true);
            });

            it('should return false when not left of the visible area', () => {
                const getFoldLeft_Mock = mockGetFoldLeft(mockedElementPosition),
                    getElementRight_Mock = mockGetElementRight(
                        mockedElementPosition - mockedAdjustment
                    ),
                    isLeftOfVisibleArea = Constructor.isLeftOfVisibleArea(
                        null,
                        threshold
                    );

                getFoldLeft_Mock.mockRestore();
                getElementRight_Mock.mockRestore();

                expect(isLeftOfVisibleArea).toBe(false);
            });
        });

        describe('isRightOfVisibleArea()', () => {
            it('should return true when right of the visible area', () => {
                const getFoldRight_Mock = mockGetFoldRight(
                        mockedElementPosition
                    ),
                    getElementLeft_Mock = mockGetElementLeft(
                        mockedElementPosition + mockedAdjustment
                    ),
                    isRightOfVisibleArea = Constructor.isRightOfVisibleArea(
                        null,
                        threshold
                    );

                getFoldRight_Mock.mockRestore();
                getElementLeft_Mock.mockRestore();

                expect(isRightOfVisibleArea).toBe(true);
            });

            it('should return false when not right of the visible area', () => {
                const getFoldRight_Mock = mockGetFoldRight(
                        mockedElementPosition
                    ),
                    getElementLeft_Mock = mockGetElementLeft(
                        mockedElementPosition - mockedAdjustment
                    ),
                    isRightOfVisibleArea = Constructor.isRightOfVisibleArea(
                        null,
                        threshold
                    );

                getFoldRight_Mock.mockRestore();
                getElementLeft_Mock.mockRestore();

                expect(isRightOfVisibleArea).toBe(false);
            });
        });

        describe('isInVisibleArea()', () => {
            it('should return true when in visible area', () => {
                const isAboveVisibleArea_Mock = mockIsAboveVisibleArea(false),
                    isBelowVisibleArea_Mock = mockIsBelowVisibleArea(false),
                    isLeftOfVisibleArea_Mock = mockIsLeftOfVisibleArea(false),
                    isRightOfVisibleArea_Mock = mockIsRightOfVisibleArea(false),
                    isInVisibleArea = Constructor.isInVisibleArea(
                        {},
                        threshold
                    );

                isAboveVisibleArea_Mock.mockRestore();
                isBelowVisibleArea_Mock.mockRestore();
                isLeftOfVisibleArea_Mock.mockRestore();
                isRightOfVisibleArea_Mock.mockRestore();

                expect(isInVisibleArea).toBe(true);
            });
        });
    });

    describe('custom selectors', () => {
        const $expr = $.expr[':'],
            mockedValue = true;

        describe('below-the-fold', () => {
            it("should return mocked 'true'", () => {
                const isBelowVisibleArea_Mock = mockIsBelowVisibleArea(
                        mockedValue
                    ),
                    belowTheFold = $expr['below-the-fold']();

                isBelowVisibleArea_Mock.mockRestore();
                expect(isBelowVisibleArea_Mock).toBeCalled();
                expect(belowTheFold).toBe(mockedValue);
            });
        });

        describe('above-the-top', () => {
            it("should return mocked 'false'", () => {
                const isBelowVisibleArea_Mock = mockIsBelowVisibleArea(
                        mockedValue
                    ),
                    aboveTheTop = $expr['above-the-top']();

                isBelowVisibleArea_Mock.mockRestore();
                expect(isBelowVisibleArea_Mock).toBeCalled();
                expect(aboveTheTop).toBe(!mockedValue);
            });
        });

        describe('right-of-screen', () => {
            it("should return mocked 'true'", () => {
                const isRightOfVisibleArea_Mock = mockIsRightOfVisibleArea(
                        mockedValue
                    ),
                    rightOfScreen = $expr['right-of-screen']();

                isRightOfVisibleArea_Mock.mockRestore();
                expect(isRightOfVisibleArea_Mock).toBeCalled();
                expect(rightOfScreen).toBe(mockedValue);
            });
        });

        describe('left-of-screen', () => {
            it("should return mocked 'false'", () => {
                const isRightOfVisibleArea_Mock = mockIsRightOfVisibleArea(
                        mockedValue
                    ),
                    leftOfScreen = $expr['left-of-screen']();

                isRightOfVisibleArea_Mock.mockRestore();
                expect(isRightOfVisibleArea_Mock).toBeCalled();
                expect(leftOfScreen).toBe(!mockedValue);
            });
        });

        describe('in-viewport', () => {
            it("should return mocked 'true'", () => {
                const isInVisibleArea_Mock = mockIsInVisibleArea(mockedValue),
                    inViewport = $expr['in-viewport']();

                isInVisibleArea_Mock.mockRestore();
                expect(isInVisibleArea_Mock).toBeCalled();
                expect(inViewport).toBe(mockedValue);
            });
        });

        describe('deprecated selectors', () => {
            describe('above-the-fold', () => {
                it("should return mocked 'false'", () => {
                    const isBelowVisibleArea_Mock = mockIsBelowVisibleArea(
                            mockedValue
                        ),
                        aboveTheFold = $expr['above-the-fold']();

                    isBelowVisibleArea_Mock.mockRestore();
                    expect(isBelowVisibleArea_Mock).toBeCalled();
                    expect(aboveTheFold).toBe(!mockedValue);
                });
            });

            describe('right-of-fold', () => {
                it("should return mocked 'true'", () => {
                    const isRightOfVisibleArea_Mock = mockIsRightOfVisibleArea(
                            mockedValue
                        ),
                        rightOfFold = $expr['right-of-fold']();

                    isRightOfVisibleArea_Mock.mockRestore();
                    expect(isRightOfVisibleArea_Mock).toBeCalled();
                    expect(rightOfFold).toBe(mockedValue);
                });
            });

            describe('left-of-fold', () => {
                it("should return mocked 'false'", () => {
                    const isRightOfVisibleArea_Mock = mockIsRightOfVisibleArea(
                            mockedValue
                        ),
                        leftOfFold = $expr['left-of-fold']();

                    isRightOfVisibleArea_Mock.mockRestore();
                    expect(isRightOfVisibleArea_Mock).toBeCalled();
                    expect(leftOfFold).toBe(!mockedValue);
                });
            });
        });
    });
});
