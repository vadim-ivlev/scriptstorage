
function Cell(cellNumber, themeName)
{

	var _n;
	var _jQueryCell;
	var _codemirror;
    var _javascriptTextViewer;
	var _inputCell;
	var _outputCell;
	var _inputTitle;
	var _outputTitle;
	var _mode="javascript";

	var _deleteCallback=null;
	var _insertBeforeCallback=null;
	var _insertAfterCallback=null;

	var _inCollapsed=false;
	var _outCollapsed=false;


	function _create(celNum,theme) {
		_jQueryCell = $(
		'<div class="cell" collapsed="no" outCollapsed="no" inCollapsed="no" access="public">'+
            //input header
            '<div class="input_header">'+
                '<span class="hideInputButton toolButton hidable" >&#x25BC</span>'+ //Hide input
                //'<span class="inputTitle hidable"></span>'+
                '<select class="selectButton hidable">'+
                    '<option value="javascript">JavaScript</option>'+
                    '<option value="text/x-coffeescript">CoffeeScript</option>'+
                    '<option value="text/html">HTML</option>'+
                    '<option value="markdown">Markdown</option>'+
                '</select>'+
                '<span class="formatSelectionButton toolButton hidable">Format</span>'+ //Format selection
                '<span class="showJavascriptButton toolButton hidable" >Show Javascript</span>'+

                '<span class="deleteButton toolButton  hidable" title="delete cell" >&nbsp;&#x00D7&nbsp;</span>'+
            '</div>'+

            // Code area
            '<table class="codeArea" ><tr>'+
                //input
                '<td id="in_" class="inputCell" ></td>'+
               //javascript text
                '<td  class="javascriptText"></td>'+
            '</tr></table>'+
            '<div class="input_expander toolButton hidable">&#x25BA</div>'+


            //output header
            '<div class="output_header">'+
                '<span class="hideOutputButton toolButton hidable">&#x25BC</span>'+ //Hide output
                //'<span class="outputTitle hidable"></span>'+
                '<span class="clearOutputButton toolButton hidable">Clear</span>'+
                '<span class="runButton hidable" title="<Ctrl-Ent> to Run.  <Shift-Ent> to run and go to the next cell. ">&#x25BA;</span>'+
		    '</div>'+

            //output
            '<div id="out_" class="outputCell lr_padded"></div>'+
            '<div class="output_expander toolButton hidable">&#x25BA</div>'+

            // add cell buttons
            '<div class="insertBefore smallButton  hidable" title="add cell">+</div>'+
            '<div class="insertAfter smallButton  hidable" title="add cell">+</div>'+

		'</div>'
		);



		_inputCell = _jQueryCell.find(".inputCell");
        _inputCell[0]._compileLater=_compileLater;
		_outputCell = _jQueryCell.find(".outputCell");
		_inputTitle = _jQueryCell.find(".inputTitle");
		_outputTitle = _jQueryCell.find(".outputTitle");

        _codemirror = createCodeMirror(_inputCell[0]);
        _codemirror.setOption("theme",theme || "eclipse");
        _javascriptTextViewer = createCodeMirror(_jQueryCell.find(".javascriptText")[0]);
        _javascriptTextViewer.setOption("readOnly","nocursor");
        _javascriptTextViewer.setOption("theme",theme || "eclipse");
        _javascriptTextViewer.setValue("");



		_attachEvents();
		_setNumber(celNum);
		_setMode(_mode);
		_setOutputCollapsed(_outCollapsed);
		_setInputCollapsed(_outCollapsed);
	}



//    function _selectTheme() {
//        var theme = _jQueryCell.find(".selectThemeButton").val();
//        _codemirror.setOption("theme", theme);
//    }


    function _call(f, param)
	{
		if (typeof(f)=="function" ) f(param);
	}


    function _showJavascriptText(){
        _jQueryCell.find(".showJavascriptButton").text("Hide Javascript");
        _jQueryCell.find(".javascriptText").show();
        _javascriptTextViewer.refresh();
        _compile_CoffeeScript();
        _jQueryCell.find(".codeArea").colResizable();
    }



    function _hideJavascriptText(){
        _jQueryCell.find(".showJavascriptButton").text("Show Javascript");
        _jQueryCell.find(".javascriptText").hide();
    }


    function _switchJavascriptText()
    {
        if (_jQueryCell.find(".showJavascriptButton").text()=="Show Javascript")
            _showJavascriptText();
        else
            _hideJavascriptText();
    }



	function _setOutputCollapsed(collapsed)
	{
		_outCollapsed=collapsed;
		if (collapsed)
		{
			_jQueryCell.find(".outputCell").hide();
            _jQueryCell.find(".output_expander").show();
			_jQueryCell.find(".output_header").hide();
			_jQueryCell.find(".hideOutputButton").html("[out"+_n+"] &#x25BA");//Show output
		}
		else
		{
			_jQueryCell.find(".outputCell").show();
            _jQueryCell.find(".output_expander").hide();
			_jQueryCell.find(".output_header").show();
			_jQueryCell.find(".hideOutputButton").html("[out"+_n+"] &#x25BC");//Hide output
		}
        if (saveNotebookLater) saveNotebookLater();
	}

	function _setInputCollapsed(collapsed)
	{
		_inCollapsed=collapsed;
		if (collapsed)
		{
			_jQueryCell.find(".codeArea").hide();
            _jQueryCell.find(".input_expander").show();
			_jQueryCell.find(".input_header").hide();
			_jQueryCell.find(".hideInputButton").html("[in"+_n+"] &#x25BA");//Show input
		}
		else
		{
			_jQueryCell.find(".codeArea").show();
            _jQueryCell.find(".input_expander").hide();
			_jQueryCell.find(".input_header").show();
			_jQueryCell.find(".hideInputButton").html("[in"+_n+"] &#x25BC");//Hide input
		}
        if (saveNotebookLater) saveNotebookLater();
	}


	function _attachEvents(){
		_inputCell.keydown(_keyHandler);

		$(".deleteButton",_jQueryCell).click(function(){
			_call( _deleteCallback, _n);
		});

		$(".insertBefore",_jQueryCell).click(function(){
			_call( _insertBeforeCallback, _n);
		});

		$(".insertAfter",_jQueryCell).click(function(){
			_call( _insertAfterCallback, _n);
		});


		$(".runButton",_jQueryCell).click( _executeCode );
		$(".clearOutputButton",_jQueryCell).click( function(){
            _outputCell.html("");
            if (saveNotebook)
                saveNotebook();
        } );
		$(".hideOutputButton",_jQueryCell).click( function(){ _setOutputCollapsed(!_outCollapsed);} );
        $(".hideInputButton",_jQueryCell).click( function(){ _setInputCollapsed(!_inCollapsed);} );
        $(".input_expander",_jQueryCell).click( function(){ _setInputCollapsed(!_inCollapsed);} );
        $(".output_expander",_jQueryCell).click( function(){ _setOutputCollapsed(!_outCollapsed);} );

        $(".formatSelectionButton",_jQueryCell).click( _autoFormatSelection);
        $(".showJavascriptButton",_jQueryCell).click( _switchJavascriptText);

     //   $(".selectThemeButton",_jQueryCell).change(_selectTheme);

        $(".selectButton",_jQueryCell).change(function(){
            var sel= _jQueryCell.find(".selectButton");
            var mode=$(sel).attr("value");
            _setMode(mode);
            _codemirror.focus();
        });

	}

	 

	function _setMode (mode) {
		_mode=mode;
        _jQueryCell.find('.selectButton').val(mode);
		_codemirror.setOption("mode",mode);
        if (_mode=="text/x-coffeescript")
        {
            _jQueryCell.find('.showJavascriptButton').show();
        }
        else
        {
            _hideJavascriptText();
            _jQueryCell.find('.showJavascriptButton').hide();
        }

        if (_mode=="javascript" || _mode=="text/html")
        {
            _jQueryCell.find('.formatSelectionButton').show();
        }
        else
        {
            _jQueryCell.find('.formatSelectionButton').hide();
        }
        if (saveNotebookLater) saveNotebookLater();
    }


	function _getXml()
	{
		var cell=$("<cell number='"+_n+"' mode='"+_mode+"'/>");
		$("<in collapsed='"+_inCollapsed+"'/>").text(_codemirror.getValue()).appendTo(cell);
		$("<out collapsed='"+_outCollapsed+"'/>").text(_outputCell.html()).appendTo(cell);
		return cell;
	}

	function _setXml(cell)
	{
		var number=cell.attr("number");
		_mode=cell.attr("mode");
		var input=cell.find("in").first();
		var output=cell.find("out").first();
		var inputValue=input.text();
		var outputValue=output.text();
		_codemirror.setValue(inputValue);
		_outputCell.html(outputValue);
		_setNumber(number);
		_setMode(_mode);
		_setOutputCollapsed(output.attr("collapsed")=="true");
		_setInputCollapsed(input.attr("collapsed")=="true");
	}


    function _getSelectedRange() {
        return { from: _codemirror.getCursor(true), to: _codemirror.getCursor(false) };
    }

    function _autoFormatSelection() {
        var range = _getSelectedRange();
        _codemirror.autoFormatRange(range.from, range.to);

    }

    function _commentSelection(isComment) {
        var range = _getSelectedRange();
        _codemirror.commentRange(isComment, range.from, range.to);
    }

    function _keyHandler(event) {
        //if (console) console.log("_keyHandler:"+event.which);
		if(event.which == 13) {

			event.preventDefault();
			if(event.shiftKey) {
				_executeCode();
			} else if(event.ctrlKey) {
				_executeCode();
			}
		}
        else if (event.which == 191 && event.ctrlKey ) //Ctrl+Alt+F
        {
            _commentSelection(! event.shiftKey);
        }



	}

	function _getNumber()
	{
		return Number(_n);
	}

	function _setNumber(n)
	{
		_n = Number(n);
		_jQueryCell.data("number", _n);
		_jQueryCell.attr("id","cell" + _n);
		_jQueryCell.attr("data-number",_n);
		_inputCell.attr("id","in" + _n );
		_outputCell.attr("id","out" + _n );
		_inputTitle.text(_inputCell.attr("id"));
		_outputTitle.text(_outputCell.attr("id"));
        _jQueryCell.find(".output_expander").html("[out"+_n+"] &#x25BA");
        _jQueryCell.find(".input_expander").html("[in"+_n+"] &#x25BA");
		return this;
	}



	function _setFocus(lineNumber, charNumber)
	{
		_codemirror.refresh();
		_codemirror.focus();
		_codemirror.setCursor({line:0,ch:0});
        //$(_codemirror).find("pre.CodeMirror-cursor").css("display","block");

		//_jQueryCell.addClass('selectedCell');
        //_jQueryCell.prepend("<span>a</span>");
        //if (console) console.log("focus _n="+_n);
	}

	function _removeFocus () {
		//_jQueryCell.removeClass('selectedCell');

        //$(_codemirror).find("pre.CodeMirror-cursor").css("display","none");
	}


	function _executeCode() {
		_outputCell.html("");
//        var b=$(".runButton",_jQueryCell);
//        b.fadeIn(400);
//        //b(400);
		try
		{
			var code = _codemirror.getValue();

			var result;
			if (_mode=="text/html")
			{
				_outputCell.html(code);
			}
			else if (_mode=="markdown")
			{
				var converter = new Showdown.converter();
				var html = converter.makeHtml(code);
				_outputCell.html("<div class='markdown'>"+html+"</div>");
			}
			else if (_mode=="javascript")
			{
				result = eval.call(window, code);
				_print(result);
			}
            else if (_mode=="text/x-coffeescript")
            {
                _javascriptTextViewer.setValue("");
                var compiledCode=CoffeeScript.compile(code, {bare: true});
                _javascriptTextViewer.setValue(compiledCode);
                _javascriptTextViewer.refresh();
                result = eval.call(window, compiledCode);
                _print(result);
            }
		} catch(e) {
			_printError(""+e);
		}
	}


	function _print(o)
	{
		//var typeOfObject="";

		if (typeof(o)=="undefined") return;

		var box=$("<pre class='noerror'/>");
		var s="";

		if (o instanceof jQuery) {
			s="{jQuery}";
		}
		else
		{
            try {
			s=JSON.stringify(o,function (key, value) {
	                return this[key] instanceof Function ?
	                    value.toString() : value;
	            }," ");
           }
            catch (e){
                return;
            }
		}
		box.text(s);
		_outputCell.html(box);
	}


	function _printError(o)
	{
//		_outputCell.html("<div class='error'>"+JSON.stringify(o)+"</div>");
		_outputCell.html("<div class='error'>"+o+"</div>");
	}

	var _onfirst=false;
	var _onlast=false;
	function _cursorOnLastLine()
	{
		var line=_codemirror.getCursor().line;
		var lCount=_codemirror.lineCount();

		var retValue=(_onlast && (line >= lCount-1));
		_onlast=(line >= lCount-1);
		return retValue;
	}

	function _cursorOnFirstLine()
	{
		var line=_codemirror.getCursor().line;
		var retValue=(_onfirst && (line <= 0));
		_onfirst=(line <= 0);
		return retValue;
	}

	function _setCursorOnLastLine(charPos)
	{
		var lastLine=_codemirror.lineCount()-1;
		_codemirror.setCursor({line:lastLine});//, ch:charPos});
	}

	function _setCursorOnFirstLine(charPos)
	{
		_codemirror.setCursor({line:0});//, ch:charPos});
	}




    /**
     Serialise XML to string
     */
    function toXmlString(data) {
    //data.xml check for IE
        return data.xml ? data.xml : (new XMLSerializer()).serializeToString(data);
    }

    var _compileTimeout;

    function _compileLater() {
        clearTimeout(_compileTimeout);
        if (_mode == "text/x-coffeescript") {
            _compileTimeout = setTimeout(_compile_CoffeeScript, 500);
        }
        else if (_mode == "markdown") {
            _compileTimeout = setTimeout(_compile_Markdown, 500);
        }
   }

    /**
     * Compiles markdown and writes it into output
     * @private
     */
    function _compile_Markdown() {
        if (_outCollapsed) return;

        var code = _codemirror.getValue();
        var converter = new Showdown.converter();
        var html = converter.makeHtml(code);
        _outputCell.html("<div class='markdown'>" + html + "</div>");
        //if (saveNotebookLater) saveNotebookLater();

    }


    /**
     * Compiles CoffesScript and writes it into output
     * @private
     */
    function _compile_CoffeeScript() {
        var javaScriptText=_jQueryCell.find(".javascriptText");
        if (javaScriptText.is(":visible"))
        {
            var code = _codemirror.getValue();
            var compiledCode = "";
            try {
                compiledCode = CoffeeScript.compile(code, {bare: true});
            }
            catch(e) {
                compiledCode = e.toString();
            }

            _javascriptTextViewer.setValue(compiledCode);
            _javascriptTextViewer.refresh();
            //if (saveNotebookLater) saveNotebookLater();

        }
    }


    //EXECUTION **************************************
	_create(cellNumber, themeName);

	//RETURN *****************************************
	return {
		getJQueryCell: function(){return _jQueryCell;},
        getEditor: function(){return _codemirror;},
        getJavascriptTextViewer: function(){return _javascriptTextViewer;},

		getInputValue: function(){return _codemirror.getValue();},
		setInputValue: function(code){_codemirror.setValue(code); return this;},

		getOutputValue: function(){return _outputCell.html();},
		setOutputValue: function(code){_outputCell.html(code); return this;},

		getCursor: function(){return _codemirror.getCursor();},
		setCursor: function(obj_line_ch){_codemirror.setCursor(obj_line_ch); return this;},

		getLineCount: function(){return _codemirror.lineCount();},

		setXml: _setXml,
		getXml: _getXml,

		setNumber: _setNumber,
		getNumber: _getNumber,

		cursorOnFirstLine: _cursorOnFirstLine,
		cursorOnLastLine: _cursorOnLastLine,

		setCursorOnFirstLine: _setCursorOnFirstLine,
		setCursorOnLastLine: _setCursorOnLastLine,

		// setLanguage: function(mode){_mode=mode; return this;},
		// getLanguage: function(){return _mode},

		execute: _executeCode,


		setInsertAfterCallback: function(f) { _insertAfterCallback=f; },
		setInsertBeforeCallback: function(f) { _insertBeforeCallback=f; },
		setDeleteCallback: function(f) { _deleteCallback=f;},


		
		setFocus: _setFocus,
		removeFocus: _removeFocus
	};

}


