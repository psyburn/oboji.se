/*globals $, _, Core */
(function($, _) {
  'use strict';

  window.Core = window.Core || {};

  var $body = $('body');

  Core.Game = function() {
    Core.motion.onAcceleration(_.bind(this.onMotionAcceleration, this));
    Core.motion.onRotation(_.bind(this.onMotionRotation, this));
    this._setRandomRGB();
  };

  _.extend(Core.Game.prototype, {
    _setRandomRGB: function() {
      this.r = parseInt(Math.random() * 255, 10);
      this.g = parseInt(Math.random() * 255, 10);
      this.b = parseInt(Math.random() * 255, 10);
    },

    onMotionAcceleration: function(offsetX, offsetY, offsetZ) {
      console.log('on motion acceleration', offsetX, offsetY, offsetZ);
      this.r = this.normalizeColorComponent(this.r + this.motionOffsetToColorOffset(offsetX));
      this.g = this.normalizeColorComponent(this.g + this.motionOffsetToColorOffset(offsetY));
      this.b = this.normalizeColorComponent(this.b + this.motionOffsetToColorOffset(offsetZ));
      updateBodyColor(this.r, this.g, this.b);
    },

    onMotionRotation: function(alpha, beta, gamma) {
      console.log('on motion rotation', alpha, beta, gamma);
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

  window.game = new Core.Game();
})($, _);