// Generated by CoffeeScript 1.7.1
(function() {
  this.Cell = function(cellNumber, themeName) {
    var toXmlString, _VER, _attachEvents, _autoFormatSelection, _call, _codemirror, _commentSelection, _compileLater, _compileTimeout, _compile_CoffeeScript, _compile_Markdown, _create, _cursorOnFirstLine, _cursorOnLastLine, _deleteCallback, _executeCode, _getNumber, _getSelectedRange, _getXml, _getXml0, _getXml1, _hideJavascriptText, _inCollapsed, _inputCell, _inputTitle, _insertAfterCallback, _insertBeforeCallback, _jQueryCell, _javascriptTextViewer, _keyHandler, _lock, _lockButton, _mode, _n, _onfirst, _onlast, _outCollapsed, _outputCell, _outputTitle, _print, _printError, _removeFocus, _setCursorOnFirstLine, _setCursorOnLastLine, _setFocus, _setInputCollapsed, _setMode, _setNumber, _setOutputCollapsed, _setXml, _setXml0, _setXml1, _showJavascriptText, _switchJavascriptText, _unlock;
    _n = void 0;
    _jQueryCell = void 0;
    _codemirror = void 0;
    _javascriptTextViewer = void 0;
    _inputCell = void 0;
    _outputCell = void 0;
    _inputTitle = void 0;
    _outputTitle = void 0;
    _mode = "javascript";
    _lockButton = void 0;
    _deleteCallback = null;
    _insertBeforeCallback = null;
    _insertAfterCallback = null;
    _inCollapsed = false;
    _outCollapsed = false;
    _onfirst = false;
    _onlast = false;
    _compileTimeout = void 0;
    _create = function(celNum, theme) {
      _jQueryCell = $("<div class='cell' collapsed='no' outCollapsed='no' inCollapsed='no' access='public'>\n\n    <div class='input_header'>\n        <span class='hideInputButton toolButton hidable000' >&#x25BC</span>\n        <select class='selectButton hidable000'>\n            <option value='javascript'>JavaScript</option>\n            <option value='text/x-coffeescript'>CoffeeScript</option>\n            <option value='text/html'>HTML</option>\n            <option value='markdown'>Markdown</option>\n        </select>\n        <span class='formatSelectionButton toolButton hidable000'>Format</span>\n        <span class='showJavascriptButton toolButton hidable000' >Show Javascript</span>\n        <span class='deleteButton toolButton  hidable000' title='delete cell' >&nbsp;&#x00D7&nbsp;</span>\n    </div>\n\n    <table class='codeArea' ><tr>\n        <td id='in_' class='inputCell' ></td>\n        <td  class='javascriptText'></td>\n    </tr></table>\n    <div class='input_expander toolButton hidable000'>&#x25BA</div>\n\n    <div class='output_header'>\n        <span class='hideOutputButton toolButton hidable000'>&#x25BC</span>\n        <span class='clearOutputButton toolButton hidable000'>Clear output</span>\n        <span class='runButton toolButton hidable000' title='<Ctrl-Ent> to Run.  <Shift-Ent> to run and go to the next cell. '>Run<span style='font-family:icomoon;font-size:100%; position:relative; top:2px;'>&#xE603;</span></span>\n    </div>\n    \n    <div id='out_' class='outputCell lr_padded'></div>\n    <div class='output_expander toolButton hidable000'>&#x25BA</div>\n    <div class='runButton smallButton'  style='position:absolute;top:36px;left:-21px;width:20px;font-family:icomoon;opacity:0.4;'>&#xE603;</div>\n    <div class='insertBefore smallButton  hidable000' title='add cell'>+</div>\n    <div class='insertAfter smallButton  hidable000' title='add cell'>+</div>\n    <div class='lockButton smallButton' title='lock/unlock' style='position:absolute;top:10px;left:-19px;width:20px;'>&#xE601;</div>\n</div>");
      _inputCell = _jQueryCell.find(".inputCell");
      _inputCell[0]._compileLater = _compileLater;
      _outputCell = _jQueryCell.find(".outputCell");
      _inputTitle = _jQueryCell.find(".inputTitle");
      _outputTitle = _jQueryCell.find(".outputTitle");
      _lockButton = _jQueryCell.find(".lockButton");
      _codemirror = createCodeMirror(_inputCell[0]);
      _codemirror.setOption("theme", theme || "eclipse");
      _codemirror.setOption("readOnly", "nocursor");
      _javascriptTextViewer = createCodeMirror(_jQueryCell.find(".javascriptText")[0]);
      _javascriptTextViewer.setOption("readOnly", "nocursor");
      _javascriptTextViewer.setOption("theme", theme || "eclipse");
      _javascriptTextViewer.setValue("");
      _attachEvents();
      _setNumber(celNum);
      _setMode(_mode);
      _setOutputCollapsed(_outCollapsed);
      _setInputCollapsed(_outCollapsed);
    };
    _call = function(f, param) {
      if (typeof f === "function") {
        f(param);
      }
    };
    _showJavascriptText = function() {
      _jQueryCell.find(".showJavascriptButton").text("Hide Javascript");
      _jQueryCell.find(".javascriptText").show();
      _javascriptTextViewer.refresh();
      _compile_CoffeeScript();
      _jQueryCell.find(".codeArea").colResizable();
    };
    _hideJavascriptText = function() {
      _jQueryCell.find(".showJavascriptButton").text("Show Javascript");
      _jQueryCell.find(".javascriptText").hide();
    };
    _switchJavascriptText = function() {
      if (_jQueryCell.find(".showJavascriptButton").text() === "Show Javascript") {
        _showJavascriptText();
      } else {
        _hideJavascriptText();
      }
    };
    _setOutputCollapsed = function(collapsed) {
      _outCollapsed = collapsed;
      if (collapsed) {
        _jQueryCell.find(".outputCell").hide(_CPLTIME, function() {
          _jQueryCell.find(".output_expander").show();
          _jQueryCell.find(".output_header").hide();
          return _jQueryCell.find(".hideOutputButton").html("[out" + _n + "] &#x25BA");
        });
      } else {
        _jQueryCell.find(".outputCell").show(_CPLTIME);
        _jQueryCell.find(".output_expander").hide();
        _jQueryCell.find(".output_header").show();
        _jQueryCell.find(".hideOutputButton").html("[out" + _n + "] &#x25BC");
      }
      if (typeof saveNotebookLater === "function") {
        saveNotebookLater();
      }
    };
    _setInputCollapsed = function(collapsed) {
      _inCollapsed = collapsed;
      if (collapsed) {
        _jQueryCell.find(".codeArea").hide(_CPLTIME, function() {
          _jQueryCell.find(".input_expander").show();
          _jQueryCell.find(".input_header").hide();
          return _jQueryCell.find(".hideInputButton").html("[in" + _n + "] &nbsp;&nbsp;&#x25BA");
        });
      } else {
        _jQueryCell.find(".codeArea").show(_CPLTIME);
        _jQueryCell.find(".input_expander").hide();
        _jQueryCell.find(".input_header").show();
        _jQueryCell.find(".hideInputButton").html("[in" + _n + "] &nbsp;&nbsp;&#x25BC");
      }
      if (typeof saveNotebookLater === "function") {
        saveNotebookLater();
      }
    };
    _lock = function() {
      _lockButton.html("&#xE601;");
      _jQueryCell.find(".hidable000").removeClass("visible");
      _jQueryCell.find(".codeArea").removeClass("visibleBorder");
      _jQueryCell.removeClass("visibleBorder");
      return _codemirror.setOption("readOnly", "nocursor");
    };
    _unlock = function() {
      _lockButton.html("&#xE602;");
      _jQueryCell.find(".hidable000").addClass("visible");
      _jQueryCell.find(".codeArea").addClass("visibleBorder");
      _jQueryCell.addClass("visibleBorder");
      return _codemirror.setOption("readOnly", false);
    };
    _attachEvents = function() {
      _inputCell.keydown(_keyHandler);
      _lockButton.click(function() {
        if (_lockButton.html().charCodeAt(0) === 0xE601) {
          return _unlock();
        } else {
          return _lock();
        }
      });
      $(".deleteButton", _jQueryCell).click(function() {
        return _call(_deleteCallback, _n);
      });
      $(".insertBefore", _jQueryCell).click(function() {
        return _call(_insertBeforeCallback, _n);
      });
      $(".insertAfter", _jQueryCell).click(function() {
        return _call(_insertAfterCallback, _n);
      });
      $(".runButton", _jQueryCell).click(_executeCode);
      $(".clearOutputButton", _jQueryCell).click(function() {
        _outputCell.html("");
        return typeof saveNotebook === "function" ? saveNotebook() : void 0;
      });
      $(".hideOutputButton", _jQueryCell).click(function() {
        return _setOutputCollapsed(!_outCollapsed);
      });
      $(".hideInputButton", _jQueryCell).click(function() {
        return _setInputCollapsed(!_inCollapsed);
      });
      $(".input_expander", _jQueryCell).click(function() {
        return _setInputCollapsed(!_inCollapsed);
      });
      $(".output_expander", _jQueryCell).click(function() {
        return _setOutputCollapsed(!_outCollapsed);
      });
      $(".formatSelectionButton", _jQueryCell).click(_autoFormatSelection);
      $(".showJavascriptButton", _jQueryCell).click(_switchJavascriptText);
      return $(".selectButton", _jQueryCell).change(function() {
        var mode;
        mode = _jQueryCell.find(".selectButton").val();
        _setMode(mode);
        return _codemirror.focus();
      });
    };
    _setMode = function(mode) {
      _mode = mode;
      _jQueryCell.find(".selectButton").val(mode);
      _codemirror.setOption("mode", mode);
      if (_mode === "text/x-coffeescript") {
        _jQueryCell.find(".showJavascriptButton").show();
      } else {
        _hideJavascriptText();
        _jQueryCell.find(".showJavascriptButton").hide();
      }
      if (_mode === "javascript" || _mode === "text/html") {
        _jQueryCell.find(".formatSelectionButton").show();
      } else {
        _jQueryCell.find(".formatSelectionButton").hide();
      }
      if (typeof saveNotebookLater === "function") {
        saveNotebookLater();
      }
    };
    _VER = "1";
    _getXml = function() {
      if (_VER === "1") {
        return _getXml1();
      } else {
        return _getXml0();
      }
    };
    _setXml = function(cell) {
      if (cell.attr("version") === "1") {
        return _setXml1(cell);
      } else {
        return _setXml0(cell);
      }
    };
    _getXml0 = function() {
      var cell;
      cell = $("<cell verion='0' number='" + _n + "' mode='" + _mode + "'/>");
      $("<in collapsed='" + _inCollapsed + "'/>").text(_codemirror.getValue()).appendTo(cell);
      $("<out collapsed='" + _outCollapsed + "'/>").text(_outputCell.html()).appendTo(cell);
      return cell;
    };
    _setXml0 = function(cell) {
      var input, inputValue, number, output, outputValue;
      number = cell.attr("number");
      _mode = cell.attr("mode");
      input = cell.find("in").first();
      output = cell.find("out").first();
      inputValue = input.text();
      outputValue = output.text();
      _codemirror.setValue(inputValue);
      _outputCell.html(outputValue);
      _setNumber(number);
      _setMode(_mode);
      _setOutputCollapsed(output.attr("collapsed") === "true");
      _setInputCollapsed(input.attr("collapsed") === "true");
    };
    _getXml1 = function() {
      var cell;
      cell = $("<div class='cell' version='1' number='" + _n + "' mode='" + _mode + "'/>");
      $("<div class='inputCell' collapsed='" + _inCollapsed + "'/>").text(_codemirror.getValue()).appendTo(cell);
      $("<div class='outputCell' collapsed='" + _outCollapsed + "'/>").text(_outputCell.html()).appendTo(cell);
      return cell;
    };
    _setXml1 = function(cell) {
      var input, inputValue, number, output, outputValue;
      number = cell.attr("number");
      _mode = cell.attr("mode");
      input = cell.find("div.inputCell").first();
      output = cell.find("div.outputCell").first();
      inputValue = input.text();
      outputValue = output.text();
      _codemirror.setValue(inputValue);
      _outputCell.html(outputValue);
      _setNumber(number);
      _setMode(_mode);
      _setOutputCollapsed(output.attr("collapsed") === "true");
      _setInputCollapsed(input.attr("collapsed") === "true");
    };
    _getSelectedRange = function() {
      return {
        from: _codemirror.getCursor(true),
        to: _codemirror.getCursor(false)
      };
    };
    _autoFormatSelection = function() {
      var range;
      range = _getSelectedRange();
      _codemirror.autoFormatRange(range.from, range.to);
    };
    _commentSelection = function(isComment) {
      var range;
      range = _getSelectedRange();
      _codemirror.commentRange(isComment, range.from, range.to);
    };
    _keyHandler = function(event) {
      if (event.which === 13) {
        event.preventDefault();
        if (event.shiftKey) {
          _executeCode();
        } else {
          if (event.ctrlKey) {
            _executeCode();
          }
        }
      } else {
        if (event.which === 191 && event.ctrlKey) {
          _commentSelection(!event.shiftKey);
        }
      }
    };
    _getNumber = function() {
      return Number(_n);
    };
    _setNumber = function(n) {
      _n = Number(n);
      _jQueryCell.data("number", _n);
      _jQueryCell.attr("id", "cell" + _n);
      _jQueryCell.attr("data-number", _n);
      _inputCell.attr("id", "in" + _n);
      _outputCell.attr("id", "out" + _n);
      _inputTitle.text(_inputCell.attr("id"));
      _outputTitle.text(_outputCell.attr("id"));
      _jQueryCell.find(".output_expander").html("[out" + _n + "] &#x25BA");
      _jQueryCell.find(".input_expander").html("[in" + _n + "]&nbsp; &nbsp;&#x25BA");
      return this;
    };
    _setFocus = function(lineNumber, charNumber) {
      _codemirror.refresh();
      _codemirror.focus();
      _codemirror.setCursor({
        line: 0,
        ch: 0
      });
    };
    _removeFocus = function() {};
    _executeCode = function() {
      var code, compiledCode, converter, e, html, result;
      _outputCell.html("");
      try {
        code = _codemirror.getValue();
        result = void 0;
        if (_mode === "text/html") {
          _outputCell.html(code);
        } else if (_mode === "markdown") {
          converter = new Showdown.converter();
          html = converter.makeHtml(code);
          _outputCell.html("<div class='markdown'>" + html + "</div>");
        } else if (_mode === "javascript") {
          result = eval.call(window, code);
          _print(result);
        } else if (_mode === "text/x-coffeescript") {
          _javascriptTextViewer.setValue("");
          compiledCode = CoffeeScript.compile(code, {
            bare: false
          });
          _javascriptTextViewer.setValue(compiledCode);
          _javascriptTextViewer.refresh();
          result = eval.call(window, compiledCode);
          _print(result);
        }
      } catch (_error) {
        e = _error;
        _printError("" + e);
      }
    };
    _print = function(o) {
      var box, e, s;
      if (typeof o === "undefined") {
        return;
      }
      box = $("<pre class='noerror'/>");
      s = "";
      if (o instanceof jQuery) {
        s = "{jQuery}";
      } else {
        try {
          s = JSON.stringify(o, function(key, value) {
            if (this[key] instanceof Function) {
              return value.toString();
            } else {
              return value;
            }
          }, " ");
        } catch (_error) {
          e = _error;
          return;
        }
      }
      box.text(s);
      _outputCell.html(box);
    };
    _printError = function(o) {
      _outputCell.html("<div class='error'>" + o + "</div>");
    };
    _cursorOnLastLine = function() {
      var lCount, line, retValue;
      line = _codemirror.getCursor().line;
      lCount = _codemirror.lineCount();
      retValue = _onlast && (line >= lCount - 1);
      _onlast = line >= lCount - 1;
      return retValue;
    };
    _cursorOnFirstLine = function() {
      var line, retValue;
      line = _codemirror.getCursor().line;
      retValue = _onfirst && (line <= 0);
      _onfirst = line <= 0;
      return retValue;
    };
    _setCursorOnLastLine = function(charPos) {
      var lastLine;
      lastLine = _codemirror.lineCount() - 1;
      _codemirror.setCursor({
        line: lastLine
      });
    };
    _setCursorOnFirstLine = function(charPos) {
      _codemirror.setCursor({
        line: 0
      });
    };
    toXmlString = function(data) {
      if (data.xml) {
        return data.xml;
      } else {
        return (new XMLSerializer()).serializeToString(data);
      }
    };
    _compileLater = function() {
      clearTimeout(_compileTimeout);
      if (_mode === "text/x-coffeescript") {
        _compileTimeout = setTimeout(_compile_CoffeeScript, 500);
      } else {
        if (_mode === "markdown") {
          _compileTimeout = setTimeout(_compile_Markdown, 500);
        }
      }
    };
    _compile_Markdown = function() {
      var code, converter, html;
      if (_outCollapsed) {
        return;
      }
      code = _codemirror.getValue();
      converter = new Showdown.converter();
      html = converter.makeHtml(code);
      _outputCell.html("<div class='markdown'>" + html + "</div>");
    };
    _compile_CoffeeScript = function() {
      var code, compiledCode, e, javaScriptText;
      javaScriptText = _jQueryCell.find(".javascriptText");
      if (javaScriptText.is(":visible")) {
        code = _codemirror.getValue();
        compiledCode = "";
        try {
          compiledCode = CoffeeScript.compile(code, {
            bare: false
          });
        } catch (_error) {
          e = _error;
          compiledCode = e.toString();
        }
        _javascriptTextViewer.setValue(compiledCode);
        _javascriptTextViewer.refresh();
      }
    };
    _create(cellNumber, themeName);
    return {
      getJQueryCell: function() {
        return _jQueryCell;
      },
      getEditor: function() {
        return _codemirror;
      },
      getJavascriptTextViewer: function() {
        return _javascriptTextViewer;
      },
      getInputValue: function() {
        return _codemirror.getValue();
      },
      setInputValue: function(code) {
        _codemirror.setValue(code);
        return this;
      },
      getOutputValue: function() {
        return _outputCell.html();
      },
      setOutputValue: function(code) {
        _outputCell.html(code);
        return this;
      },
      getCursor: function() {
        return _codemirror.getCursor();
      },
      setCursor: function(obj_line_ch) {
        _codemirror.setCursor(obj_line_ch);
        return this;
      },
      getLineCount: function() {
        return _codemirror.lineCount();
      },
      setXml: _setXml,
      getXml: _getXml,
      setNumber: _setNumber,
      getNumber: _getNumber,
      cursorOnFirstLine: _cursorOnFirstLine,
      cursorOnLastLine: _cursorOnLastLine,
      setCursorOnFirstLine: _setCursorOnFirstLine,
      setCursorOnLastLine: _setCursorOnLastLine,
      execute: _executeCode,
      setInsertAfterCallback: function(f) {
        _insertAfterCallback = f;
      },
      setInsertBeforeCallback: function(f) {
        _insertBeforeCallback = f;
      },
      setDeleteCallback: function(f) {
        _deleteCallback = f;
      },
      setFocus: _setFocus,
      removeFocus: _removeFocus,
      lock: _lock,
      unlock: _unlock
    };
  };

}).call(this);

//# sourceMappingURL=cell.map
