/* Add dependencies */

global.jQuery = global.$ = require('jquery');

describe('general', () => {
    it('should add lazyload() function to global {jQuery} object', () => {
        // this test is worthless
        require('../jquery.lazyload');

        expect(typeof $.fn.lazyload).toBe('function');
    });

    describe('placeholder', () => {
        beforeAll(() => {
            require('../jquery.lazyload');
        });

        it('should set default if no src', () => {
            let $img;

            document.body.innerHTML = '<img />';
            $img = $('img');
            $img.lazyload();

            expect($img.attr('src')).toEqual(
                'data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs='
            );
        });

        it('should set custom if no src', () => {
            let $img;

            document.body.innerHTML = '<img />';
            $img = $('img');
            $img.lazyload({ placeholder: 'custom-placeholder.png' });

            expect($img.attr('src')).toEqual('custom-placeholder.png');
        });

        it('should nothing if not img', () => {
            let $video;

            document.body.innerHTML = '<video>';
            $video = $('video');
            $video.lazyload();

            expect($video.attr('src')).toBeUndefined();
        });
    });

    describe('event listeners', () => {
        beforeAll(() => {
            require('../jquery.lazyload');
        });

        it("should add 'appear'", () => {
            let $img;

            document.body.innerHTML = '<img />';
            $img = $('<img>');
            $img.lazyload();

            expect(jQuery._data($img[0], 'events')).toHaveProperty('appear');
        });

        it('should add resize', () => {
            let $img;

            document.body.innerHTML = '<img />';
            $img = $('<img>');
            $img.lazyload();

            expect(jQuery._data(window, 'events')).toHaveProperty('resize');
        });

        it('should add custom event', () => {
            let $img;

            document.body.innerHTML = '<img />';
            $img = $('<img>');
            $img.lazyload({
                event: 'custom'
            });

            expect(jQuery._data($img[0], 'events')).toHaveProperty('custom');
        });
    });

    describe('convenience methods', () => {
        function mockFunction(obj, func, prop) {
            return jest.spyOn(obj, func).mockImplementation(() => prop);
        }

        function mockFunctionOnce(obj, func, prop) {
            return jest.spyOn(obj, func).mockImplementationOnce(() => prop);
        }

        describe('$.belowthefold()', () => {
            describe('when container is undefined', () => {
                describe('when element is below the fold', () => {
                    it('should return true when no threshold', () => {
                        let $img, result;

                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 780 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.belowthefold($img, { threshold: 0 });

                        expect(result).toBe(true);
                    });

                    it('should return true when threshold is less than distance below the fold', () => {
                        let $img, result;

                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 780 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.belowthefold($img, { threshold: 5 });

                        expect(result).toBe(true);
                    });

                    it('should return false when threshold is more than distance below the fold', () => {
                        let $img, result;

                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 780 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.belowthefold($img, { threshold: 20 });

                        expect(result).toBe(false);
                    });
                });

                describe('when element is not below the fold', () => {
                    it('should return false', () => {
                        let $img, result;

                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 760 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.belowthefold($img, { threshold: 0 });

                        expect(result).toBe(false);
                    });
                });
            });

            describe('when container is window', () => {
                describe('when innerHeight is set', () => {
                    describe('when element is below the fold', () => {
                        it('should return true when no threshold', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'offset', { top: 780 });

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.belowthefold($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(true);
                        });

                        it('should return true when threshold is less than distance below the fold', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'offset', { top: 780 });

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.belowthefold($img, {
                                container: window,
                                threshold: 5
                            });

                            expect(result).toBe(true);
                        });

                        it('should return false when threshold is more than distance below the fold', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'offset', { top: 780 });

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.belowthefold($img, {
                                container: window,
                                threshold: 20
                            });

                            expect(result).toBe(false);
                        });
                    });

                    describe('when element is not below the fold', () => {
                        it('should return false', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'offset', { top: 760 });

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.belowthefold($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(false);
                        });
                    });
                });

                describe('when innerHeight is not set', () => {
                    beforeAll(() => {
                        window._innerHeight = window.innerHeight;
                        delete window.innerHeight;
                    });
                    
                    afterAll(() => {
                        window.innerHeight = window._innerHeight;
                        delete window._innerHeight;
                    });

                    describe('when element is below the fold', () => {
                        it('should return true when no threshold', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'offset', { top: 768 });
                            // mock container height
                            mockFunctionOnce($.fn, 'height', 768);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.belowthefold($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(true);
                        });

                        it('should return true when threshold is less than distance below the fold', () => {
                            let $img, result;

                            mockFunctionOnce($.fn, 'offset', { top: 780 });
                            mockFunctionOnce($.fn, 'height', 768);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.belowthefold($img, {
                                container: window,
                                threshold: 5
                            });

                            expect(result).toBe(true);
                        });

                        it('should return false when threshold is more than distance below the fold', () => {
                            let $img, result;

                            mockFunctionOnce($.fn, 'offset', { top: 780 });
                            mockFunctionOnce($.fn, 'height', 768);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.belowthefold($img, {
                                container: window,
                                threshold: 20
                            });

                            expect(result).toBe(false);
                        });
                    });

                    describe('when element is not below the fold', () => {
                        it('should return false', () => {
                            let $img, result;

                            mockFunctionOnce($.fn, 'offset', { top: 760 });
                            mockFunctionOnce($.fn, 'height', 768);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.belowthefold($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(false);
                        });
                    });
                });
            });
            
            describe('when container is custom', () => {
                describe('when element is below the fold', () => {
                    it('should return true when no threshold', () => {
                        let $img, result;

                        /* have to mock the second instance */
                        mockFunctionOnce($.fn, 'offset', { top: 0 });
                        mockFunctionOnce($.fn, 'offset', { top: 768 });
                        mockFunctionOnce($.fn, 'height', 768);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.belowthefold($img, {
                            container: 'custom',
                            threshold: 0
                        });

                        expect(result).toBe(true);
                    });

                    it('should return true when threshold is less than distance below the fold', () => {
                        let $img, result;
                        
                        mockFunctionOnce($.fn, 'offset', { top: 0 });
                        mockFunctionOnce($.fn, 'offset', { top: 780 });
                        mockFunctionOnce($.fn, 'height', 768);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.belowthefold($img, {
                            container: 'custom',
                            threshold: 5
                        });

                        expect(result).toBe(true);
                    });

                    it('should return false when threshold is more than distance below the fold', () => {
                        let $img, result;

                        mockFunctionOnce($.fn, 'offset', { top: 0 });
                        mockFunctionOnce($.fn, 'offset', { top: 780 });
                        mockFunctionOnce($.fn, 'height', 768);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.belowthefold($img, {
                            container: 'custom',
                            threshold: 20
                        });

                        expect(result).toBe(false);
                    });
                });

                describe('when element is not below the fold', () => {
                    it('should return false', () => {
                        let $img, result;

                        mockFunctionOnce($.fn, 'offset', { top: 760 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.belowthefold($img, {
                            container: window,
                            threshold: 0
                        });

                        expect(result).toBe(false);
                    });
                });
            });
        });

        describe('$.abovethetop()', () => {
            describe('when container is undefined', () => {
                describe('when element is above the top', () => {
                    it('should return true when no threshold', () => {
                        let $img, result;

                        // mock container top
                        mockFunctionOnce($.fn, 'scrollTop', 768);
                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 740 });
                        // mock element height
                        mockFunctionOnce($.fn, 'height', 20);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.abovethetop($img, { threshold: 0 });

                        expect(result).toBe(true);
                    });

                    it('should return true when threshold is less than distance above the top', () => {
                        let $img, result;

                        // mock container top
                        mockFunctionOnce($.fn, 'scrollTop', 768);
                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 740 });
                        // mock element height
                        mockFunctionOnce($.fn, 'height', 20);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.abovethetop($img, { threshold: 5 });

                        expect(result).toBe(true);
                    });

                    it('should return false when threshold is more than distance above the top', () => {
                        let $img, result;

                        // mock container top
                        mockFunctionOnce($.fn, 'scrollTop', 768);
                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 740 });
                        // mock element height
                        mockFunctionOnce($.fn, 'height', 20);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.abovethetop($img, { threshold: 20 });

                        expect(result).toBe(false);
                    });
                });

                describe('when element is not above the top', () => {
                    it('should return false', () => {
                        let $img, result;

                        // mock container top
                        mockFunctionOnce($.fn, 'scrollTop', 768);
                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 750 });
                        // mock element height
                        mockFunctionOnce($.fn, 'height', 20);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.abovethetop($img, { threshold: 0 });

                        expect(result).toBe(false);
                    });
                });
            });

            describe('when container is window', () => {
                describe('when innerHeight is set', () => {
                    describe('when element is above the top', () => {
                        it('should return true when no threshold', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'scrollTop', 768);
                            // mock element top
                            mockFunctionOnce($.fn, 'offset', { top: 740 });
                            // mock element height
                            mockFunctionOnce($.fn, 'height', 20);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.abovethetop($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(true);
                        });

                        it('should return true when threshold is less than distance above the top', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'scrollTop', 768);
                            // mock element top
                            mockFunctionOnce($.fn, 'offset', { top: 740 });
                            // mock element height
                            mockFunctionOnce($.fn, 'height', 20);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.abovethetop($img, {
                                container: window,
                                threshold: 5
                            });

                            expect(result).toBe(true);
                        });

                        it('should return false when threshold is more than distance above the top', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'scrollTop', 768);
                            // mock element top
                            mockFunctionOnce($.fn, 'offset', { top: 740 });
                            // mock element height
                            mockFunctionOnce($.fn, 'height', 20);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.abovethetop($img, {
                                container: window,
                                threshold: 20
                            });

                            expect(result).toBe(false);
                        });
                    });

                    describe('when element is not above the top', () => {
                        it('should return false', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'scrollTop', 768);
                            // mock element top
                            mockFunctionOnce($.fn, 'offset', { top: 750 });
                            // mock element height
                            mockFunctionOnce($.fn, 'height', 20);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.abovethetop($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(false);
                        });
                    });
                });

                describe('when innerHeight is not set', () => {
                    beforeAll(() => {
                        window._innerHeight = window.innerHeight;
                        delete window.innerHeight;
                    });
                    
                    afterAll(() => {
                        window.innerHeight = window._innerHeight;
                        delete window._innerHeight;
                    });

                    describe('when element is above the top', () => {
                        it('should return true when no threshold', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'scrollTop', 768);
                            // mock element top
                            mockFunctionOnce($.fn, 'offset', { top: 740 });
                            // mock element height
                            mockFunctionOnce($.fn, 'height', 20);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.abovethetop($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(true);
                        });

                        it('should return true when threshold is less than distance above the top', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'scrollTop', 768);
                            // mock element top
                            mockFunctionOnce($.fn, 'offset', { top: 740 });
                            // mock element height
                            mockFunctionOnce($.fn, 'height', 20);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.abovethetop($img, {
                                container: window,
                                threshold: 5
                            });

                            expect(result).toBe(true);
                        });

                        it('should return true when threshold is more than distance above the top', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'scrollTop', 768);
                            // mock element top
                            mockFunctionOnce($.fn, 'offset', { top: 740 });
                            // mock element height
                            mockFunctionOnce($.fn, 'height', 20);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.abovethetop($img, {
                                container: window,
                                threshold: 20
                            });

                            expect(result).toBe(false);
                        });
                    });

                    describe('when element is not above the top', () => {
                        it('should return false', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'scrollTop', 768);
                            // mock element top
                            mockFunctionOnce($.fn, 'offset', { top: 750 });
                            // mock element height
                            mockFunctionOnce($.fn, 'height', 20);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.abovethetop($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(false);
                        });
                    });
                });
            });
            
            describe('when container is custom', () => {
                describe('when element is above the top', () => {
                    it('should return true when no threshold', () => {
                        let $img, result;

                        // mock container top
                        mockFunctionOnce($.fn, 'offset', { top: 780 });
                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 750 });
                        // mock element height
                        mockFunctionOnce($.fn, 'height', 20);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.abovethetop($img, {
                            container: 'custom',
                            threshold: 0
                        });

                        expect(result).toBe(true);
                    });

                    it('should return true when threshold is less than distance above the top', () => {
                        let $img, result;

                        // mock container top
                        mockFunctionOnce($.fn, 'offset', { top: 780 });
                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 750 });
                        // mock element height
                        mockFunctionOnce($.fn, 'height', 20);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.abovethetop($img, {
                            container: 'custom',
                            threshold: 5
                        });

                        expect(result).toBe(true);
                    });

                    it('should return false when threshold is more than distance above the top', () => {
                        let $img, result;

                        // mock container top
                        mockFunctionOnce($.fn, 'offset', { top: 780 });
                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 750 });
                        // mock element height
                        mockFunctionOnce($.fn, 'height', 20);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.abovethetop($img, {
                            container: 'custom',
                            threshold: 20
                        });

                        expect(result).toBe(false);
                    });
                });

                describe('when element is not above the top', () => {
                    it('should return false', () => {
                        let $img, result;

                        // mock container top
                        mockFunctionOnce($.fn, 'scrollTop', 768);
                        // mock element top
                        mockFunctionOnce($.fn, 'offset', { top: 750 });
                        // mock element height
                        mockFunctionOnce($.fn, 'height', 20);

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.abovethetop($img, {
                            container: window,
                            threshold: 0
                        });

                        expect(result).toBe(false);
                    });
                });
            });
        });

        describe('$.rightoffold()', () => {
            describe('when container is undefined', () => {
                describe('when element is right of the fold', () => {
                    it('should return true when no threshold', () => {
                        let $img, result;

                        // mock container width
                        mockFunctionOnce($.fn, 'width', 1024);
                        // mock element left
                        mockFunctionOnce($.fn, 'offset', { left: 1040 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.rightoffold($img, { threshold: 0 });

                        expect(result).toBe(true);
                    });

                    it('should return true when threshold is less than distance right of the fold', () => {
                        let $img, result;

                        // mock container width
                        mockFunctionOnce($.fn, 'width', 1024);
                        // mock element left
                        mockFunctionOnce($.fn, 'offset', { left: 1040 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.rightoffold($img, { threshold: 5 });

                        expect(result).toBe(true);
                    });

                    it('should return false when threshold is more than distance right of the fold', () => {
                        let $img, result;

                        // mock container width
                        mockFunctionOnce($.fn, 'width', 1024);
                        // mock element left
                        mockFunctionOnce($.fn, 'offset', { left: 1040 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.rightoffold($img, { threshold: 20 });

                        expect(result).toBe(false);
                    });
                });

                describe('when element is not below the fold', () => {
                    it('should return false', () => {
                        let $img, result;

                        // mock container width
                        mockFunctionOnce($.fn, 'width', 1024);
                        // mock container top
                        mockFunctionOnce($.fn, 'offset', { left: 1020 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.rightoffold($img, { threshold: 0 });

                        expect(result).toBe(false);
                    });
                });
            });

            describe('when container is window', () => {
                describe('when innerHeight is not set', () => {
                    describe('when element is below the fold', () => {
                        it('should return true when no threshold', () => {
                            let $img, result;

                            // mock container width
                            mockFunctionOnce($.fn, 'width', 1024);
                            // mock element left
                            mockFunctionOnce($.fn, 'offset', { left: 1040 });

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.rightoffold($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(true);
                        });

                        it('should return true when threshold is less than distance below the fold', () => {
                            let $img, result;

                            // mock container width
                            mockFunctionOnce($.fn, 'width', 1024);
                            // mock element left
                            mockFunctionOnce($.fn, 'offset', { left: 1040 });

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.rightoffold($img, {
                                container: window,
                                threshold: 5
                            });

                            expect(result).toBe(true);
                        });

                        it('should return false when threshold is more than distance below the fold', () => {
                            let $img, result;

                            // mock container width
                            mockFunctionOnce($.fn, 'width', 1024);
                            // mock element left
                            mockFunctionOnce($.fn, 'offset', { left: 1040 });

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.rightoffold($img, {
                                container: window,
                                threshold: 20
                            });

                            expect(result).toBe(false);
                        });
                    });

                    describe('when element is not below the fold', () => {
                        it('should return false', () => {
                            let $img, result;

                            // mock container width
                            mockFunctionOnce($.fn, 'width', 1024);
                            // mock element left
                            mockFunctionOnce($.fn, 'offset', { left: 1020 });

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.rightoffold($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(false);
                        });
                    });
                });

                describe.skip('when innerWidth is not set [rewrite]', () => {
                    beforeAll(() => {
                        window._innerWidth = window.innerWidth;
                        delete window.innerWidth;
                    });
                    
                    afterAll(() => {
                        window.innerWidth = window._innerWidth;
                        delete window._innerWidth;
                    });

                    describe('when element is below the fold', () => {
                        it('should return true when no threshold', () => {
                            let $img, result;

                            // mock container top
                            mockFunctionOnce($.fn, 'offset', { top: 768 });
                            // mock container height
                            mockFunctionOnce($.fn, 'height', 768);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.rightoffold($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(true);
                        });

                        it('should return true when threshold is less than distance below the fold', () => {
                            let $img, result;

                            mockFunctionOnce($.fn, 'offset', { top: 780 });
                            mockFunctionOnce($.fn, 'height', 768);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.rightoffold($img, {
                                container: window,
                                threshold: 5
                            });

                            expect(result).toBe(true);
                        });

                        it('should return false when threshold is more than distance below the fold', () => {
                            let $img, result;

                            mockFunctionOnce($.fn, 'offset', { top: 780 });
                            mockFunctionOnce($.fn, 'height', 768);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.rightoffold($img, {
                                container: window,
                                threshold: 20
                            });

                            expect(result).toBe(false);
                        });
                    });

                    describe('when element is not below the fold', () => {
                        it('should return false', () => {
                            let $img, result;

                            mockFunctionOnce($.fn, 'offset', { top: 760 });
                            mockFunctionOnce($.fn, 'height', 768);

                            document.body.innerHTML = '<img />';
                            $img = $('img');

                            result = $.rightoffold($img, {
                                container: window,
                                threshold: 0
                            });

                            expect(result).toBe(false);
                        });
                    });
                });
            });
            
            describe('when container is custom', () => {
                describe('when element is below the fold', () => {
                    it('should return true when no threshold', () => {
                        let $img, result;

                        // mock container left and width
                        mockFunctionOnce($.fn, 'offset', { left: 0 });
                        mockFunctionOnce($.fn, 'width', 1024);
                        // mock element left
                        mockFunctionOnce($.fn, 'offset', { left: 1040 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.rightoffold($img, {
                            container: 'custom',
                            threshold: 0
                        });

                        expect(result).toBe(true);
                    });

                    it('should return true when threshold is less than distance below the fold', () => {
                        let $img, result;

                        // mock container left and width
                        mockFunctionOnce($.fn, 'offset', { left: 0 });
                        mockFunctionOnce($.fn, 'width', 1024);
                        // mock element left
                        mockFunctionOnce($.fn, 'offset', { left: 1040 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.rightoffold($img, {
                            container: 'custom',
                            threshold: 5
                        });

                        expect(result).toBe(true);
                    });

                    it('should return false when threshold is more than distance below the fold', () => {
                        let $img, result;

                        // mock container left and width
                        mockFunctionOnce($.fn, 'offset', { left: 0 });
                        mockFunctionOnce($.fn, 'width', 1024);
                        // mock element left
                        mockFunctionOnce($.fn, 'offset', { left: 1040 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.rightoffold($img, {
                            container: 'custom',
                            threshold: 20
                        });

                        expect(result).toBe(false);
                    });
                });

                describe('when element is not below the fold', () => {
                    it('should return false', () => {
                        let $img, result;

                        // mock container left and width
                        mockFunctionOnce($.fn, 'offset', { left: 0 });
                        mockFunctionOnce($.fn, 'width', 1024);
                        // mock element left
                        mockFunctionOnce($.fn, 'offset', { left: 1020 });

                        document.body.innerHTML = '<img />';
                        $img = $('img');

                        result = $.rightoffold($img, {
                            container: window,
                            threshold: 0
                        });

                        expect(result).toBe(false);
                    });
                });
            });
        });
    });

    describe.skip('on load', () => {
        it('should check if element is visible', () => {
            // I can't seem to figure out how to spy on the .is(':visible')
            const jQuery = (global.jQuery = global.$ = require('jquery')),
                spyIs = jest.spyOn($.fn, 'is');
            let $img;

            require('../jquery.lazyload');

            document.body.innerHTML = '<img />';
            $img = $('<img>');
            $img.lazyload();

            expect(spyIs).toHaveBeenCalledTimes(1);
            expect(spyIs).toHaveBeenCalledWith('img', ':visible');
        });
    });
});

// describe.skip('$.fn.lazyload()', () => {
//     it("should add 'appear', 'scroll', 'resize' listeners", () => {
//         const $img = $('<img>');
//         $img.lazyload({
//             event: 'customScroll'
//         });
//
//         expect(jQuery._data($img[0], 'events')).toHaveProperty('appear');
//         expect(jQuery._data($img[0], 'events')).toHaveProperty('customScroll');
//         expect(jQuery._data($img[0], 'events')).toHaveProperty('resize.lazyload');
//     });
//
//     it('should set src to default placeholder for img with falsy src', () => {
//         const $img = $('<img>'),
//         placeholder =
//             'data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=';
//         $img.lazyload();
//
//         expect($img.attr('src')).toBe(placeholder);
//     });
//
//     it('should not set src to default placeholder when src is set', () => {
//         const $img = $('<img src="test.png">');
//         $img.lazyload();
//
//         expect($img.attr('src')).toBe('test.png');
//     });
//
//     it("should add default event listener", () => {
//         const $img = $('<img>');
//         $img.lazyload();
//
//         expect(jQuery._data($img[0], 'events')).toHaveProperty('appear');
//     });
// });
