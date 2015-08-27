# Sketch Layer Comps

Layer Comps plugin for [Sketch][] saves and applies layer states to create different compositions of current page. The plugin uses [Sketch][] layers metadata and does not require any unnecessary layers.

[Sketch]: http://bohemiancoding.com/sketch/

## Changes

Version 1.1: Aug 27, 2015

* Update: Usage instructions added to README file.
* Improvement: ```cmd```+```ctl```+```A``` is the new keyboard shortcut for ```Apply Layer Comp```.
* Improvement: ```OK``` buttons are now display appropriate labels (```Save```, ```Delete```, ```Apply```).
* Bugfix: Now not overwrites the layer comp when clicked ```Cancel``` in confirmation dialog.
* Bugfix: Now saves newly created or updated layer comp as current layer comp to improve stability of ```Last Document State``` feature.

## Installation

1. Download this repo as zip and extract. 
2. In Sketch, go to Plugins > Reveal Plugins Folder
3. Copy extracted folder to plugins folder

## Usage

### New Layer Comp: ```Cmd```+```Ctrl```+```C```

To save current layer states for all artboards of current page;

* Go to ```Plugins > Layer Comps > New Layer Comp``` or hit ```Cmd```+```Ctrl```+```C```
* Give a name to new layer comp or choose an existing one.
* Click ```Save```. (Click ```OK``` in confirmation dialog if you want to update an existing layer comp.)

### Apply Layer Comp: ```Cmd```+```Ctrl```+```A```

To apply a layer comp to all artboards of current page;

* Go to ```Plugins > Layer Comps > Apply Layer Comp``` or hit ```Cmd```+```Ctrl```+```A```
* Choose a layer comp in opening dialog window.
* Click ```Apply```.

### Delete Layer Comps: ```Cmd```+```Ctrl```+```Shift```+```C```

To delete layer comps of current page;

* Go to ```Plugins > Layer Comps > Delete Layer Comp``` or hit ```Cmd```+```Ctrl```+```Shift```+```C```
* Choose layer comps which you want to delete.
* Click ```Delete```. (Click ```Delete All``` if you want to delete all layer comps.)

### Last Document State

Whenever you apply a layer comp, plugin checks all layer states and saves automatically if it differs from currently active layer comp. So, you can revert back to your design changes easily by selecting ```Last Document State``` in ```Apply Layer Comp``` screen.