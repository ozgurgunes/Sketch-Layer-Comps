import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import analytics from '@ozgurgunes/sketch-plugin-analytics'
import {
  successMessage,
  errorMessage,
  optionList,
  scrollView,
  alert
} from '@ozgurgunes/sketch-plugin-ui'
import { getArtboard, getComps } from './utils'

var doc = sketch.getSelectedDocument()
var selection = doc.selectedLayers

export default function(context) {
  let artboard = getArtboard(selection)
  if (!artboard) return
  let comps = getComps(artboard)
  if (!comps) return
  let list = optionList(comps.map(comp => comp.name))
  let accessory = scrollView(list.view)
  let response = deleteCompsDialog(accessory)
  if (response === 1002) {
    let confirmed = deleteAllDialog()
    if (confirmed === 1000) {
      settings.setLayerSettingForKey(artboard, context.plugin.identifier(), [])
      analytics('Delete All', comps.length)
      return successMessage('All ' + comps.length + ' layer comps deleted.')
    }
  }
  if (response === 1000) {
    if (list.getSelection().length == 0) {
      analytics('Delete None')
      return errorMessage('Nothing deleted.')
    }
    list
      .getSelection()
      .reverse()
      .map(item => comps.splice(item, 1))
    settings.setLayerSettingForKey(artboard, context.plugin.identifier(), comps)
    analytics('Delete Selected', list.getSelection().length)
    return successMessage(list.getSelection().length + ' layer comps deleted.')
  }
}

function deleteCompsDialog(accessory) {
  let buttons = ['Delete', 'Cancel', 'Delete All']
  let info = 'Please select layer comps to be deleted.'
  return alert(info, buttons, accessory).runModal()
}

function deleteAllDialog() {
  let buttons = ['Delete All', 'Cancel']
  let message = 'Are you sure?'
  let info = 'All layer comps will be deleted!'
  return alert(info, buttons, null, message).runModal()
}
