import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import analytics from '@ozgurgunes/sketch-plugin-analytics'
import { successMessage, comboBox, alert } from '@ozgurgunes/sketch-plugin-ui'

import { getArtboard, getComps } from './utils'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

function saveComp(context) {
  let artboard = getArtboard(selection)
  if (!artboard) return
  let comps = getComps(artboard)
  if (!comps) return
  let compName = saveCompDialog(comps.map(comp => comp.name))
  if (compName) {
    if (comps.some(comp => comp.name == compName)) {
      var response = updateCompDialog(compName)
      if (response != 1000) {
        return saveComp(context)
      }
      let i = comps.findIndex(comp => comp.name == compName)
      comps[i].layers = getArtboardLayers(artboard)
      analytics('Update', true)
      return successMessage(compName + ' updated.')
    } else {
      comps.push({
        name: compName,
        layers: getArtboardLayers(artboard)
      })
      settings.setLayerSettingForKey(
        artboard,
        context.plugin.identifier(),
        comps
      )
      analytics('Save', true)
      return successMessage(compName + ' saved.')
    }
  }
}

export default saveComp

function getArtboardLayers(artboard) {
  let comp
  let layers = []
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

function saveCompDialog(items) {
  let buttons = ['Save', 'Cancel']
  let info = 'Please give a name to layer comp.'
  let accessory = comboBox(items)
  let response = alert(info, buttons, accessory).runModal()
  let result = accessory.stringValue()
  if (response === 1000) {
    if (!result.length() > 0) {
      return saveCompDialog(items)
    }
    return result
  }
}

function updateCompDialog(compName) {
  let buttons = ['Update', 'Cancel']
  let message = 'Are you sure?'
  let info = 'This will update "' + compName + '" comp.'
  return alert(info, buttons, null, message).runModal()
}
