var app = [NSApplication sharedApplication];
var pluginIdentifier = "com.gunesozgur.sketch.layer-comps"; 
var pluginKey = "LayerComps";
var defaultCompName = "Last Document State"

function createDialog(message, info, accessory, buttons){
    buttons = buttons || ['OK', 'Cancel']
    var alert = [[NSAlert alloc] init]
    [alert setMessageText: message]
    [alert setInformativeText: info]
    buttons.forEach(function(data){
        [alert addButtonWithTitle: data]
    })
    if (accessory) {
        [alert setAccessoryView: accessory]
    }        
    return [alert runModal]
}

function createCombobox(msg, info, items, selectedItemIndex){
    items.splice(items.indexOf(defaultCompName),1)
    items.sort().unshift('')
    selectedItemIndex = selectedItemIndex || 0
    var buttons = ['Save', 'Cancel']
    var accessory = [[NSComboBox alloc] initWithFrame:NSMakeRect(0,0,240,25)]
    [accessory addItemsWithObjectValues: items]
    [accessory selectItemAtIndex: selectedItemIndex]
    [accessory setEditable: true]
    [accessory setCompletes: true]
    
    var response = createDialog(msg, info, accessory, buttons)
    //var selected = [accessory indexOfSelectedItem]
    var result = [accessory stringValue]
    if (response === 1000) {
        if (!result.length()>0) {
            [app displayDialog: "Please give a name to new layer comp"];
            items.shift()
            return createCombobox(msg, info, items, selectedItemIndex)
        }
        return result
    }
}

function createSelect (msg, info, items, selectedItemIndex){
    var buttons = ['Apply', 'Cancel']
    if (items.length < 1) {
        return [app displayDialog: "No layer comps" ];
    }
    selectedItemIndex = selectedItemIndex || 0
	var accessory = [[NSPopUpButton alloc] initWithFrame:NSMakeRect(0, 0, 240, 25)]
    [accessory addItemsWithTitles: items]
    [accessory selectItemAtIndex: selectedItemIndex]

    var response = createDialog(msg, info, accessory, buttons)
    var result = [accessory titleOfSelectedItem]
    if (response === 1000) {
        return result
    }
}


function createList(msg, info, items, selectedItemIndex) {
    items.sort()
    items.splice(items.indexOf(defaultCompName),1)
    selectedItemIndex = selectedItemIndex || 0
    var buttons = ['Delete', 'Cancel', 'Delete All']
 
    var accessory = [[NSView alloc] initWithFrame:NSMakeRect(0,0,240,120)]
    var scrollView = [[NSScrollView alloc] initWithFrame:NSMakeRect(0,0,240,120)]
    var scrollContent = [[NSView alloc] initWithFrame:NSMakeRect(0,0,240,items.length*24+10)]

    var comps = [];
    items.forEach(function(compName, i){
        comps[i] = NSButton.alloc().initWithFrame(NSMakeRect(5,5+i*24,200,20));
        comps[i].setButtonType(NSSwitchButton);
        comps[i].setTitle(compName);
        comps[i].setState(false);
        scrollContent.addSubview(comps[i]);
    })

    scrollContent.setFlipped(true);
    scrollView.setHasVerticalScroller(true);
    scrollView.setHasHorizontalScroller(false);
    scrollView.setDocumentView(scrollContent);

    accessory.addSubview(scrollView)

    var response = createDialog(msg, info, accessory, buttons)
    var selection = []
    if (response === 1002) {
        var confirmed = createDialog('Are you sure?', 'All layer comps will be deleted')
        if (confirmed === 1000) {
            comps.forEach(function(comp, i){
                selection.push(comp.title())
            })
            return selection
        }
    }
    if (response === 1000) {
        comps.forEach(function(comp, i){
            if (comp.state()) {
                selection.push(comp.title())
            }
        })
        return selection
    }
}