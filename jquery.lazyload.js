/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2017 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.10.0-dev
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    /**
	 * LazyLoad object constructor function
	 * @public
	 */
    function LazyLoad () {}

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll.lazyload",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            data_srcset     : "srcset",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs="
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.off(settings.event).on(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .one("load", function() {
                            var original = $self.attr("data-" + settings.data_attribute);
                            var srcset = $self.attr("data-" + settings.data_srcset);

                            if (original !== $self.attr("src")) {
                                $self.hide();
                                if ($self.is("img")) {
                                    $self.attr("src", original);
                                    if (srcset !== null) {
                                        $self.attr("srcset", srcset);
                                    }
                                } if ($self.is("video")) {
                                    $self.attr("poster", original);
                                } else {
                                    $self.css("background-image", "url('" + original + "')");
                                }
                                $self[settings.effect](settings.effect_speed);
                            }

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .bind("error", function(){
                            $(self).trigger("error");
                        })
                        .attr({
                            "src": $self.attr("data-" + settings.data_attribute),
                            "srcset": $self.attr("data-" + settings.data_srcset) || ""
                        });
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.off(settings.event).on(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.off("resize.lazyload").bind("resize.lazyload", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.on("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(function() {
            update();
        });

        return this;
    };

	/**
	 * Returns the element's top accounting for the threshold
	 * @param  {object} element   The element
	 * @param  {number} threshold The optional threshold setting
	 * @return {number}           The element's top
	 */
    LazyLoad.prototype.getElementTop = function(element, threshold) {
        return $(element).offset().top - (threshold || 0);
    };

    /**
	 * Returns the element's left accounting for the threshold
	 * @protected
	 * @param   {object} element   The element
	 * @param   {number} threshold The optional threshold setting
     * @returns {number}           The element's left
	 */
    LazyLoad.prototype.getElementLeft = function(element, threshold) {
        return $(element).offset().left - (threshold || 0);
    };

    /**
     * Returns element's top + height accounting for the threshold
     * @protected
     * @param  {object} element   The element
     * @param  {number} threshold The optional threshold settings
     * @return {number}           The element's top
     */
    LazyLoad.prototype.getElementBottom = function(element, threshold) {
        return $(element).offset().top + (threshold || 0)  + $(element).height();
    }

    /**
     * Returns the window's height
     * @protected
     * @param  {object} window The window
     * @return {number}        The window's height
     */
    LazyLoad.prototype.getWindowHeight = function(window) {
        return window.innerHeight || $(window).height();
    }

    /**
     * Returns the window's width
     * @protected
     * @param  {object} window The window
     * @return {number}        The window's width
     */
    LazyLoad.prototype.getWindowWidth = function(window) {
        return window.innerWidth || $(window).width();
    }

    /**
    * Returns the fold's bottom
    * @protected
    * @param   {object} container The container
    * @returns {number}           The fold's bottom
    */
    LazyLoad.prototype.getFoldBottom = function(container) {
       if (container === window) {
           return LazyLoad.prototype.getWindowHeight(container)
               + $(container).scrollTop();
       }
       return $(container).offset().top + $(container).height();
    }

    /**
    * Returns the fold's right
    * @protected
    * @param   {object} container The container option
    * @returns {number}           The fold's right
    */
    LazyLoad.prototype.getFoldRight = function(container) {
       if (container === window) {
           return LazyLoad.prototype.getWindowWidth(container)
               + $(container).scrollLeft();
       }
       return $(container).offset().left + $(container).height();
    }

    /**
     * Returns the element's container
     * @protected
     * @param   {object} container The container to identify
     * @returns {object}           The indeitified container
     */
    LazyLoad.prototype.getContainer = function(container) {
        return container || window;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var elementTop = LazyLoad.prototype.getElementTop(
                element,
                settings.threshold
            ),
            container = LazyLoad.prototype.getContainer(settings.container),
            fold = LazyLoad.prototype.getFoldBottom(container);

        return fold <= elementTop;
    };

    $.rightoffold = function(element, settings) {
        var elementLeft = LazyLoad.prototype.getElementLeft(
                element,
                settings.threshold
            ),
            container = LazyLoad.prototype.getContainer(settings.container),
            fold = LazyLoad.prototype.getFoldRight(container);

        return fold <= elementLeft;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

    /**
     * The public interface of LazyLoad object
     * @public
     */
    $.fn.lazyload.Constructor = LazyLoad;

})(jQuery, window, document);
