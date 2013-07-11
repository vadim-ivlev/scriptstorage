// Codemirror autocompletion	
CodeMirror.commands.autocomplete = function(cm) {
	CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
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
		extraKeys: {
			"Ctrl-Space": "autocomplete",
            "F2":     function (ed){
                if (ed.getMode().name=="javascript")
                    foldFunc_brace(ed, ed.getCursor().line);
                else
                    foldFunc_tag(ed, ed.getCursor().line);
            }
		}
	};

    var editor = CodeMirror(parentDomObject, config);

//    var hlLine = editor.addLineClass(0, "background", "activeline");
//    editor.on("cursorActivity", function() {
//        var cur = editor.getLineHandle(editor.getCursor().line);
//        if (cur != hlLine) {
//            editor.removeLineClass(hlLine, "background", "activeline");
//            hlLine = editor.addLineClass(cur, "background", "activeline");
//        }
//    });


    editor.on("change", function(instance, changeObj) {
        if (saveNotebookLater) saveNotebookLater();
        //if (console) console.log("change event");
    });


    editor.on("focus", function(instance) {
        $(parentDomObject).css("border-color","#DDD");
        //if (console) console.log("focus event");
        editor.setOption("readOnly",false);

    });

    editor.on("blur", function(instance) {
        $(parentDomObject).css("border-color","#f0f0f0");
        editor.setOption("readOnly",true);

    });

    var foldFunc_brace = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder,"...");
    var foldFunc_tag = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder,"...");

   // editor.on("gutterClick", fold);


    return editor;
}


