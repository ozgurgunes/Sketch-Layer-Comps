import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import * as UI from './ui.js'
import {
  getArtboard,
  getComps,
  analytics
} from './utils.js'

var doc = sketch.getSelectedDocument(),
  selection = doc.selectedLayers

export default context => {
  try {
    let artboard = getArtboard(selection),
      comps = getComps(artboard),
    
      optionList = UI.optionList(comps.map(comp => comp.name)),
      accessory = UI.scrollView(optionList.view),
      response = deleteCompsDialog(accessory)
    if (response === 1002) {
      let confirmed = deleteAllDialog()
      if (confirmed === 1000) {
        settings.setLayerSettingForKey(artboard,
          context.plugin.identifier(), [])
        analytics("Delete All", comps.length)
        return UI.success("All " + comps.length + " layer comps deleted.")
      }
    }
    if (response === 1000) {
      if (optionList.getSelection().length == 0) {
        analytics("Delete None")
        return UI.error("Nothing deleted.")
      }
      optionList.getSelection().reverse().map(item => comps.splice(item, 1))
      settings.setLayerSettingForKey(artboard, context.plugin.identifier(), comps)
      analytics("Delete Selected", optionList.getSelection().length)
      return UI.success(optionList.getSelection().length + " layer comps deleted.")
    }
  } catch (e) {
    console.log(e)
    return e
  }
}

var deleteCompsDialog = accessory => {
  let buttons = ['Delete', 'Cancel', 'Delete All'],
    info = "Please select layer comps to be deleted."
    return UI.dialog(info, accessory, buttons)
}

var deleteAllDialog = () => {
  let buttons = ['Delete All', 'Cancel'],
    message = "Are you sure?",
    info = "All layer comps will be deleted!"
  return UI.dialog(info, null, buttons, message)
}
