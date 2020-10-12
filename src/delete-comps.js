import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import analytics from './analytics'
import * as UI from './ui'
import { getArtboard, getComps } from './utils'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

export default function(context) {
  try {
    let artboard = getArtboard(selection)
    let comps = getComps(artboard)
    let optionList = UI.optionList(comps.map(comp => comp.name))
    let accessory = UI.scrollView(optionList.view)
    let response = deleteCompsDialog(accessory)
    if (response === 1002) {
      let confirmed = deleteAllDialog()
      if (confirmed === 1000) {
        settings.setLayerSettingForKey(
          artboard,
          context.plugin.identifier(),
          []
        )
        analytics('Delete All', comps.length)
        return UI.success('All ' + comps.length + ' layer comps deleted.')
      }
    }
    if (response === 1000) {
      if (optionList.getSelection().length == 0) {
        analytics('Delete None')
        return UI.error('Nothing deleted.')
      }
      optionList
        .getSelection()
        .reverse()
        .map(item => comps.splice(item, 1))
      settings.setLayerSettingForKey(
        artboard,
        context.plugin.identifier(),
        comps
      )
      analytics('Delete Selected', optionList.getSelection().length)
      return UI.success(
        optionList.getSelection().length + ' layer comps deleted.'
      )
    }
  } catch (e) {
    console.log(e)
    return e
  }
}

function deleteCompsDialog(accessory) {
  let buttons = ['Delete', 'Cancel', 'Delete All']
  let info = 'Please select layer comps to be deleted.'
  return UI.dialog(info, accessory, buttons)
}

function deleteAllDialog() {
  let buttons = ['Delete All', 'Cancel']
  let message = 'Are you sure?'
  let info = 'All layer comps will be deleted!'
  return UI.dialog(info, null, buttons, message)
}
