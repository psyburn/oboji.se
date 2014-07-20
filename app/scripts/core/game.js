/*globals $, Core */
(function() {
  'use strict';

  window.Core = window.Core || {};

  Core.colorChanger = (function(color) {
    color = color || new Core.Color(0, 0, 0);
    var $el;

    // var getRandomColor = function() {
    //   return new Core.Color(parseInt(Math.random() * 255, 10), parseInt(Math.random() * 255, 10), parseInt(Math.random() * 255, 10));
    // };

    var motionOffsetToColorOffset = function(val) {
      return parseInt(val * 3, 10);
    };

    var setElement = function(el) {
      $el = el;
      Core.motion.enable(onMotionAcceleration, onMotionRotation);
    };

    var clearElement = function() {
      $el = undefined;
      Core.motion.disable();
    };

    var onMotionAcceleration = function(offsetX, offsetY, offsetZ) {
      console.log('on motion acceleration', offsetX, offsetY, offsetZ);
      color.setRGB(color.r + motionOffsetToColorOffset(offsetX), color.g + motionOffsetToColorOffset(offsetY), color.b + motionOffsetToColorOffset(offsetZ));
      updateColor();
    };

    var onMotionRotation = function(alpha, beta, gamma) {
      console.log('on motion rotation', alpha, beta, gamma);
    };

    var updateColor = function() {
      console.log(color.r, color.g, color.b);
      if ($el) {
        $el.css('background-color', 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',1)');
      }
    };

    return {
      setElement: setElement,
      clearElement: clearElement,
      updateColor: updateColor
    };
  })();

  Core.colorChanger.setElement($('body'));
})();