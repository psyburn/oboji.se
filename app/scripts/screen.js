'use strict';

var Screen = function(options) {
  this._init(options);
};

$.extend(Screen.prototype, {
  _init: function(options) {
    this.$el = $('#' + options.id);
    this.name = options.id;
  },
  $: function(sel) {
    return this.$el.find(sel);
  },
  init: function(options) {
    this.setListeners();
  },
  setListeners: function(options) {
    // listeners
  }
});
