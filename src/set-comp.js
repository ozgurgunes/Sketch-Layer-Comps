import sketch from 'sketch/dom'
import * as UI from './ui.js'
import {
  getArtboard,
  getComps,
  analytics
} from './utils.js'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

export default context => {
  try {
    let artboard = getArtboard(selection)
    let comps = getComps(artboard, true)
    comps.unshift({ name: '- Select a layer Comp -', layers: [] })
    let result = setCompDialog(comps.map(comp => comp.name))
    if (result && (comps[result.index])) {
      if (result.index < 1) {
        analytics('Select None')
        return UI.error('No layer comp selected.')
      }
      let compName = comps[result.index].name
      let layers = comps[result.index].layers
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
      analytics(context, 'success', compName)
      return UI.success(compName + ' layer comp set.')
    }
  } catch (e) {
    console.log(e)
    return e
  }
}

var setCompDialog = items => {
  let buttons = ['Set', 'Cancel']
  let info = 'Please select a layer comp.'
  let accessory = UI.popUpButton(items)
  let response = UI.dialog(info, accessory, buttons)
  let result = {
    index: accessory.indexOfSelectedItem(),
    title: accessory.titleOfSelectedItem()
  }
  if (response === 1000) {
    return result
  }
}
