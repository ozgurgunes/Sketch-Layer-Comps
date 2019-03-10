import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import analytics from './analytics.js'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

const DEFAULT_NAME = "Last State" 

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
  var result = deleteCompsDialog(comps.map(comp => comp.name))
  if (result) {
    result.selection.reverse().map(item => comps.splice(item, 1))
    settings.setLayerSettingForKey(artboard,
      context.plugin.identifier(), comps)
    analytics(context, result.deletion, result.selection.length)
    return UI.message(result.selection.length + " comps deleted.")
  }
}

var deleteCompsDialog = items => {
  var buttons = ['Delete', 'Cancel', 'Delete All']
  var message = context.command.name()
  var info = "Please select layer comps to be deleted."
  var accessory = UI.list(items)
  var response = UI.dialog(message, info, accessory[0], buttons)
  var selection = []
  if (response === 1002) {
    var confirmed = deleteAllDialog()
    if (confirmed === 1000) {
      accessory[1].map((comp, i) => selection.push(i))
      return {
        deletion: "delete all",
        selection: selection
      }
    }
  }
  if (response === 1000) {
    accessory[1].map((comp, i) => {
      if (comp.state()) {
        selection.push(i)
      }
    })
    return {
      deletion: "delete",
      selection: selection
    }
  }
}

var deleteAllDialog = () => {
  var buttons = ['Delete All', 'Cancel']
  var message = "Are you sure?"
  var info = "All layer comps will be deleted!"
  return UI.dialog(message, info, null, buttons)
}
