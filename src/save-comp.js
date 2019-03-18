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

const saveComp = context => {
  try {
    let artboard = getArtboard(selection),
      comps = getComps(artboard),
      compName = saveCompDialog(comps.map(comp => comp.name))
    if (compName) {
      if (comps.some(comp => comp.name == compName)) {
        var response = updateCompDialog(compName);
        if (response != 1000) {
          return saveComp(context);
        }
        let i = comps.findIndex(comp => comp.name == compName)
        comps[i].layers = getArtboardLayers(artboard)
        analytics("Update", true)
        return UI.success(compName + " updated.")
      } else {
        comps.push({
          name: compName,
          layers: getArtboardLayers(artboard)
        })
        settings.setLayerSettingForKey(artboard,
          context.plugin.identifier(), comps)
        analytics("Save", true)
        return UI.success(compName + " saved.")
      }
    }
  } catch (e) {
    console.log(e)
    return e
  }
}

export default saveComp

const getArtboardLayers = artboard => {
  let comp, layers = []
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
  return layers
}

const saveCompDialog = items => {
  let buttons = ['Save', 'Cancel'],
    info = "Please give a name to layer comp.",
    accessory = UI.comboBox(items),
    response = UI.dialog(info, accessory, buttons),
    result = accessory.stringValue()
  if (response === 1000) {
    if (!result.length() > 0) {
      return saveCompDialog(items)
    }
    return result
  }
}

const updateCompDialog = compName => {
  let buttons = ['Update', 'Cancel'],
    message = "Are you sure?",
    info = 'This will update "' + compName + '" comp.'
  return UI.dialog(info, null, buttons, message)
}
