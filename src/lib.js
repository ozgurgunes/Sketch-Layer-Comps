import settings from 'sketch/settings'

export const DEFAULT_NAME = "Last State" 

export const saveDefault = (artboard, comps, compName) => {
  var layerData, compLayers = []
  artboard.layers.map(layer => {
      layerData = {
        id: layer.id,
        frame: layer.frame,
        transform: layer.transform,
        hidden: layer.hidden,
        locked: layer.locked
      }
      compLayers.push(layerData)
    })
  comps.push({
    name: compName,
    layers: compLayers
  })
  settings.setLayerSettingForKey(artboard,
    context.plugin.identifier(), comps)
}
