/**
 * [kolor-picker]{@link https://github.com/emn178/kolor-picker}
 *
 * @version 0.3.0
 * @author Yi-Cyuan Chen [emn178@gmail.com]
 * @copyright Yi-Cyuan Chen 2015-2021
 * @license MIT
 */
(function ($) {
  'use strict';

  var KEY = 'kolor-picker';
  var wrapper;

  function Wrapper(element, colorPicker) {
    this.element = element;
    this.colorPicker = colorPicker;
    this.previewElement = $('<div class="kolor-picker"><div class="sampler"></div><div class="preview-block"><input type="text"/><div class="preview-wrapper"><div class="preview" /></div></div></div>');
    this.element.append(this.previewElement);

    var elements = {
      preview: this.previewElement.find('.preview'),
      input: this.previewElement.find('input'),
      sampler: this.previewElement.find('.sampler'),
      alpha: this.element.find('.cp-alpha')
    };
    this.elements = elements;
    elements.sampler.click(this.enableSampler.bind(this));
    elements.input.change(this.onInputChange.bind(this));

    this.sampling = false;
    this.lastToggled = false;
  }

  Wrapper.prototype.enableSampler = function () {
    if (!this.kolorPicker.canvas) {
      return;
    }
    this.kolorPicker.canvas.colorSampler('enable');
    this.sampling = true;
    this.colorPicker.toggle(false);
  };

  Wrapper.prototype.onInputChange = function () {
    this.kolorPicker.setColor(this.elements.input.val());
  };

  Wrapper.prototype.setKolorPicker = function (kolorPicker) {
    this.kolorPicker = kolorPicker;
    this.element.attr('data-theme', kolorPicker.theme);
    this.elements.sampler.toggle(!!kolorPicker.canvas);
    this.elements.alpha.toggle(kolorPicker.options.opacity !== false);
    if (kolorPicker.options.doRender === undefined) {
      this.colorPicker.color.options.doRender = true;
    } else {
      this.colorPicker.color.options.doRender = kolorPicker.options.doRender;
    }
  };

  Wrapper.prototype.getColor = function () {
    var rgb = this.colorPicker.color.colors.rgb;
    return 'rgba(' + [parseInt(rgb.r * 255), parseInt(rgb.g * 255), parseInt(rgb.b * 255), this.colorPicker.color.colors.alpha.toFixed(2)].join(',') + ')';
  };

  Wrapper.prototype.updateColor = function () {
    var color = this.getColor();
    this.elements.preview.css('background-color', color);
    this.elements.input.val(color);
    this.kolorPicker.changeColor(color);
  };

  Wrapper.prototype.render = function (toggled) {
    if (toggled === undefined) {
      this.updateColor();
    } else if (this.lastToggled === toggled) {
      return;
    }
    this.lastToggled = toggled;
    if (toggled === false) {
      if (!this.sampling) {
        var color = this.getColor();
        this.kolorPicker.selectColor(color);
      }
    } else {
      this.updateColor();
    }
  };

  function KolorPicker(element, options) {
    this.element = element;
    this.options = options || {};
    this.canvas = this.options.canvas;
    this.theme = this.options.theme || $.kolorPicker.theme;
    this.color = this.element.css('background-color');

    if (this.canvas) {
      this.canvas = $(this.canvas);
      this.canvas.colorSampler().colorSampler('disable')
        .bind('sampler:preview', this.onSamplerPreview.bind(this))
        .bind('sampler:select', this.onSamplerSelect.bind(this));
    }
  }

  KolorPicker.prototype.onSamplerSelect = function (e, color) {
    if (wrapper.kolorPicker != this) {
      return;
    }
    wrapper.sampling = false;
    this.canvas.colorSampler('disable');
    this.setColor(color);
    color = wrapper.getColor();
    this.selectColor(color);
  };

  KolorPicker.prototype.onSamplerPreview = function (e, color) {
    if (wrapper.kolorPicker != this) {
      return;
    }
    this.element.css('background-color', color);
    color = wrapper.getColor();
    this.changeColor(color);
  };

  KolorPicker.prototype.selectColor = function (color) {
    this.color = color;
    if ($.isFunction(this.options.onSelect)) {
      this.options.onSelect.call(this.element, color);
    }
    this.element.trigger('kolorPicker:select', color)
  };

  KolorPicker.prototype.changeColor = function (color) {
    if ($.isFunction(this.options.onChange)) {
      this.options.onChange.call(this.element, color);
    }
    this.element.trigger('kolorPicker:change', color)
  };

  KolorPicker.prototype.setColor = function (color) {
    this.color = color;
    this.element.css('background-color', color);
    if (wrapper) {
      wrapper.colorPicker.color.setColor(color);
      wrapper.colorPicker.render();
    }
  };

  KolorPicker.prototype.getColor = function () {
    return this.color;
  };

  var KolorPickerOptions = {
    buildCallback: function (element) {
      wrapper = new Wrapper(element, this);
    },

    renderCallback: function (element, toggled) {
      var kolorPicker = $(element).data(KEY);
      if (kolorPicker) {
        wrapper.setKolorPicker(kolorPicker);
        wrapper.render(toggled);
      }
    }
  };

  var PublicMethods = ['setColor', 'getColor'];
  $.fn.kolorPicker = function (options) {
    if (typeof (options) == 'string') {
      if ($.inArray(options, PublicMethods) != -1) {
        var args = Array.prototype.splice.call(arguments, 1);
        var kolorPicker = $(this).data(KEY);
        if (kolorPicker) {
          return kolorPicker[options].apply(kolorPicker, args);
        }
      }
    } else {
      this.each(function () {
        var element = $(this);
        if (!element.data(KEY)) {
          return element.data(KEY, new KolorPicker(element, options))
            .colorPicker($.extend({ cssAddon: $.kolorPicker.css }, options, KolorPickerOptions));
        }
      });
    }
    return this;
  };

  $.kolorPicker = {
    theme: ''
  };
})(jQuery);

$.kolorPicker.css="[data-theme=light].cp-color-picker{background-color:#fff}[data-theme=light] .kolor-picker .sampler{border-color:#ebebeb;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAgNJREFUWAntlztOw0AURWPRQEPFAgxsBIkGUbABdoBYARsIEhUSDQ0dG0A07AAKGjoa5FAg0VIB4neulBdNRmM7CfHYkeZKV/O15/hl/Mbp9ZJSBFIEUgS6HIFV4Pr4Dt/jU7yGO6kcqif86/mFduegc6AK7MNaW5GOrowVlwOr5vQV2OBCpbZHVO2y2iv+wmd4CUs5LnAI0u3Tno6mPVb6xC7AJe1NXHj97hy33mdeFO2wig9rIO+MWb2q1Iuo7BFFA1apgqkbK7g+x1Gkl+wN10GVjRdcm+NK2ctQOWnKwe0p52u6fpktXODoOmfFsiiG+gvm57gVbbCqohUCC/XpRVT2aEWCfcYCU/69HtZDoG6fUl4TW5PblmudIYusYPeHU08oXbiyug6XaCqDNYBJoPWQoWPc7jG3sg7WFqrbHjrGM5vcVDkprLaHIli2HT4Y07dHo5oFdgCRn/IEq2+PRjUrrK6TjrBORD2Avj0a1X9hDS6zSpPlvGCbZBzdO8GOQjHnykJFdoWHf8TKn+5x68dEefZ7OG9AqYdsRcesKtgfbN8GPoh7KLQKK7AHLOALNQLqFKz47O/O4SLAivEWK8I3ajjqXGSN7YCKgA1akdb20J5WX+t7FoYxZbSusEG7pbJHa9lgjNJrCFqR1vbQntaLqOyhlJeUIpAikCLQwQj8Ad75Juue3l4FAAAAAElFTkSuQmCC)}[data-theme=light] .kolor-picker input{border-color:#ebebeb;color:#85888f}[data-theme=light] .kolor-picker .preview{border-color:#ebebeb}.cp-color-picker{background-color:#2f3239;border-radius:3px}.cp-xy-slider{width:240px;height:178px}.cp-xy-cursor{height:15px;width:15px;border:2px solid #fff}.cp-z-slider{height:178px}.cp-z-cursor{border:0;background-color:#fff;height:8px;border-radius:3px}.kolor-picker{clear:both;height:35px;margin:10px 0;padding-top:5px}.kolor-picker .sampler{display:inline-block;width:26px;height:26px;border:2px solid #555b60;border-radius:3px;vertical-align:middle;cursor:pointer;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAhZJREFUWAntl7FOwlAUhkEXWZzcBXkZ4sAL8AaGF9AXwMSJxMWFzRcwLmyOOrC4uRh1MLoaBzVq/f6mxzQX2oKWtsZ7kp/b3nt7z9ef01uo1Xx4B7wD3gHvwL91IAiCdTRAF2iChmijkoYA1kTXyI17OqoFDZBgb1zS2PmwcJdJXkdrbmL6smDFPXGvs/MVO8izJeE26z2gZ44P0arWp23SnKFNlBbvaYO5jgHVRW8oHsectFFaGcTnD3KFSlqMjB3kwhrIix1ktHoQ15Ny5NpPotsMmKxhfQPNXKGSFiORHrKnLKKU8eJg7SaA2U0BShsqHjYGfZRGNmOsVNgtgBapYz2IbbvZQlsSC/YOKd7RaXiU/aEtL9ynCwMmYQuZs4LtKTntAZonDkuHNQBo54HWTU69xm2N3FqSzHTWTcC8rPJ4ZE7dvS7X8wVge8yVg0nxyoB+eywvSDCvs3FY1bi75Qm2uzxSVv4FbEtgXL+H9EbUDXQqDWtwgC63XiNnfloGobMGW0iLIx52KU7/NWcbAF8hxffr1nWGMW1dH5pE6MkvvmYFReJ9ERCfKPxtkABrL4XyYCPgyxA3CEYuaDTuvhTKcdbggLW/O33rs1aOo2o4G4M6jxweW5/aSsJGYDsRsJox6qMRUk0ryq3ZuIsRcB2okxBt+kO7R7k16wLHoOW0ykM1rQdRu0dj1nzf5x3wDmQ78AUqu6QCF8YEagAAAABJRU5ErkJggg==);background-size:22px;background-repeat:no-repeat;background-position:center;opacity:.5}.kolor-picker .sampler:hover{opacity:1}.kolor-picker .preview-block{display:inline-block;vertical-align:middle;float:right}.kolor-picker input{height:26px;width:150px;background-color:transparent;padding:0;margin:0 10px 0 0;border:2px solid #555b60;border-radius:3px;text-align:center;color:#fff;vertical-align:middle;font-size:14px;font-family:SourceSansPro-Regular}.kolor-picker .preview-wrapper{display:inline-block;width:31px;height:26px;border:2px solid #555b60;border-radius:3px;vertical-align:middle;background-image:url(data:image/gif;base64,R0lGODlhDAAMAIABAMzMzP///yH5BAEAAAEALAAAAAAMAAwAAAIWhB+ph5ps3IMyQFBvzVRq3zmfGC5QAQA7)}.kolor-picker .preview{height:100%}";