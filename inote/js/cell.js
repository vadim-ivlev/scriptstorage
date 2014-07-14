// Generated by CoffeeScript 1.7.1

/*

cellNumber - defines names for the cell and input and output
themeName - color scheme of the editor
keyMap - default| vim | sublime | emac
 */

(function() {
  window.print = null;

  window.clear = null;

  this.Cell = function(cellNumber, themeName, keyMap) {
    var toXmlString, _CPLTIME, _VER, _attachEvents, _call, _clearPrintArea, _codemirror, _compileLater, _compileTimeout, _compile_CoffeeScript, _compile_Markdown, _create, _createPrintArea, _cursorOnFirstLine, _cursorOnLastLine, _deleteCallback, _executeCode, _fullscreenButton, _getNumber, _getSelectedRange, _getXml, _getXml0, _getXml1, _hideJavascriptText, _inCollapsed, _inputCell, _insertAfterCallback, _insertBeforeCallback, _jQueryCell, _javascriptCell, _javascriptTextViewer, _keyHandler, _keyMap, _lock, _lockButton, _lockUnlock, _mode, _n, _onfirst, _onlast, _outCollapsed, _outputCell, _print, _printArea, _printError, _removeFocus, _setCursorOnFirstLine, _setCursorOnLastLine, _setFocus, _setInputCollapsed, _setKeyMap, _setMode, _setNumber, _setOutputCollapsed, _setTheme, _setXml, _setXml0, _setXml1, _showJavascriptText, _switchFullsreen, _switchJavascriptText, _unlock;
    _n = void 0;
    _jQueryCell = void 0;
    _codemirror = void 0;
    _javascriptTextViewer = void 0;
    _inputCell = void 0;
    _outputCell = void 0;
    _javascriptCell = void 0;
    _mode = "javascript";
    _lockButton = void 0;
    _fullscreenButton = void 0;
    _deleteCallback = null;
    _insertBeforeCallback = null;
    _insertAfterCallback = null;
    _inCollapsed = false;
    _outCollapsed = false;
    _onfirst = false;
    _onlast = false;
    _compileTimeout = void 0;
    _keyMap = "default";
    _create = function(celNum, theme, keyM) {
      _jQueryCell = $("<div class='cell'>\n\n    <span class='input_header'>\n        <span class='hideInputButton toolButton hidable000 icon-eye-blocked' ></span> <!-- &#x25BC -->\n        <select class='selectButton hidable000'>\n            <option value='javascript'>JavaScript</option>\n            <option value='text/x-coffeescript'>CoffeeScript</option>\n            <option value='text/html'>HTML</option>\n            <option value='markdown'>Markdown</option>\n        </select>\n        <span class='showJavascriptButton toolButton hidable000' >Show Javascript</span>\n        <span class='deleteButton toolButton  hidable000 icon-remove' title='delete cell' ></span><!-- &nbsp;b&#x00D7&nbsp; -->\n        <span class='toolButton hidable000 icon-expand' style='float:right' title='Fullscreen on/of'>Alt-F11</span>\n        <span class='keyMap toolButton hidable000' style='float:right' title='editor mode'></span>\n    </span>\n    \n    <table class='codeArea' > \n        <tr>\n            <td id='in_' class='inputCell' ></td>\n            <td id='js_' class='javascriptCell'></td>\n        </tr>\n    </table>\n    \n    <span class='input_expander toolButton hidable000 icon-eye'></span> \n\n    <span class='output_header'>\n        <span class='hideOutputButton toolButton hidable000 icon-eye-blocked'></span> <!-- &#x25BC -->\n        <span class='clearOutputButton toolButton '>clear</span>\n        <span class='toolButton icon-play' title='<Ctrl-Ent> to run.  <Shift-Ent> to run and go to the next cell. '>run</span>\n    </span>\n    \n    <div id='out_' class='outputCell lr_padded'></div>\n    \n    \n    <div class='insertBefore smallButton  hidable000 icon-plus' title='add cell'></div>\n    <div class='insertAfter smallButton  hidable000 icon-plus' title='add cell'></div>\n    <div class='lockButton smallButton icon-pencil' title='edit/lock' style='position:absolute;top:0px;left:-27px;'></div>\n</div>");
      _inputCell = _jQueryCell.find(".inputCell");
      _inputCell[0]._compileLater = _compileLater;
      _outputCell = _jQueryCell.find(".outputCell");
      _javascriptCell = _jQueryCell.find(".javascriptCell");
      _lockButton = _jQueryCell.find(".lockButton");
      _fullscreenButton = _jQueryCell.find(".icon-expand");
      _codemirror = createCodeMirror(_inputCell[0]);
      _codemirror.setOption("readOnly", "nocursor");
      _javascriptTextViewer = createCodeMirror(_javascriptCell[0]);
      _javascriptTextViewer.setOption("readOnly", "nocursor");
      _javascriptTextViewer.setValue("");
      _setTheme(theme);
      _attachEvents();
      _setNumber(celNum);
      _setMode(_mode);
      _setOutputCollapsed(_outCollapsed);
      _setInputCollapsed(_outCollapsed);
      _setKeyMap(keyM);
    };
    _call = function(f, param) {
      if (typeof f === "function") {
        f(param);
      }
    };
    _setKeyMap = function(v) {
      _keyMap = v ? v : "default";
      if (_keyMap === "undefined") {
        _keyMap = "default";
      }
      _jQueryCell.find(".keyMap").text(_keyMap);
      _codemirror.setOption("vimMode", _keyMap === "vim");
      _codemirror.setOption("keyMap", _keyMap);
      return this;
    };
    _setTheme = function(themeName) {
      var th;
      th = themeName ? themeName : "default";
      _codemirror.setOption("theme", th);
      return _javascriptTextViewer.setOption("theme", th);
    };
    _showJavascriptText = function() {
      _jQueryCell.find(".showJavascriptButton").text("Hide Javascript");
      _javascriptCell.show();
      _javascriptTextViewer.refresh();
      _compile_CoffeeScript();
      _jQueryCell.find(".codeArea").colResizable();
    };
    _hideJavascriptText = function() {
      _jQueryCell.find(".showJavascriptButton").text("Show Javascript");
      _javascriptCell.hide();
    };
    _switchJavascriptText = function() {
      if (_jQueryCell.find(".showJavascriptButton").text() === "Show Javascript") {
        _showJavascriptText();
      } else {
        _hideJavascriptText();
      }
    };
    _CPLTIME = 100;
    _setOutputCollapsed = function(collapsed) {
      _outCollapsed = collapsed;
      if (collapsed) {
        _jQueryCell.find(".outputCell").hide(_CPLTIME, function() {
          return _jQueryCell.find(".hideOutputButton").html("show [out" + _n + "]");
        });
      } else {
        _jQueryCell.find(".outputCell").show(_CPLTIME);
        _jQueryCell.find(".hideOutputButton").html("hide [out" + _n + "]");
      }
      if (typeof saveNotebookLater === "function") {
        saveNotebookLater();
      }
    };
    _setInputCollapsed = function(collapsed) {
      _inCollapsed = collapsed;
      if (collapsed) {
        _jQueryCell.find(".codeArea").hide();
        _jQueryCell.find(".input_expander").addClass('visible');
        _jQueryCell.find(".input_header").hide();
        _jQueryCell.find(".hideInputButton").html("show [in" + _n + "]");
      } else {
        _jQueryCell.find(".codeArea").show();
        _jQueryCell.find(".input_expander").removeClass('visible');
        _jQueryCell.find(".input_header").show();
        _jQueryCell.find(".hideInputButton").html("hide [in" + _n + "]");
      }
      if (typeof saveNotebookLater === "function") {
        saveNotebookLater();
      }
    };
    _lock = function() {
      _jQueryCell.find(".hidable000").removeClass("visible");
      _jQueryCell.find(".codeArea").removeClass("visibleBorder");
      _jQueryCell.removeClass("visibleBorder shadow");
      return _codemirror.setOption("readOnly", "nocursor");
    };
    _unlock = function() {
      _jQueryCell.find(".hidable000").addClass("visible");
      _jQueryCell.find(".codeArea").addClass("visibleBorder");
      _jQueryCell.addClass("visibleBorder shadow");
      return _codemirror.setOption("readOnly", false);
    };
    _lockUnlock = function() {
      if (_lockButton.hasClass('unlocked')) {
        _lockButton.removeClass('unlocked');
        return _lock();
      } else {
        _lockButton.addClass('unlocked');
        return _unlock();
      }
    };
    _attachEvents = function() {
      _inputCell.keydown(_keyHandler);
      _lockButton.click(_lockUnlock);
      _fullscreenButton.click(_switchFullsreen);
      $(".deleteButton", _jQueryCell).click(function() {
        return _call(_deleteCallback, _n);
      });
      $(".insertBefore", _jQueryCell).click(function() {
        return _call(_insertBeforeCallback, _n);
      });
      $(".insertAfter", _jQueryCell).click(function() {
        return _call(_insertAfterCallback, _n);
      });
      $(".icon-play", _jQueryCell).click(_executeCode);
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
      $(".showJavascriptButton", _jQueryCell).click(_switchJavascriptText);
      return $(".selectButton", _jQueryCell).change(function() {
        var mode;
        mode = _jQueryCell.find(".selectButton").val();
        _setMode(mode);
        return _codemirror.focus();
      });
    };
    _switchFullsreen = function() {
      var fs;
      fs = !isFullScreen(_codemirror);
      setFullScreen(_codemirror, fs);
      if (fs) {
        return _fullscreenButton.addClass("fullscreen-top-right");
      } else {
        return _fullscreenButton.removeClass("fullscreen-top-right");
      }
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
      cell = $("<div class='cell' id='" + (_jQueryCell.attr('id')) + "'  version='1' number='" + _n + "' mode='" + _mode + "'/>");
      $("<div class='inputCell'  id='" + (_inputCell.attr('id')) + "' collapsed='" + _inCollapsed + "'/>").text(_codemirror.getValue()).appendTo(cell);
      $("<div class='javascriptCell' id='" + (_javascriptCell.attr('id')) + "'/>").text(_javascriptTextViewer.getValue()).appendTo(cell);
      $("<div class='outputCell' id='" + (_outputCell.attr('id')) + "' collapsed='" + _outCollapsed + "'/>").text(_outputCell.html()).appendTo(cell);
      return cell;
    };
    _setXml1 = function(cell) {
      var input, js, number, output;
      number = cell.attr("number");
      _mode = cell.attr("mode");
      input = cell.find("div.inputCell").first();
      output = cell.find("div.outputCell").first();
      js = cell.find("div.javascriptCell").first();
      _codemirror.setValue(input.text());
      _outputCell.html(output.text());
      _javascriptTextViewer.setValue(js.text());
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

    /* 
    _commentSelection = (isComment) ->
        range = _getSelectedRange()
        _codemirror.commentRange isComment, range.from, range.to
        return
     */
    _keyHandler = function(event) {
      var a, c, s;
      c = event.ctrlKey;
      a = event.altKey;
      s = event.shiftKey;
      switch (event.which) {
        case 13:
          if (c || s) {
            event.preventDefault();
            _executeCode();
          }
          break;
        case 122:
          if (a) {
            event.preventDefault();
            _switchFullsreen();
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
      _inputCell.attr("id", "in" + _n);
      _outputCell.attr("id", "out" + _n);
      _javascriptCell.attr("id", "js" + _n);
      _jQueryCell.find(".input_expander").html("show [in" + _n + "]");
      return this;
    };
    _setFocus = function(lineNumber, charNumber) {
      _codemirror.refresh();
      _codemirror.focus();
      _codemirror.setCursor({
        line: 0,
        ch: 0
      });
      return this;
    };
    _removeFocus = function() {};
    _executeCode = function() {
      var code, compiledCode, converter, e, html;
      window.print = _print;
      window.clear = _clearPrintArea;
      _clearPrintArea();
      _outputCell.html("");
      try {
        code = _codemirror.getValue();
        if (_mode === "text/html") {
          _outputCell.html(code);
        } else if (_mode === "markdown") {
          converter = new Showdown.converter();
          html = converter.makeHtml(code);
          _outputCell.html("<div class='markdown'>" + html + "</div>");
        } else if (_mode === "javascript") {
          eval.call(window, code);
        } else if (_mode === "text/x-coffeescript") {
          _javascriptTextViewer.setValue("");
          compiledCode = CoffeeScript.compile(code, {
            bare: false
          });
          _javascriptTextViewer.setValue(compiledCode);
          _javascriptTextViewer.refresh();
          eval.call(window, compiledCode);
        }
      } catch (_error) {
        e = _error;
        _printError("" + e);
      }
    };
    _printArea = null;
    _clearPrintArea = function() {
      _printArea = null;
      return _outputCell.find("pre.noerror").remove();
    };
    _createPrintArea = function() {
      _printArea = $("<pre class='noerror'/>");
      return _printArea.appendTo(_outputCell);
    };
    _print = function(o) {
      var e, s;
      if (_printArea == null) {
        _printArea = _createPrintArea();
      }
      s = "";
      if (o instanceof jQuery) {
        s = "{jQuery}";
      } else {
        if (typeof o === "string") {
          s = o;
        } else if (typeof o === "number") {
          s = o;
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
            s = "Error: JSON.stringify\n";
          }
        }
      }
      _printArea.text(_printArea.text() + s);
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
      javaScriptText = _javascriptCell;
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
    _create(cellNumber, themeName, keyMap);
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
      unlock: _unlock,
      setKeyMap: _setKeyMap,
      setTheme: _setTheme
    };
  };

}).call(this);

//# sourceMappingURL=cell.map
