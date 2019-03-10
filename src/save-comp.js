import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

var saveComp = context => {
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
  var eventLabel = "save"
  var message = " saved."
  var comps = settings
    .layerSettingForKey(artboard, context.plugin.identifier()) || []
  comps.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
  var compName = saveCompDialog(comps.map(comp => comp.name))
  if (compName) {
    if (comps.some(comp => comp.name == compName)) {
      var response = updateCompDialog(compName);
      if (response != 1000) {
        return saveComp(context);
      }
      comps.splice(comps.map(comp => comp.name).indexOf(compName), 1)
      eventLabel = "update"
      message = " updated."
    }
    var comp, layers = []
    artboard.layers.map(layer => {
      comp = {
        id: layer.id,
        frame: layer.frame,
        transform: layer.transform,
        hidden: layer.hidden,
        locked: layer.locked
      }
      layers.push(comp)
    })
    comps.push({
      name: compName,
      layers: layers
    })
    settings.setLayerSettingForKey(artboard,
      context.plugin.identifier(), comps)
    analytics(context, eventLabel, compName)
    return UI.message(compName + message)
  }
  return
}

export default saveComp

var saveCompDialog = items => {
  var buttons = ['Save', 'Cancel']
  var message = context.command.name()
  var info = "Please give a name to layer comp."
  var accessory = UI.combobox(items)
  var response = UI.dialog(message, info, accessory, buttons)
  var result = accessory.stringValue()
  if (response === 1000) {
    if (!result.length() > 0) {
      return saveCompDialog(items)
    }
    return result
  }
}

var updateCompDialog = compName => {
  var buttons = ['Update', 'Cancel']
  var message = "Are you sure?"
  var info = 'This will update "' + compName + '" comp.'
  return UI.dialog(message, info, null, buttons)
}
