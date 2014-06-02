@iNote = (domContainer) ->
    
    _container = domContainer
    CELLS = []
    _themeName = ""
    
    #Cell number generator
    getNewCellNumber = ->
        #n = 0
        #i = 0

        #while i < CELLS.length
        #    n = CELLS[i].getNumber() + 1    if n <= CELLS[i].getNumber()
        #    i++
        #n
        1 + Math.max ( c.getNumber() for c in CELLS )
    
    ###
    find cell index in CELLS array  by cell number
    ###
    getIndexByCellNumber = (cellNumber) ->
        #i = 0

        #while i < CELLS.length
        #    return i    if cellNumber is CELLS[i].getNumber()
        #    i++
        #-1
        ( c.getNumber() for c in CELLS ).indexOf(cellNumber)

    
    deleteCell = (cellNumber) ->
        i = getIndexByCellNumber(cellNumber)
        return    if i is -1
        CELLS[i].getJQueryCell().remove()
        CELLS.splice i, 1
        return

    
    inserCellAfter = (cellNumber) ->
        i = getIndexByCellNumber(cellNumber)
        return    if i is -1
        newCell = createNewCell(getNewCellNumber())
        newCell.getJQueryCell().insertAfter $("#cell" + cellNumber)
        CELLS.splice i + 1, 0, newCell
        newCell.setFocus 0, 0
        newCell
    
    
    insertCellBefore = (cellNumber) ->
        i = getIndexByCellNumber(cellNumber)
        return    if i is -1
        newCell = createNewCell(getNewCellNumber())
        newCell.getJQueryCell().insertBefore $("#cell" + cellNumber)
        CELLS.splice i, 0, newCell
        
        #CELLS.unshift(newCell);
        newCell.setFocus 0, 0
        newCell
    
    # function printCells()
    # {
    # 	var s="";
    # 	for (var i = 0; i < CELLS.length; i++) {
    # 		s+=" "+CELLS[i].getNumber();
    # 	}
    # 	console.log("CELLS: "+s);
    
    # }
    
    
    globalKeyHandler = (event) ->
        key = event.which
        ci = getCellInfo(event)
        cell = ci.cell
        index = ci.index
        cellNumber = ci.number
        
        #if(key == 13) saveNotebook();
        if key is 13 and event.shiftKey
            appendNewCell getNewCellNumber()    if isCellLast(index)
            moveFocusToNextCell index
        else if key is 38 and cell.cursorOnFirstLine() #arrow up
            moveFocusToPreviousCell index
        #arrow down
        else moveFocusToNextCell index    if key is 40 and cell.cursorOnLastLine()
        return
    
    
    createNewCell = (cellNumber) ->
        newCell = new Cell(cellNumber, _themeName)
        
        #callbacks
        newCell.setDeleteCallback deleteCell
        newCell.setInsertBeforeCallback insertCellBefore
        newCell.setInsertAfterCallback inserCellAfter
        newCell
    
    
    appendNewCell = (cellNumber) ->
        newCell = createNewCell(cellNumber)
        newCell.getJQueryCell().appendTo _container
        CELLS.push newCell
        
        #newCell.setFocus(0,0);
        newCell
    
    
    getCellInfo = (event) ->
        c = $(event.target).parents(".cell")
        cellNumber = c.data("number")
        i = 0

        while i < CELLS.length
            if cellNumber is CELLS[i].getNumber()
                return (
                    cell: CELLS[i]
                    index: i
                    number: cellNumber
                )
            i++
        cell: null
        index: -1
        number: cellNumber
    
    
    isCellFirst = (index) ->
        index <= 0
    
    
    isCellLast = (index) ->
        index >= CELLS.length - 1
    
    
    moveFocusToNextCell = (index) ->
        return    if isCellLast(index)
        return    if fullScreen(index)
        #removeFocusAll()
        c.removeFocus() for c in CELLS
        nextCell = CELLS[index + 1]
        nextCell.setFocus()
        nextCell.setCursorOnFirstLine()
        return
    
    
    moveFocusToPreviousCell = (index) ->
        return    if isCellFirst(index)
        return    if fullScreen(index)
        #removeFocusAll()
        c.removeFocus() for c in CELLS
        prevCell = CELLS[index - 1]
        prevCell.setFocus()
        prevCell.setCursorOnLastLine()
        return
    
    
    fullScreen = (index) ->
        editor = CELLS[index].getEditor()
        
        #TODO Check for full screen mode
        isFullScreen editor
    
    
    #removeFocusAll = ->
    #    c.removeFocus() for c in CELLS
    #    return

        #i = 0

        #while i < CELLS.length
        #    CELLS[i].removeFocus()
        #    i++
        #return
    
    
    setXmlText = (xmlText) ->
        notebook = $(xmlText)
        _themeName = notebook.attr("theme")
        cells = notebook.find("cell")
        i = 0

        while i < cells.length
            cell = $(cells[i])
            newCell = appendNewCell(cell.attr("number"))
            newCell.setXml cell
            i++
        return
    
    
    getXmlText = (notebookName) ->
        notebook = $("<inote name='" + notebookName + "' theme='" + _themeName + "'/>")
        i = 0

        while i < CELLS.length
            notebook.append CELLS[i].getXml()
            i++
        notebook.wrap("<wrapper/>").parent().html()
    
    
    _init = ->
        appendNewCell(getNewCellNumber()).setFocus 0, 0
        _container.bind "keydown", globalKeyHandler
        return
    
    
    clear = ->
        cells = _container.find(".cell").remove()
        CELLS = []
        return
    
    
    setTheme = (themeName) ->
        _themeName = themeName
        i = 0

        while i < CELLS.length
            editor = CELLS[i].getEditor()
            editor.setOption "theme", themeName
            
            #var javaScriptViwer = CELLS[i].getJavascriptTextViewer();
            #editor.setOption("theme", themeName);
            CELLS[i].getJavascriptTextViewer().setOption "theme", themeName
            i++
        return
    
    
    getTheme = ->
        _themeName
    
    #PUBLIC
    @setXmlText = setXmlText
    @getXmlText = getXmlText
    @clear = clear
    @init = _init
    @setTheme = setTheme
    @getTheme = getTheme
    return
