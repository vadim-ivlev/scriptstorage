
storage = new NoteBookStorage()
saveNotebookTimeout = undefined
inote = undefined




@selectTheme = ->
    #input = document.getElementById("selectTheme_button")
    #theme = input.options[input.selectedIndex].innerHTML
    inote.setTheme $("#selectTheme_button").val()
    @saveNotebookLater()
    return






@saveNotebookLater = ->
    clearTimeout saveNotebookTimeout
    (if ($("#autoSave").is(":checked")) then saveNotebookTimeout = setTimeout(saveNotebook, 2000) else null)
    $("#saveIndicator").text ""
    return


@saveNotebook = ->
    notebookName = $("#notebookName").val()
    notebookOwner = $(".notebookOwner").text()
    notebookAaccess = $("#notebookAccess").val()
    xmlText = inote.getXmlText(notebookName)
    
    #console.log(xmlText);
    console.log "saveNotebook"
    
    #localStorage.setItem("inote_"+bookName, xmlText);
    storage.put notebookAaccess, notebookName, xmlText, (d) ->
        $("#saveIndicator").text "(saved)"
        return

    return




openNotebook = (notebookOwner, notebookAccess, notebookName) ->
    clearAndInit()
    return    unless notebookName
    $(".notebookOwner").text notebookOwner
    $("#notebookName").val notebookName
    $("#notebookAccess").val notebookAccess
    #storage.get notebookOwner, notebookName, restoreNotebookFromXml
    page = $("#page")
    xmlText = page.html()
    page.html("")
    restoreNotebookFromXml(xmlText)
    return




restoreNotebookFromXml = (xmlText) ->
    return    unless xmlText
    inote.clear()
    inote.setXmlText xmlText
    notebook = $(xmlText)
    themeName = notebook.attr("theme")
    $("#selectTheme_button").val themeName
    inote.init()    if $(".cell").length is 0
    return



getNotebookAccessFromUrl = ->
    notebook_access = ""
    try
        notebook_access = location.href.match(/notebook_access=([^&]*)/)[1]
    notebook_access = decodeURIComponent(notebook_access)
    notebook_access




getNotebookNameFromUrl = ->
    notebook_name = ""
    try
        notebook_name = location.href.match(/notebook_name=([^&]*)/)[1]
    notebook_name = decodeURIComponent(notebook_name)
    notebook_name



getNotebookOwnerFromUrl = ->
    notebook_owner = ""
    try
        notebook_owner = location.href.match(/notebook_owner=([^&]*)/)[1]
    notebook_owner = decodeURIComponent(notebook_owner)
    notebook_owner




clearAndInit = ->
    inote.clear()
    inote.init()
    return





#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$ ->
    #$(".loginHolder").load "/getloginlink"
    inote = new iNote($("#page"))
    
    #            inote=new iNote($(document.body));
    openNotebook getNotebookOwnerFromUrl(), getNotebookAccessFromUrl(), getNotebookNameFromUrl()
    
    #handlers
    $("body").keydown (event) ->
        if event.ctrlKey and event.keyCode is 83 #Ctrl-S
            saveNotebook()
            false

    
    #$("#btnClear").click(clearAndInit);
    $("#btnSave").click saveNotebook
    return


#            $("#btnOpen").click(function(){
#                openNotebook($(".notebookOwner").text(), $("#notebookAccess").val(),  $("#notebookName").val() );
#            });
