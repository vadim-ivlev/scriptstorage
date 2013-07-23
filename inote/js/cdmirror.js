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
		lineNumbers: false,
		autofocus: false,
        matchBrackets: true,
        autoCloseTags: true,
        collapseRange: true,
        theme: "eclipse",
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
        if (parentDomObject._compile)
            parentDomObject._compile();
    });


    editor.on("focus", function(instance) {
        $(parentDomObject).css("border-color","#CCC");
        //if (console) console.log("focus event");
        editor.setOption("readOnly",false);

    });

    editor.on("blur", function(instance) {
        $(parentDomObject).css("border-color","#DDD");
        editor.setOption("readOnly",true);

    });

    var foldFunc_brace = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder,"...");
    var foldFunc_tag = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder,"...");

   // editor.on("gutterClick", fold);


    return editor;
}


