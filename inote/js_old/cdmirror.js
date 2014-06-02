// Codemirror autocompletion

CodeMirror.commands.autocomplete = function(cm) {
CodeMirror.showHint(cm, CodeMirror.hint.javascript);
}


function createCodeMirror(parentDomObject)
{
	var config = {
		value: "",//function myScript(){return 100;}
		mode: "javascript",
        lineWrapping: true,
		lineNumbers: true,
		autofocus: false,
        matchBrackets: true,
        autoCloseTags: true,
        collapseRange: true,
        theme: "eclipse",
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],

        extraKeys: {
            "Ctrl-Space": "autocomplete",
//            "Tab": function (cm) {
//                var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
//                cm.replaceSelection(spaces, "end", "+input");
//            },
            "F2": function (ed) {
                if (ed.getMode().name == "javascript")
                    foldFunc_brace(ed, ed.getCursor().line);
                else
                    foldFunc_tag(ed, ed.getCursor().line);
            },
            "Ctrl-Q": function (cm) {
                cm.foldCode(cm.getCursor());
            },
            //FULL SCREEN keys
            "Alt-F11": function (cm) {
                setFullScreen(cm, !isFullScreen(cm));
            },
            //FULL SCREEN keys
            "Esc": function (cm) {
                if (isFullScreen(cm)) setFullScreen(cm, false);
            },
            'Cmd-/' : 'toggleComment',
            'Ctrl-/' : 'toggleComment'


        }
    };

    var editor = CodeMirror(parentDomObject, config);

    /*
    var hlLine = editor.addLineClass(0, "background", "activeline");

    editor.on("cursorActivity", function() {
        var cur = editor.getLineHandle(editor.getCursor().line);
        if (cur != hlLine) {
            editor.removeLineClass(hlLine, "background", "activeline");
            hlLine = editor.addLineClass(cur, "background", "activeline");
        }
    });
    */

    editor.on("change", function(instance, changeObj) {
        if (saveNotebookLater) saveNotebookLater();
        //if (console) console.log("change event");
        if (parentDomObject._compileLater)
            parentDomObject._compileLater();
    });


   // editor.on("focus", function(instance) {
        //$(parentDomObject).css("border-color","#AAA");
        //if (console) console.log("focus event");
        //editor.setOption("readOnly",false);

   // });

//    editor.on("blur", function(instance) {
       // $(parentDomObject).css("border-color","#DDD");
  //      editor.setOption("readOnly",true);

  //  });

//    var foldFunc_brace = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder,"...");
//    var foldFunc_tag = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder,"...");

   // editor.on("gutterClick", fold);





    return editor;
}


    //FULL SCREEN functions//////////////BEGIN
    function isFullScreen(cm) {
        return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className);
    }

    function winHeight() {
        return window.innerHeight || (document.documentElement || document.body).clientHeight;
    }

    function setFullScreen(cm, full) {
        var wrap = cm.getWrapperElement();
        if (full) {
            wrap.className += " CodeMirror-fullscreen";
            wrap.style.height = winHeight() + "px";
            document.documentElement.style.overflow = "hidden";
        } else {
            wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "");
            wrap.style.height = "";
            document.documentElement.style.overflow = "";
        }
        cm.refresh();
    }

    CodeMirror.on(window, "resize", function () {
        var showing = document.body.getElementsByClassName("CodeMirror-fullscreen")[0];
        if (!showing) return;
        showing.CodeMirror.getWrapperElement().style.height = winHeight() + "px";
    });
    //FULL SCREEN functions//////////////END


