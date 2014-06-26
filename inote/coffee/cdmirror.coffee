@createCodeMirror = (parentDomObject) ->
    config =
        value: "" #function myScript(){return 100;}
        mode: "javascript"
        lineWrapping: true
        lineNumbers: false
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

            F2: (ed) ->
                if ed.getMode().name is "javascript"
                    foldFunc_brace ed, ed.getCursor().line
                else
                    foldFunc_tag ed, ed.getCursor().line

            "Ctrl-Q": (cm) -> cm.foldCode cm.getCursor()

            
            #FULL SCREEN keys
            "Alt-F11": (cm) -> setFullScreen cm, not @isFullScreen(cm)

            
            #FULL SCREEN keys
            Esc: (cm) -> setFullScreen cm, false    if @isFullScreen(cm)

            "Cmd-/": "toggleComment"
            "Ctrl-/": "toggleComment"

    editor = CodeMirror(parentDomObject, config)

    editor.on "change", (instance, changeObj) ->
        saveNotebookLater?()
        #if (console) console.log("change event");
        parentDomObject._compileLater?()

    return editor

# Codemirror autocompletion
CodeMirror.commands.autocomplete = (cm) ->
    CodeMirror.showHint cm, CodeMirror.hint.javascript


#FULL SCREEN functions//////////////BEGIN
@isFullScreen = (cm) ->
    /\bCodeMirror-fullscreen\b/.test cm.getWrapperElement().className


winHeight = ->
    window.innerHeight or (document.documentElement or document.body).clientHeight


setFullScreen = (cm, full) ->
    wrap = cm.getWrapperElement()
    if full
        wrap.className += " CodeMirror-fullscreen"
        wrap.style.height = winHeight() + "px"
        document.documentElement.style.overflow = "hidden"
    else
        wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "")
        wrap.style.height = ""
        document.documentElement.style.overflow = ""
    cm.refresh()


CodeMirror.on window, "resize", ->
    showing = document.body.getElementsByClassName("CodeMirror-fullscreen")[0]
    return    unless showing
    showing.CodeMirror.getWrapperElement().style.height = winHeight() + "px"
#FULL SCREEN functions//////////////END
