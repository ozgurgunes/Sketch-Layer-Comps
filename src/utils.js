import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import analytics from '@ozgurgunes/sketch-plugin-analytics'
import {
  errorMessage,
  alert
} from '@ozgurgunes/sketch-plugin-ui'

export function getArtboard(selection) {
  let artboard
  switch (true) {
    case selection.length == 1 &&
      selection.layers[0].type == sketch.Types.Artboard:
      artboard = selection.layers[0]
      break
    case selection.length == 1 &&
      selection.layers[0].getParentArtboard() != undefined:
      artboard = selection.layers[0].getParentArtboard()
      break
    default:
      analytics('Selection Error')
      return errorMessage('Please select an artboard.')
  }
  return artboard
}

export function getComps(artboard, error) {
  let comps =
    settings.layerSettingForKey(artboard, context.plugin.identifier()) || []
  if (error && comps.length < 1) {
    analytics('No Comps')
    return alert('There are not any layer comps.').runModal()
  }
  return comps.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
}
