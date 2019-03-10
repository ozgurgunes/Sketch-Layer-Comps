import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import analytics from './analytics.js'
import {DEFAULT_NAME, saveDefault} from './lib.js'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers


export default context => {
  var artboard
  switch (true) {
    case (selection.length == 1 &&
      selection.layers[0].type == sketch.Types.Artboard):
      artboard = selection.layers[0]
      break;
    case (selection.length == 1 &&
      selection.layers[0].getParentArtboard() != undefined):
      artboard = selection.layers[0].getParentArtboard()
      break;
    default:
      analytics(context, "error", "selection")
      return UI.message("Please select an artboard.")
  }
  var comps = settings
    .layerSettingForKey(artboard, context.plugin.identifier()) || []
  if (comps.length < 1) {
    analytics(context, "error", "comps")
    return UI.dialog(context.command.name(), "There are not any layer comps.")
  }
  comps.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
  var result = setCompDialog(comps.map(comp => comp.name))
  if (result && (comps[result.index])) {
    var compName = comps[result.index].name
    var layers = comps[result.index].layers
    layers.map(compLayer => {
      artboard.layers.map(artboardLayer => {
        if (compLayer.id == artboardLayer.id) {
          artboardLayer.frame = compLayer.frame
          artboardLayer.transform = compLayer.transform
          artboardLayer.hidden = compLayer.hidden
          artboardLayer.locked = compLayer.locked
        }
      })
    })
    analytics(context, "success", compName)
    return UI.message(compName + " layer comp set.")
  }

}

var setCompDialog = items => {
  var buttons = ['Apply', 'Cancel']
  var message = context.command.name()
  var info = "Please select a layer comp."
  var accessory = UI.select(items)
  var response = UI.dialog(message, info, accessory, buttons)
  var result = {
    index: accessory.indexOfSelectedItem(),
    title: accessory.titleOfSelectedItem()
  }
  if (response === 1000) {
    return result
  }
}
