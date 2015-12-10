/*
 * kolor-picker v0.1.0
 * https://github.com/emn178/kolor-picker
 *
 * Copyright 2015, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function ($, window, document) {
  'use strict';

  var KEY = 'kolor-picker';

  function KolorPicker(colorPicker) {
    this.element = $('<div class="kolor-picker"><div class="sampler"></div><div class="preview-block"><input type="text"/><div class="preview" /></div></div>');
    this.colorPicker = colorPicker;
    this.options = colorPicker.color.options;

    var elements = {
      trigger: colorPicker.$trigger,
      preview: this.element.find('.preview'),
      input: this.element.find('input'),
      sampler: this.element.find('.sampler')
    };
    this.elements = elements;
    elements.trigger.data(KEY, this);

    if (this.options.canvas) {
      elements.canvas = $(this.options.canvas);
      elements.canvas.colorSampler({
        onSelect: this.onSamplerSelect.bind(this),
        onPreview: this.onSamplerPreview.bind(this)
      }).colorSampler('disable');
      elements.sampler.click(this.enableSampler.bind(this));
    } else {
      elements.sampler.hide();
    }
    this.sampling = false;
    this.lastToggled = false;
    this.updateColor();
  }

  KolorPicker.prototype.onSamplerSelect = function (color) {
    this.sampling = false;
    this.elements.canvas.colorSampler('disable');
    color = '#' + this.colorPicker.color.colors.HEX;
    this.selectColor(color);
  };

  KolorPicker.prototype.onSamplerPreview = function (color) {
    this.elements.trigger.css('background-color', color);
    color = '#' + this.colorPicker.color.setColor(color).HEX;
    this.changeColor(color);
  };

  KolorPicker.prototype.selectColor = function (color) {
    if ($.isFunction(this.options.onSelect)) {
      this.options.onSelect.call(this.colorPicker, color);
    }
  };

  KolorPicker.prototype.changeColor = function (color) {
    if ($.isFunction(this.options.onChange)) {
      this.options.onChange.call(this.colorPicker, color);
    }
  };

  KolorPicker.prototype.enableSampler = function () {
    this.elements.canvas.colorSampler('enable');
    this.sampling = true;
    this.colorPicker.toggle(false);
  };


  KolorPicker.prototype.updateColor = function (color) {
    var color = '#' + this.colorPicker.color.colors.HEX;
    this.elements.preview.css('background-color', color);
    this.elements.input.val(color);
    this.changeColor(color);
  };

  KolorPicker.prototype.render = function (element, toggled) {
    if (toggled === undefined) {
      this.updateColor();
    } else if (this.lastToggled === toggled) {
      return;
    }
    this.lastToggled = toggled;
    if (toggled === false) {
      if (!this.sampling) {
        var color = '#' + this.colorPicker.color.colors.HEX;
        this.selectColor(color);
      }
    }
  };

  KolorPicker.prototype.setColor = function (color) {
    this.colorPicker.color.setColor(color);
    this.colorPicker.render();
  };

  var KolorPickerOptions = {
    buildCallback: function (element) {
      this.kolorPicker = new KolorPicker(this);
      element.append(this.kolorPicker.element);
    },

    renderCallback: function (element, toggled) {
      this.kolorPicker.render(element, toggled);
    }
  };

  var PublicMethods = ['setColor'];
  $.fn.kolorPicker = function (options) {
    if (typeof (options) == 'string') {
      if ($.inArray(options, PublicMethods) != -1) {
        var arg = Array.prototype.splice.call(arguments, 1);
        this.each(function () {
          var kolorPicker = $(this).data(KEY);
          if (kolorPicker) {
            return kolorPicker[options].apply(kolorPicker, arg);
          }
        });
      }
    } else {
      return this.colorPicker($.extend({ cssAddon: $.kolorPicker.css }, options, KolorPickerOptions));
    }
    return this;
  };

  $.kolorPicker = {
    theme: {}
  };
})(jQuery, window, document);
