// jquery.lazyload.testable.js
$.fn.lazyload = function (options) {
    window._lazyload = {};

    const _settings = {
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
    },
    _methods = {
        _setPlaceholder (element) {
            const $this = $(element);

            if (!$this.attr('src') && $this.is('img')) {
                $this.attr('src', _settings.placeholder);
            }
        },
        _convertCompat (options) {
            /* Maintain BC for a couple of versions. */

            const _options = options;

            if (undefined !== _options.failurelimit) {
                _options.failure_limit = _options.failurelimit;
                delete _options.failurelimit;
            }

            if (undefined !== _options.effectspeed) {
                _options.effect_speed = _options.effectspeed;
                delete _options.effectspeed;
            }

            return _options;
        }
    };

    if (options) {
        const _covertedOptions = _methods._convertCompat(options);
        $.extend(_settings, _covertedOptions);
    }

    if (typeof TESTING !== 'undefined') {
        window._lazyload._settings = _settings;
        window._lazyload._methods = _methods;
    }
};













$.fn.lazyload = function (options) {
    window._lazyload = {};

    const _settings = {
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
    },
    _methods = {
        _setPlaceholder (element) {
            const $this = $(element);

            if (!$this.attr('src') && $this.is('img')) {
                $this.attr('src', _settings.placeholder);
            }
        },
        _convertCompat (options) {
            /* Maintain BC for a couple of versions. */

            const _options = options;

            if (undefined !== _options.failurelimit) {
                _options.failure_limit = _options.failurelimit;
                delete _options.failurelimit;
            }

            if (undefined !== _options.effectspeed) {
                _options.effect_speed = _options.effectspeed;
                delete _options.effectspeed;
            }

            return _options;
        }
    };

    if (options) {
        const _covertedOptions = _methods._convertCompat(options);
        $.extend(_settings, _covertedOptions);
    }

    if (typeof TESTING !== 'undefined') {
        window._lazyload._settings = _settings;
        window._lazyload._methods = _methods;
    }
};