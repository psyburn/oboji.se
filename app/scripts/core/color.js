/*globals _, Core */
(function() {
  'use strict';

  window.Core = window.Core || {};

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

})();