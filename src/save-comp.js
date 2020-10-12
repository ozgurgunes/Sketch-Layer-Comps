import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import analytics from './analytics'
import * as UI from './ui'
import { getArtboard, getComps } from './utils'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

function saveComp(context) {
  try {
    let artboard = getArtboard(selection)
    let comps = getComps(artboard)
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
        return UI.success(compName + ' updated.')
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
        return UI.success(compName + ' saved.')
      }
    }
  } catch (e) {
    console.log(e)
    return e
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
  let accessory = UI.comboBox(items)
  let response = UI.dialog(info, accessory, buttons)
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
  return UI.dialog(info, null, buttons, message)
}
