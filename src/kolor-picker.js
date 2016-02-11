/**
 * [kolor-picker]{@link https://github.com/emn178/kolor-picker}
 *
 * @version 0.1.1
 * @author Yi-Cyuan Chen [emn178@gmail.com]
 * @copyright Yi-Cyuan Chen 2015-2016
 * @license MIT
 */
(function ($) {
  'use strict';

  var KEY = 'kolor-picker';

  function KolorPicker(colorPicker) {
    this.element = $('<div class="kolor-picker"><div class="sampler"></div><div class="preview-block"><input type="text"/><div class="preview-wrapper"><div class="preview" /></div></div></div>');
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
  }

  KolorPicker.prototype.onSamplerSelect = function (color) {
    this.sampling = false;
    this.elements.canvas.colorSampler('disable');
    this.colorPicker.color.setColor(color);
    color = this.getColor();
    this.selectColor(color);
  };

  KolorPicker.prototype.onSamplerPreview = function (color) {
    this.elements.trigger.css('background-color', color);
    color = this.getColor();
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

  KolorPicker.prototype.getColor = function () {
    var rgb = this.colorPicker.color.colors.rgb;
    return 'rgba(' + [parseInt(rgb.r * 255), parseInt(rgb.g * 255), parseInt(rgb.b * 255), this.colorPicker.color.colors.alpha.toFixed(2)].join(',') + ')';
  };

  KolorPicker.prototype.updateColor = function () {
    var color = this.getColor();
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
        var color = this.getColor();
        this.selectColor(color);
      }
    } else {
      this.updateColor();
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
})(jQuery);
