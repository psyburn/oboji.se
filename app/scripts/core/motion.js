/*globals _*/
(function() {
  'use strict';

  var ABS_DELTA_TRESHOLD = 2;
  var MOTION_MAX_FORCE = 10;

  var DimenState = {
    INACTIVE: 0,
    PROGRESSING: 1,
    DEGRESSING: 2
  };

  function Dimen(name) {
    this.name = name;
    this.state = DimenState.INACTIVE;
    this.val = 0;
    this.last = 0;
    this.lastLast = 0;
    this.delta = 0;
    this.absDelta = 0;
  }

  _.extend(Dimen.prototype, {
    update: function(val) {
      val = this.normalizeMotionForceValue(val);
      this.lastLast = this.last;
      this.last = this.val;
      this.val = val;
      this.delta = this.val - this.last;
      this.lastAbsDelta = this.absDelta;
      this.absDelta = Math.abs(this.delta);

      if (this.absDelta >= ABS_DELTA_TRESHOLD) {
        if (this.state === DimenState.INACTIVE) {
          if (this.isProgressingInDirection()) {
            this.setProgressing();
          }
        } else if (this.state === DimenState.PROGRESSING) {
          if (this.isProgressingInDirection()) {
            this.progressingMax = this.val;
          } else {
            this.setDegressing();
          }
        } else if (this.state === DimenState.DEGRESSING) {
          if (!this.isProgressingInDirection()) {
            console.log(this.name, ' dimension is moved ' + this.progressingMax);
            triggerOffsetClb();
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
      this.state = DimenState.PROGRESSING;
      this.progressingMax = this.val;
    },

    setDegressing: function() {
      // console.log('degressing');
      this.state = DimenState.DEGRESSING;
    },

    setInactive: function() {
      // console.log('inactive');
      this.state = DimenState.INACTIVE;
      this.progressingMax = 0;
    }
  });

  var d = {
    x: new Dimen('x'),
    y: new Dimen('y'),
    z: new Dimen('z')
  };

  function update() {
    debugger;
    d.x.update(event.acceleration.x);
    d.y.update(event.acceleration.y);
    d.z.update(event.acceleration.z);
  }

  function triggerOffsetClb() {
    offsetClb(d.x.progressingMax, d.y.progressingMax, d.z.progressingMax);
  }

  function registerForOffset(clb) {
    offsetClb = clb;
  }

  var offsetClb = function(x, y, z) {
    console.log('offset', x, y, z);
  };

  $(window).on('devicemotion', update);

  window.registerMotionOffsetCallback = registerForOffset;
  window.d = d;
})(_);