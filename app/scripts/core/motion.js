/*globals _, Core*/

window.Core = window.Core || {};

Core.motion = (function() {
  'use strict';

  var ABS_DELTA_TRESHOLD = 2;
  var MOTION_MAX_FORCE = 10;

  var AccelerationDimenState = {
    INACTIVE: 0,
    PROGRESSING: 1,
    DEGRESSING: 2
  };

  function AccelerationDimen(name) {
    this.name = name;
    this.state = AccelerationDimenState.INACTIVE;
    this.val = 0;
    this.last = 0;
    this.lastLast = 0;
    this.delta = 0;
    this.absDelta = 0;
  }

  _.extend(AccelerationDimen.prototype, {
    update: function(val) {
      val = this.normalizeMotionForceValue(val);
      this.lastLast = this.last;
      this.last = this.val;
      this.val = val;
      this.delta = this.val - this.last;
      this.lastAbsDelta = this.absDelta;
      this.absDelta = Math.abs(this.delta);

      if (this.absDelta >= ABS_DELTA_TRESHOLD) {
        if (this.state === AccelerationDimenState.INACTIVE) {
          if (this.isProgressingInDirection()) {
            this.setProgressing();
          }
        } else if (this.state === AccelerationDimenState.PROGRESSING) {
          if (this.isProgressingInDirection()) {
            this.progressingMax = this.val;
          } else {
            this.setDegressing();
          }
        } else if (this.state === AccelerationDimenState.DEGRESSING) {
          if (!this.isProgressingInDirection()) {
            console.log(this.name, ' dimension is moved ' + this.progressingMax);
            triggerAcceleration();
            this.setInactive();
          }
        }
      }
    },

    normalizeMotionForceValue: function(val) {
      return val < 0 ? (val < -MOTION_MAX_FORCE ? -MOTION_MAX_FORCE : val) : (val > MOTION_MAX_FORCE ? MOTION_MAX_FORCE : val);
    },

    isProgressingInDirection: function() {
      return this.absDelta > this.lastAbsDelta;
      // return isValueProgressing(this.lastLast, this.last, this.val);
    },

    setProgressing: function() {
      // console.log('progressing');
      this.state = AccelerationDimenState.PROGRESSING;
      this.progressingMax = this.val;
    },

    setDegressing: function() {
      // console.log('degressing');
      this.state = AccelerationDimenState.DEGRESSING;
    },

    setInactive: function() {
      // console.log('inactive');
      this.state = AccelerationDimenState.INACTIVE;
      this.progressingMax = 0;
    }
  });

  var ad = {
    x: new AccelerationDimen('x'),
    y: new AccelerationDimen('y'),
    z: new AccelerationDimen('z')
  };

  function update() {
    ad.x.update(event.acceleration.x);
    ad.y.update(event.acceleration.y);
    ad.z.update(event.acceleration.z);
  }

  function triggerAcceleration() {
    accelerationClb(ad.x.progressingMax, ad.y.progressingMax, ad.z.progressingMax);
  }

  function triggerRotation() {
    rotationClb();
  }

  function registerForAcceleration(clb) {
    accelerationClb = clb;
  }

  function registerForRotation(clb) {
    rotationClb = clb;
  }

  var accelerationClb = function(x, y, z) {
    console.log('offset', x, y, z);
  };

  var rotationClb = function(a, b, g) {
    console.log('rotation', a, b, g);
  };

  $(window).on('devicemotion', update);

  return {
    onRotation: registerForRotation,
    onAcceleration: registerForAcceleration,
    ad: ad
  };
})();