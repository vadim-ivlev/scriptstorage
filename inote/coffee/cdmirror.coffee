@createCodeMirror = (parentDomObject) ->
    config =
        value: "" #function myScript(){return 100;}
        mode: "javascript"
        vimMode: false
        lineWrapping: true
        lineNumbers: true
        autofocus: false
        matchBrackets: true
        autoCloseTags: true
        collapseRange: true
        theme: "eclipse"
        foldGutter: true
        gutters: [
            "CodeMirror-linenumbers"
            "CodeMirror-foldgutter"
        ]
        extraKeys:
            "Ctrl-Space": "autocomplete"
            
            #replace TAB with spaces
            Tab: (cm) ->
                spaces = Array(cm.getOption("indentUnit") + 1).join(" ")
                cm.replaceSelection spaces, "end", "+input"
            
            "Ctrl-Q": (cm) -> cm.foldCode cm.getCursor()

            
            #FULL SCREEN keys
            #"Alt-F11": (cm) -> @setFullScreen cm, not @isFullScreen(cm)

            

            "Cmd-/": "toggleComment"
            "Ctrl-/": "toggleComment"

    editor = CodeMirror(parentDomObject, config)

    editor.on "change", (instance, changeObj) ->
        saveNotebookLater?()
        parentDomObject._compileLater?()

    

    return editor

# Codemirror autocompletion
CodeMirror.commands.autocomplete = (cm) ->
    CodeMirror.showHint cm, CodeMirror.hint.javascript

