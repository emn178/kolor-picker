# kolor-picker
A tinyColorPicker plugin provides sampler function for Canvas.

## Download
[Compress JS](https://raw.github.com/emn178/kolor-picker/master/build/kolor-picker.min.js)  
[Uncompress JS](https://raw.github.com/emn178/kolor-picker/master/src/kolor-picker.js)

## Installation
You can also install kolor-picker by using Bower.
```
bower install kolor-picker
```

## Demo
[Demo](http://emn178.github.io/kolor-picker/samples/demo/)

## Requirements
* [jQuery](http://jquery.com/)
* [tinyColorPicker](https://github.com/PitPik/tinyColorPicker)  
* [color-sampler](https://github.com/emn178/color-sampler)  

## Usage
You could just use jQuery `bind`, `delegate` or `on` to listen event.
HTML
```HTML
<div id="picker"></div>
<canvas id="canvas"></canvas>
```
JavaScript
```JavaScript
$('#picker').kolorPicker({
  canvas: '#canvas',
  onSelect: function (color) {
    $('#picker').css('background-color', color);
  },
  onChange: function (color) {
    // anything you want to do
  }
});
```
[See also](https://github.com/PitPik/tinyColorPicker#jqcolorpickerjs).

### Methods

#### setColor(color)

Set color to picker. This method only works after the picker has been initialized.

##### *color: `String`*

Color in hex or rgb format. It does not support color name like 'black' or 'white'.

### Themes

You can choose built-in themes by `cssAddon` options and `$.kolorPicker.theme`. Currently, there is following themes:

* light


## Example
```JavaScript
$('#picker').kolorPicker({
  cssAddon: $.kolorPicker.theme.light
});
$('#picker').kolorPicker('setColor', '#FF0000');
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/kolor-picker  
Author: emn178@gmail.com
