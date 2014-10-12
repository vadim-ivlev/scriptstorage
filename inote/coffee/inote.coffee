@iNote = (domContainer) ->
    
    _container = domContainer
    CELLS = []
    _themeName = ""
    _keyMap = "default"
    
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
        newCell = new Cell(cellNumber, _themeName, _keyMap)
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
        #newCell.unlock()
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
    
    
    
    
    # Set/Get XML ==========================================
    _VER="1"

    getXmlText = (notebookName) ->
        if _VER is "1"
            return getXmlText1(notebookName)
        else
            return getXmlText0(notebookName)
    
    

    setXmlText = (xmlText) ->
        if $(xmlText).attr("version") is "1"
            setXmlText1(xmlText)
        else
            setXmlText0(xmlText)
    


    setXmlText0 = (xmlText) ->
        notebook = $(xmlText)
        _themeName = notebook.attr("theme")
        _keyMap = notebook.attr("keyMap")
        cells = notebook.find("cell")

        for c in cells
            cell = $(c)
            newCell = appendNewCell(cell.attr("number"))
            newCell.setXml cell
        return
    
    
    getXmlText0 = (notebookName) ->
        notebook = $("<inote name='#{notebookName}' theme='#{_themeName}' keyMap='#{_keyMap}'/>")
        for C in  CELLS
            notebook.append C.getXml()
        notebook.wrap("<wrapper/>").parent().html()
    

    setXmlText1 = (xmlText) ->
        notebook = $(xmlText)
        _themeName = notebook.attr("theme")
        _keyMap = notebook.attr("keyMap")
        cells = notebook.find("div.cell")

        for c in cells
            cell = $(c)
            newCell = appendNewCell(cell.attr("number"))
            newCell.setXml cell
        return
    
    
    getXmlText1 = (notebookName) ->
        notebook = $("<div class='book' version='1' name='#{notebookName}' theme='#{_themeName}' keyMap='#{_keyMap}'/>")
        for C in  CELLS
            notebook.append C.getXml()
        notebook.wrap("<wrapper/>").parent().html()
    




   # ===================================================== 
   # creates a new empty notebook with one empty cell
    _init = ->
        nc=appendNewCell(getNewCellNumber())
        _bindKeys()
        nc.setFocus 0, 0
        nc.unlock()
        return
   
    # binds keys to container
    _bindKeys = ->
        _container.bind "keydown", globalKeyHandler

    
    clear = ->
        cells = _container.find(".cell").remove()
        CELLS = []
    
    
    setTheme = (themeName) ->
        _themeName = themeName
        for C in CELLS
            C.setTheme themeName

    getTheme = ->
        _themeName
    
    setKeyMap = (keyMap) ->
        _keyMap = keyMap
        for C in CELLS
            C.setKeyMap keyMap

    getKeyMap = ->
        _keyMap
    
    # executes the cell 
    runCell = (cellNumber) ->
        i = getIndexByCellNumber(cellNumber)
        if i==-1
            return
        CELLS[i].execute()
    
    #PUBLIC
    @setXmlText = setXmlText
    @getXmlText = getXmlText
    @clear = clear
    @init = _init
    @bindKeys = _bindKeys
    @setTheme = setTheme
    @getTheme = getTheme
    @setKeyMap = setKeyMap
    @getKeyMap = getKeyMap
    @runCell = runCell
    return
