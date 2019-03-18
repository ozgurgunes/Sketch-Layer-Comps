import sketch from 'sketch/dom'
import settings from 'sketch/settings'
import send from 'sketch-module-google-analytics'
import * as UI from './ui.js'

export const getArtboard = selection => {
  let artboard
  switch (true) {
    case (selection.length == 1 &&
      selection.layers[0].type == sketch.Types.Artboard):
      artboard = selection.layers[0]
      break;
    case (selection.length == 1 &&
      selection.layers[0].getParentArtboard() != undefined):
      artboard = selection.layers[0].getParentArtboard()
      break;
    default:
      analytics("Selection Error")
      throw UI.error("Please select an artboard.")
  }
  return artboard
}

export const getComps = (artboard, error) => {
  let comps = settings
    .layerSettingForKey(artboard, context.plugin.identifier()) || []
  if (error && comps.length < 1) {
    analytics("No Comps")
    throw UI.dialog("There are not any layer comps.")
  }
  return comps.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
}

export const analytics = (label, value) => {
  const ID = "UA-5738625-2"
  const payload = {}
  payload.ec = context.plugin.name()
  payload.ea = context.command.name()
  if (label) {
    payload.el = label
  }
  if (value) {
    payload.ev = value
  }
  return send(context, ID, 'event', payload)
}
