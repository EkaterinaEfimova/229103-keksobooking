'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;

  var debounce = function (last) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(last, DEBOUNCE_INTERVAL);
  };

  window.util = {
    debounce: debounce,
    DEBOUNCE_INTERVAL: DEBOUNCE_INTERVAL
  };

})();