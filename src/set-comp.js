import sketch from 'sketch/dom'
import analytics from '@ozgurgunes/sketch-plugin-analytics'
import {
  successMessage,
  errorMessage,
  comboBox,
  alert
} from '@ozgurgunes/sketch-plugin-ui'

import { getArtboard, getComps } from './utils'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

export default function(context) {
  let artboard = getArtboard(selection)
  if (!artboard) return
  let comps = getComps(artboard, true)
  if (!comps) return
  comps.unshift({ name: '- Select a layer Comp -', layers: [] })
  let result = setCompDialog(comps.map(comp => comp.name))
  if (result && comps[result]) {
    let compName = comps[result].name
    let layers = comps[result].layers
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
    return successMessage(compName + ' layer comp set.')
  }
}

function setCompDialog(items) {
  let buttons = ['Set', 'Cancel']
  let info = 'Please select a layer comp.'
  let accessory = comboBox(items)
  let response = alert(info, accessory, buttons).runModal()
  let result = accessory.indexOfSelectedItem()
  if (response === 1000) {
    if (!result > 0) {
      // User clicked "OK" without selecting a state.
      // Return dialog until user selects a state or clicks "Cancel".
      analytics('No Selection')
      errorMessage('Please select a layer comp.')
      return setCompDialog(items)
    }
    return result
  }
}
