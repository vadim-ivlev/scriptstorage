
function Cell(cellNumber)
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


	function _create(celNum) {
		_jQueryCell = $(
		'<div class="cell" collapsed="no" outCollapsed="no" inCollapsed="no" access="public">'+
            //input header
            '<div >'+
                '<span class="hideInputButton toolButton hidable">&#x25BC</span>'+ //Hide input
                '<span class="inputTitle hidable"></span>'+
//                '<span class="formatSelectionButton toolButton hidable">F</span>'+ //Format selection
                '<select class="selectButton hidable">'+
                    '<option value="javascript">JavaScript</option>'+
                    '<option value="text/x-coffeescript">CoffeeScript</option>'+
                    '<option value="text/html">HTML</option>'+
                    '<option value="markdown">Markdown</option>'+
                '</select>'+
                //'<span class="showJavascriptButton toolButton hidable" >Show Javascript</span>'+
                '<span class="deleteButton toolButton  hidable" title="delete cell">Delete cell <span style="color:black">x</span></span>'+
            '</div>'+

            //input
            '<div id="in_" class="inputCell" >'+
                '<span class="formatSelectionButton toolButton hidable">F</span>'+ //Format selection
                '<span class="showJavascriptButton toolButton hidable" >Show Javascript</span>'+
            '</div>'+

            //javascript text
            '<div  class="javascriptText"></div>'+

            //output header
            '<div >'+
                '<span class="hideOutputButton toolButton hidable">&#x25BC</span>'+ //Hide output
                '<span class="outputTitle hidable"></span>'+
                '<span class="clearOutputButton toolButton hidable">Clear output</span>'+
                '<span class="runButton hidable" title="<Ctrl-Ent> to Run.  <Shift-Ent> to run and go to the next cell. ">Run &#x25BA;</span>'+
		    '</div>'+

            //output
            '<div id="out_" class="outputCell lr_padded"></div>'+


            // add cell buttons
            '<div class="insertBefore smallButton  hidable" title="add cell">+</div>'+
            '<div class="insertAfter smallButton  hidable" title="add cell">+</div>'+

		'</div>'
		);



		_inputCell = _jQueryCell.find(".inputCell");
		_outputCell = _jQueryCell.find(".outputCell");
		_inputTitle = _jQueryCell.find(".inputTitle");
		_outputTitle = _jQueryCell.find(".outputTitle");

        _codemirror = createCodeMirror(_inputCell[0]);
        _javascriptTextViewer = createCodeMirror(_jQueryCell.find(".javascriptText")[0]);
        _javascriptTextViewer.setOption("readOnly","nocursor");
        _javascriptTextViewer.setValue("//Compiles to Javascript when you press [Run ►]");

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
			_jQueryCell.find(".hideOutputButton").html("&#x25BA");//Show output
		}
		else
		{
			_jQueryCell.find(".outputCell").show();
			_jQueryCell.find(".hideOutputButton").html("&#x25BC");//Hide output
		}
	}

	function _setInputCollapsed(collapsed)
	{
		_inCollapsed=collapsed;
		if (collapsed)
		{
			_jQueryCell.find(".inputCell").hide();
			_jQueryCell.find(".hideInputButton").html("&#x25BA");//Show input
		}
		else
		{
			_jQueryCell.find(".inputCell").show();
			_jQueryCell.find(".hideInputButton").html("&#x25BC");//Hide input
		}
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
		$(".clearOutputButton",_jQueryCell).click( function(){_outputCell.html("");} );
		$(".hideOutputButton",_jQueryCell).click( function(){ _setOutputCollapsed(!_outCollapsed);} );
        $(".hideInputButton",_jQueryCell).click( function(){ _setInputCollapsed(!_inCollapsed);} );

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
                _javascriptTextViewer.setValue("//Compiles to Javascript when you press [Run ►]");
                var compiledCode=CoffeeScript.compile(code, {bare: true});
                _javascriptTextViewer.setValue("//Compiles to Javascript when you press [Run ►]\n\n"+compiledCode);
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
			s=JSON.stringify(o,function (key, value) {
	                return this[key] instanceof Function ?
	                    value.toString() : value;
	            }," ");
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

	 
//	function _compile(mode,text) {
//		var compiledText ="";
//			if(mode=="text/x-coffeescript")
//				compiledText=CoffeeScript.compile(text, {bare: true});
//			else
//				compiledText=text;
//	//	console.log ("mode="+mode+"\n"+compiledText);
//		return compiledText;
//	}


    /**
     Serialise XML to string
     */
    function toXmlString(data) {
    //data.xml check for IE
        return data.xml ? data.xml : (new XMLSerializer()).serializeToString(data);
    }






	//EXECUTION **************************************
	_create(cellNumber);

	//RETURN *****************************************
	return {
		getJQueryCell: function(){return _jQueryCell;},

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


