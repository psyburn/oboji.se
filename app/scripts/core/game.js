/*globals $, _ */

(function($, _) {
  'use strict';

  var $body = $('body');

  var Game = function() {
    window.registerMotionOffsetCallback(_.bind(this.onMotionOffset, this));
    this._setRandomRGB();
  };

  _.extend(Game.prototype, {
    _setRandomRGB: function() {
      this.r = parseInt(Math.random() * 255, 10);
      this.g = parseInt(Math.random() * 255, 10);
      this.b = parseInt(Math.random() * 255, 10);
    },

    onMotionOffset: function(offsetX, offsetY, offsetZ) {
      console.log('on motion offset', offsetX, offsetY, offsetZ);
      this.r = this.normalizeColorComponent(this.r + this.motionOffsetToColorOffset(offsetX));
      this.g = this.normalizeColorComponent(this.g + this.motionOffsetToColorOffset(offsetY));
      this.b = this.normalizeColorComponent(this.b + this.motionOffsetToColorOffset(offsetZ));
      updateBodyColor(this.r, this.g, this.b);
    },

    motionOffsetToColorOffset: function(offset) {
      return parseInt(offset * 5, 10);
    },

    normalizeColorComponent: function(val) {
      return val < 0 ? 0 : (val > 255 ? 255 : parseInt(val, 10));
    }
  });

  function updateBodyColor(r, g, b) {
    console.log(r, g, b);
    $body.css('background-color', 'rgba(' + r + ',' + g + ',' + b + ',1)');
  }

  window.game = new Game();
})($, _);