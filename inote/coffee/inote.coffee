@iNote = (domContainer) ->
    
    _container = domContainer
    CELLS = []
    _themeName = ""
    
    #Cell number generator
    getNewCellNumber = ->
        if CELLS.length is 0 then 0 else  1+Math.max (c.getNumber() for c in CELLS)...

    
    ###
    find cell index in CELLS array  by cell number
    ###
    getIndexByCellNumber = (cellNumber) ->
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
        newCell.unlock()
        newCell.getJQueryCell().insertAfter $("#cell" + cellNumber)
        CELLS.splice i + 1, 0, newCell
        newCell.setFocus 0, 0
        newCell
    
    
    insertCellBefore = (cellNumber) ->
        i = getIndexByCellNumber(cellNumber)
        return    if i is -1
        newCell = createNewCell(getNewCellNumber())
        newCell.unlock()
        newCell.getJQueryCell().insertBefore $("#cell" + cellNumber)
        CELLS.splice i, 0, newCell
        newCell.setFocus 0, 0
        newCell
    
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
        i = -1
        cellNumber = $(event.target).parents(".cell").data("number")
        
        for C in CELLS
            i++
            if cellNumber is C.getNumber()
                return { cell:C, index:i, number: cellNumber }
        
        return { cell:null, index:-1, number: cellNumber }

    
    
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
    
    
    
    setXmlText = (xmlText) ->
        notebook = $(xmlText)
        _themeName = notebook.attr("theme")
        cells = notebook.find("cell")

        for c in cells
            cell = $(c)
            newCell = appendNewCell(cell.attr("number"))
            newCell.setXml cell
        return
    
    
    getXmlText = (notebookName) ->
        notebook = $("<inote name='#{notebookName}' theme='#{_themeName}'/>")
        for C in  CELLS
            notebook.append C.getXml()
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
        for C in CELLS
            C.getEditor().setOption "theme", themeName
            C.getJavascriptTextViewer().setOption "theme", themeName

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
