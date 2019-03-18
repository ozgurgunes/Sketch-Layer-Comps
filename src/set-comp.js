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
      result = setCompDialog(comps.map(comp => comp.name))
    if (result && (comps[result.index])) {
      let compName = comps[result.index].name,
        layers = comps[result.index].layers
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
      return UI.success(compName + " layer comp set.")
    }    
  } catch (e) {
    console.log(e)
    return e
  }
}

var setCompDialog = items => {
  let buttons = ['Set', 'Cancel'],
    info = "Please select a layer comp.",
    accessory = UI.popUpButton(items),
    response = UI.dialog(info, accessory, buttons),
    result = {
      index: accessory.indexOfSelectedItem(),
      title: accessory.titleOfSelectedItem()
    }
  if (response === 1000) {
    return result
  }
}
