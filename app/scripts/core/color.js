/*globals _, Core */
(function() {
  'use strict';

  window.Core = window.Core || {};

  function rand255() {
    return Math.floor(Math.random() * 255);
  };

  Core.Color = function(r, g, b) {
    this.setRGB(r, g, b);
  };

  _.extend(Core.Color.prototype, {
    setRGB: function(r, g, b) {
      this.r = this.normalizeComponent(r);
      this.g = this.normalizeComponent(g);
      this.b = this.normalizeComponent(b);
    },
    normalizeComponent: function(val) {
      return val < 0 ? 0 : (val > 255 ? 255 : parseInt(val, 10));
    }
  });

  Core.Color.generateRandomRgbString = function() {
    return 'rgb(' + rand255() + ',' + rand255() + ',' + rand255() + ')';
  };

})();