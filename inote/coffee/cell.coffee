###

cellNumber - defines names for the cell and input and output
themeName - color scheme of the editor
keyMap - default| vim | sublime | emac

###

#@PRINT

#@CLEAR


window.print = null
window.clear = null

@Cell = (cellNumber, themeName, keyMap) ->
    
    _n = undefined
    _jQueryCell = undefined
    _codemirror = undefined
    _javascriptTextViewer = undefined
    _inputCell = undefined
    _outputCell = undefined
    _javascriptCell = undefined
    _mode = "javascript"
    
    _lockButton = undefined
    _fullscreenButton = undefined
    
    _deleteCallback = null
    _insertBeforeCallback = null
    _insertAfterCallback = null
    
    _inCollapsed = false
    _outCollapsed = false
    
    _onfirst = false
    _onlast = false
    _compileTimeout = undefined
    _keyMap = "default"



    _create = (celNum, theme, keyM) ->
        
        _jQueryCell = $("""
            <div class='cell'>

                <div class='input_header' style='min-height:23px;'>
                    <span class='hideInputButton toolButton hidable000 uppertab' ></span> <!-- &#x25BC -->
                    <select class='selectButton hidable000'>
                        <option value='javascript'>JavaScript</option>
                        <option value='text/x-coffeescript'>CoffeeScript</option>
                        <option value='text/html'>HTML</option>
                        <option value='markdown'>Markdown</option>
                    </select>
                    <span class='showJavascriptButton toolButton hidable000' >Show Javascript</span>
                    <span class='deleteButton toolButton  hidable000 icon-remove' title='delete cell' ></span><!-- &nbsp;b&#x00D7&nbsp; -->
                    <span class='toolButton hidable000 icon-expand' style='float:right' title='Fullscreen on/of'>Alt-F11</span>
                    <span class='keyMap toolButton hidable000' style='float:right' title='editor mode'></span>
                </div>
                
                <table class='codeArea' > 
                    <tr>
                        <td id='in_' class='inputCell' ></td>
                        <td id='js_' class='javascriptCell'></td>
                    </tr>
                </table>
                
                <span class='input_expander toolButton hidable000 uppertab'></span> 

                <span class='output_header'>
                    <span class='hideOutputButton toolButton hidable000 uppertab'></span> <!-- &#x25BC -->
                    <span class='clearOutputButton toolButton '>clear</span>
                    <span class='toolButton icon-play' title='<Ctrl-Ent> to run.  <Shift-Ent> to run and go to the next cell. '>run</span>
                </span>
                
                <div id='out_' class='outputCell lr_padded'></div>
                
                
                <div class='insertBefore smallButton  hidable000 icon-plus' title='add cell'></div>
                <div class='insertAfter smallButton  hidable000 icon-plus' title='add cell'></div>
                <div class='lockButton smallButton icon-pencil' title='edit/lock' style='position:absolute;top:0px;left:-27px;'></div>
            </div>
        """)
    
        _inputCell = _jQueryCell.find(".inputCell")
        _inputCell[0]._compileLater = _compileLater
        _outputCell = _jQueryCell.find(".outputCell")
        _javascriptCell = _jQueryCell.find(".javascriptCell")
        
        _lockButton = _jQueryCell.find(".lockButton")
        _fullscreenButton = _jQueryCell.find(".icon-expand")
        
        _codemirror = createCodeMirror(_inputCell[0])
        _codemirror.setOption "readOnly", "nocursor"
        _javascriptTextViewer = createCodeMirror(_javascriptCell[0])
        _javascriptTextViewer.setOption "readOnly", "nocursor"
        _javascriptTextViewer.setValue ""
       
        _setTheme theme

        _attachEvents()
        _setNumber celNum
        _setMode _mode
        _setOutputCollapsed _outCollapsed
        _setInputCollapsed _outCollapsed
        _setKeyMap keyM
        return
    
    
    _call = (f, param) ->
        f param    if typeof (f) is "function"
        return
    
    _setKeyMap = (v)->
        _keyMap = if v then v else "default"
        if _keyMap is "undefined" then _keyMap = "default"
        _jQueryCell.find(".keyMap").text _keyMap
        _codemirror.setOption "vimMode", (_keyMap is "vim")
        _codemirror.setOption "keyMap", _keyMap
        @

    _setTheme = (themeName) ->
            th = if themeName then themeName else "default"
            _codemirror.setOption "theme", th
            _javascriptTextViewer.setOption "theme", th


    
    _showJavascriptText = ->
        _jQueryCell.find(".showJavascriptButton").text "Hide Javascript"
        _javascriptCell.show()
        _javascriptTextViewer.refresh()
        _compile_CoffeeScript()
        _jQueryCell.find(".codeArea").colResizable()
        return
    
    
    _hideJavascriptText = ->
        _jQueryCell.find(".showJavascriptButton").text "Show Javascript"
        _javascriptCell.hide()
        return
    
    
    _switchJavascriptText = ->
        if _jQueryCell.find(".showJavascriptButton").text() is "Show Javascript"
            _showJavascriptText()
        else
            _hideJavascriptText()
        return
    
    # collapse output iarea ===================================================
    _CPLTIME=100

    _setOutputCollapsed = (collapsed) ->
        _outCollapsed = collapsed
        if collapsed
            _jQueryCell.find(".outputCell").hide _CPLTIME, ->
                _jQueryCell.find(".hideOutputButton").html "show [out#{_n}]" #Show output &#x25BA
        else
            _jQueryCell.find(".outputCell").show _CPLTIME
            _jQueryCell.find(".hideOutputButton").html "hide [out#{_n}]" #Hide output &#x25BC
        saveNotebookLater?()
        return
    


    # collapse input area ===================================================
    _setInputCollapsed = (collapsed) ->
        _inCollapsed = collapsed
        if collapsed
            _jQueryCell.find(".codeArea").hide()
            _jQueryCell.find(".input_expander").addClass('visible')
            _jQueryCell.find(".input_header").hide()
            _jQueryCell.find(".hideInputButton").html "show [in#{_n}]" #Show input&nbsp;&nbsp;&#x25BA
        else
            _jQueryCell.find(".codeArea").show()
            _jQueryCell.find(".input_expander").removeClass('visible')
            _jQueryCell.find(".input_header").show()
            _jQueryCell.find(".hideInputButton").html "hide [in#{_n}]" #Hide input &nbsp;&nbsp;&#x25BC
        saveNotebookLater?()
        return



    # make it read only ======================================================
    _lock = ->
        _jQueryCell.find(".hidable000").removeClass "visible"
        _jQueryCell.find(".codeArea").removeClass "visibleBorder"
        _jQueryCell.removeClass "visibleBorder shadow"
        _codemirror.setOption "readOnly", "nocursor"



    # make it  editable =======================================================
    _unlock = ->
        _jQueryCell.find(".hidable000").addClass "visible"
        _jQueryCell.find(".codeArea").addClass "visibleBorder"
        _jQueryCell.addClass "visibleBorder shadow"
        _codemirror.setOption "readOnly", false
    
    _lockUnlock = ->
        if _lockButton.hasClass('unlocked')
            _lockButton.removeClass('unlocked')
            _lock()
        else
            _lockButton.addClass('unlocked')
            _unlock()


    # attach events to buttons ================================================
    _attachEvents = ->
        _inputCell.keydown _keyHandler
        _lockButton.click _lockUnlock
        _fullscreenButton.click _switchFullsreen
        $(".deleteButton", _jQueryCell).click -> _call _deleteCallback, _n
        $(".insertBefore", _jQueryCell).click -> _call _insertBeforeCallback, _n
        $(".insertAfter", _jQueryCell).click -> _call _insertAfterCallback, _n
        $(".icon-play", _jQueryCell).click _executeCode
        $(".clearOutputButton", _jQueryCell).click -> _outputCell.html ""; saveNotebook?()
        $(".hideOutputButton", _jQueryCell).click -> _setOutputCollapsed not _outCollapsed
        $(".hideInputButton", _jQueryCell).click -> _setInputCollapsed not _inCollapsed
        $(".input_expander", _jQueryCell).click -> _setInputCollapsed not _inCollapsed

        $(".showJavascriptButton", _jQueryCell).click _switchJavascriptText
        $(".selectButton", _jQueryCell).change ->
            mode = _jQueryCell.find(".selectButton").val()
            _setMode mode
            _codemirror.focus()

    _switchFullsreen = ->
        fs = not isFullScreen(_codemirror)
        setFullScreen(_codemirror, fs)
        if fs
            _fullscreenButton.addClass("fullscreen-top-right")
        else
            _fullscreenButton.removeClass("fullscreen-top-right")

    
    _setMode = (mode) ->
        _mode = mode
        _jQueryCell.find(".selectButton").val mode
        _codemirror.setOption "mode", mode
        if _mode is "text/x-coffeescript"
            _jQueryCell.find(".showJavascriptButton").show()
        else
            _hideJavascriptText()
            _jQueryCell.find(".showJavascriptButton").hide()
        saveNotebookLater?()
        return




    # Serializing to XML =====================================
    _VER="1"

    _getXml = ->
        if _VER is "1"
            return _getXml1()
        else
            return _getXml0()
    
    

    _setXml = (cell) ->
        if cell.attr("version") is "1"
            _setXml1(cell)
        else
            _setXml0(cell)


    _getXml0 = ->
        cell = $("<cell verion='0' number='#{_n}' mode='#{_mode}'/>")
        $("<in collapsed='#{_inCollapsed}'/>").text(_codemirror.getValue()).appendTo cell
        $("<out collapsed='#{_outCollapsed}'/>").text(_outputCell.html()).appendTo cell
        cell
    
    
    _setXml0 = (cell) ->
        number = cell.attr("number")
        _mode = cell.attr("mode")
        input = cell.find("in").first()
        output = cell.find("out").first()
        inputValue = input.text()
        outputValue = output.text()
        _codemirror.setValue inputValue
        _outputCell.html outputValue
        _setNumber number
        _setMode _mode
        _setOutputCollapsed output.attr("collapsed") is "true"
        _setInputCollapsed input.attr("collapsed") is "true"
        return
    
    
    _getXml1 = ->
        cell = $("<div class='cell' id='#{_jQueryCell.attr('id')}'  version='1' number='#{_n}' mode='#{_mode}'/>")
        $("<div class='inputCell'  id='#{_inputCell.attr('id')}' collapsed='#{_inCollapsed}'/>").text(_codemirror.getValue()).appendTo cell
        $("<div class='javascriptCell' id='#{_javascriptCell.attr('id')}'/>").text(_javascriptTextViewer.getValue()).appendTo cell
        $("<div class='outputCell' id='#{_outputCell.attr('id')}' collapsed='#{_outCollapsed}'/>").text(_outputCell.html()).appendTo cell
        cell
    
    
    _setXml1 = (cell) ->
        number = cell.attr("number")
        _mode = cell.attr("mode")
        
        input = cell.find("div.inputCell").first()
        output = cell.find("div.outputCell").first()
        js = cell.find("div.javascriptCell").first()
        
        _codemirror.setValue input.text()
        _outputCell.html output.text()
        _javascriptTextViewer.setValue js.text()
        
        _setNumber number
        _setMode _mode
        _setOutputCollapsed output.attr("collapsed") is "true"
        _setInputCollapsed input.attr("collapsed") is "true"
        return
    
    
    
    
    # =========================================================================
    _getSelectedRange = ->
        from: _codemirror.getCursor(true)
        to: _codemirror.getCursor(false)
    
    
    ### 
    _commentSelection = (isComment) ->
        range = _getSelectedRange()
        _codemirror.commentRange isComment, range.from, range.to
        return
    ###
    
    _keyHandler = (event) ->
        c=event.ctrlKey
        a=event.altKey
        s=event.shiftKey
        
        switch event.which
            when 13 # Enter
                if c or s
                    event.preventDefault()
                    _executeCode()
            when 122 # F11
                if a
                    event.preventDefault()
                    _switchFullsreen()
                    
        return
    
    
    _getNumber = ->
        Number _n
    
    
    _setNumber = (n) ->
        _n = Number(n)
        _jQueryCell.data "number", _n
        _jQueryCell.attr "id", "cell" + _n
        _inputCell.attr "id", "in" + _n
        _outputCell.attr "id", "out" + _n
        _javascriptCell.attr "id", "js" + _n
        _jQueryCell.find(".input_expander").html "show [in#{_n}]" # &nbsp;&nbsp;&#x25BA
        this
    
    
    _setFocus = (lineNumber, charNumber) ->
        _codemirror.refresh()
        _codemirror.focus()
        _codemirror.setCursor
            line: 0
            ch: 0
        return @
    
    
    _removeFocus = ->
    
    
    _executeCode = ->
        window.print =_print
        window.clear = _clearPrintArea

        _clearPrintArea()
        _outputCell.html ""
        
        try
            code = _codemirror.getValue()
            if _mode is "text/html"
                _outputCell.html code
            else if _mode is "markdown"
                converter = new Showdown.converter()
                html = converter.makeHtml(code)
                _outputCell.html "<div class='markdown'>" + html + "</div>"
            else if _mode is "javascript"
                eval.call(window, code)
            else if _mode is "text/x-coffeescript"
                _javascriptTextViewer.setValue ""
                compiledCode = CoffeeScript.compile(code,
                    bare: false
                )
                _javascriptTextViewer.setValue compiledCode
                _javascriptTextViewer.refresh()
                eval.call(window, compiledCode)
        catch e
            _printError "" + e
        return

    # Printing --------------------------------------
    _printArea = null

    _clearPrintArea = ->
        _printArea = null
        _outputCell.find("pre.noerror").remove()

    _createPrintArea = ->
        _printArea = $("<pre class='noerror'/>")
        _printArea.appendTo _outputCell

    


    _print = (o) ->
        _printArea ?= _createPrintArea()
        
        s = ""
        if o instanceof jQuery
            s = "{jQuery}"
        else
            if typeof(o) is "string"
                s = o
            else if typeof(o) is "number"
                s = o
            else
                try
                    s = JSON.stringify(o, (key, value) ->
                        (if this[key] instanceof Function then value.toString() else value)
                    , " ")
                catch e
                    s = "Error: JSON.stringify\n"
        _printArea.text( _printArea.text() + s )
        return

    
    _printError = (o) ->
        _outputCell.html "<div class='error'>" + o + "</div>"
        return
    
    
    _cursorOnLastLine = ->
        line = _codemirror.getCursor().line
        lCount = _codemirror.lineCount()
        retValue = (_onlast and (line >= lCount - 1))
        _onlast = (line >= lCount - 1)
        retValue
    
    
    _cursorOnFirstLine = ->
        line = _codemirror.getCursor().line
        retValue = (_onfirst and (line <= 0))
        _onfirst = (line <= 0)
        retValue
    
    
    _setCursorOnLastLine = (charPos) ->
        lastLine = _codemirror.lineCount() - 1
        _codemirror.setCursor line: lastLine #, ch:charPos});
        return
    
    
    _setCursorOnFirstLine = (charPos) ->
        _codemirror.setCursor line: 0 #, ch:charPos});
        return
    
    # Serialise XML to string
    toXmlString = (data) ->
        #data.xml check for IE
        (if data.xml then data.xml else (new XMLSerializer()).serializeToString(data))
    
    
    _compileLater = ->
        clearTimeout _compileTimeout
        if _mode is "text/x-coffeescript"
            _compileTimeout = setTimeout(_compile_CoffeeScript, 500)
        else _compileTimeout = setTimeout(_compile_Markdown, 500)    if _mode is "markdown"
        return
    
    
    
    # Compiles markdown and writes it into output
    _compile_Markdown = ->
        return    if _outCollapsed
        code = _codemirror.getValue()
        converter = new Showdown.converter()
        html = converter.makeHtml(code)
        _outputCell.html "<div class='markdown'>" + html + "</div>"
        return
    
    
    
    
    # Compiles CoffesScript and writes it into output
    _compile_CoffeeScript = ->
        javaScriptText = _javascriptCell
        if javaScriptText.is(":visible")
            code = _codemirror.getValue()
            compiledCode = ""
            try
                compiledCode = CoffeeScript.compile(code,
                    bare: false
                )
            catch e
                compiledCode = e.toString()
            _javascriptTextViewer.setValue compiledCode
            _javascriptTextViewer.refresh()
        return
    
    
    
    #EXECUTION **************************************
    _create cellNumber, themeName, keyMap
    
    
    #RETURN *****************************************
    getJQueryCell: -> _jQueryCell
    getEditor: -> _codemirror
    getJavascriptTextViewer: -> _javascriptTextViewer

    getInputValue: -> _codemirror.getValue()
    setInputValue: (code) ->
        _codemirror.setValue code
        this

    getOutputValue: -> _outputCell.html()
    setOutputValue: (code) ->
        _outputCell.html code
        this

    getCursor: -> _codemirror.getCursor()
    setCursor: (obj_line_ch) ->
        _codemirror.setCursor obj_line_ch
        this

    getLineCount: -> _codemirror.lineCount()

    setXml: _setXml
    getXml: _getXml

    setNumber: _setNumber
    getNumber: _getNumber
    
    cursorOnFirstLine: _cursorOnFirstLine
    cursorOnLastLine: _cursorOnLastLine
    
    setCursorOnFirstLine: _setCursorOnFirstLine
    setCursorOnLastLine: _setCursorOnLastLine
    
    # setLanguage: function(mode){_mode=mode; return this;},
    # getLanguage: function(){return _mode},
    execute: _executeCode
    
    setInsertAfterCallback: (f) ->
        _insertAfterCallback = f
        return

    setInsertBeforeCallback: (f) ->
        _insertBeforeCallback = f
        return

    setDeleteCallback: (f) ->
        _deleteCallback = f
        return

    setFocus: _setFocus
    removeFocus: _removeFocus

    lock: _lock
    unlock: _unlock

    setKeyMap: _setKeyMap
    setTheme: _setTheme





    
