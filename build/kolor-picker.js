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

$.kolorPicker.css=".cp-color-picker{background-color:#2f3239;border-radius:3px}.cp-xy-slider{width:240px;height:178px}.cp-xy-cursor{height:15px;width:15px;border:2px solid #fff}.cp-z-slider{height:178px}.cp-z-cursor{border:0;background-color:#fff;height:8px;border-radius:3px}.kolor-picker{clear:both;height:35px;margin:10px 0;padding-top:5px}.kolor-picker .preview,.kolor-picker .sampler,.kolor-picker input{height:26px;vertical-align:middle}.kolor-picker .sampler{display:inline-block;width:26px;border:2px solid #555b60;border-radius:3px;cursor:pointer;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAhZJREFUWAntl7FOwlAUhkEXWZzcBXkZ4sAL8AaGF9AXwMSJxMWFzRcwLmyOOrC4uRh1MLoaBzVq/f6mxzQX2oKWtsZ7kp/b3nt7z9ef01uo1Xx4B7wD3gHvwL91IAiCdTRAF2iChmijkoYA1kTXyI17OqoFDZBgb1zS2PmwcJdJXkdrbmL6smDFPXGvs/MVO8izJeE26z2gZ44P0arWp23SnKFNlBbvaYO5jgHVRW8oHsectFFaGcTnD3KFSlqMjB3kwhrIix1ktHoQ15Ny5NpPotsMmKxhfQPNXKGSFiORHrKnLKKU8eJg7SaA2U0BShsqHjYGfZRGNmOsVNgtgBapYz2IbbvZQlsSC/YOKd7RaXiU/aEtL9ynCwMmYQuZs4LtKTntAZonDkuHNQBo54HWTU69xm2N3FqSzHTWTcC8rPJ4ZE7dvS7X8wVge8yVg0nxyoB+eywvSDCvs3FY1bi75Qm2uzxSVv4FbEtgXL+H9EbUDXQqDWtwgC63XiNnfloGobMGW0iLIx52KU7/NWcbAF8hxffr1nWGMW1dH5pE6MkvvmYFReJ9ERCfKPxtkABrL4XyYCPgyxA3CEYuaDTuvhTKcdbggLW/O33rs1aOo2o4G4M6jxweW5/aSsJGYDsRsJox6qMRUk0ryq3ZuIsRcB2okxBt+kO7R7k16wLHoOW0ykM1rQdRu0dj1nzf5x3wDmQ78AUqu6QCF8YEagAAAABJRU5ErkJggg==);background-size:22px;background-repeat:no-repeat;background-position:center;opacity:.5}.kolor-picker .sampler:hover{opacity:1}.kolor-picker .preview-block{display:inline-block;vertical-align:middle;float:right}.kolor-picker input{width:79px;background-color:transparent;padding:0;margin:0 10px 0 0;border:2px solid #555b60;border-radius:3px;text-align:center;color:#fff;font-size:14px;font-family:SourceSansPro-Regular}.kolor-picker .preview{display:inline-block;width:31px;border:2px solid #555b60;border-radius:3px}";
$.kolorPicker.theme.light=".kolor-picker .preview,.kolor-picker input{border-color:#ebebeb}.cp-color-picker{background-color:#fff}.kolor-picker .sampler{border-color:#ebebeb;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAgNJREFUWAntlztOw0AURWPRQEPFAgxsBIkGUbABdoBYARsIEhUSDQ0dG0A07AAKGjoa5FAg0VIB4neulBdNRmM7CfHYkeZKV/O15/hl/Mbp9ZJSBFIEUgS6HIFV4Pr4Dt/jU7yGO6kcqif86/mFduegc6AK7MNaW5GOrowVlwOr5vQV2OBCpbZHVO2y2iv+wmd4CUs5LnAI0u3Tno6mPVb6xC7AJe1NXHj97hy33mdeFO2wig9rIO+MWb2q1Iuo7BFFA1apgqkbK7g+x1Gkl+wN10GVjRdcm+NK2ctQOWnKwe0p52u6fpktXODoOmfFsiiG+gvm57gVbbCqohUCC/XpRVT2aEWCfcYCU/69HtZDoG6fUl4TW5PblmudIYusYPeHU08oXbiyug6XaCqDNYBJoPWQoWPc7jG3sg7WFqrbHjrGM5vcVDkprLaHIli2HT4Y07dHo5oFdgCRn/IEq2+PRjUrrK6TjrBORD2Avj0a1X9hDS6zSpPlvGCbZBzdO8GOQjHnykJFdoWHf8TKn+5x68dEefZ7OG9AqYdsRcesKtgfbN8GPoh7KLQKK7AHLOALNQLqFKz47O/O4SLAivEWK8I3ajjqXGSN7YCKgA1akdb20J5WX+t7FoYxZbSusEG7pbJHa9lgjNJrCFqR1vbQntaLqOyhlJeUIpAikCLQwQj8Ad75Juue3l4FAAAAAElFTkSuQmCC)}.kolor-picker input{color:#85888f}";$.kolorPicker.theme.light=$.kolorPicker.css+$.kolorPicker.theme.light;