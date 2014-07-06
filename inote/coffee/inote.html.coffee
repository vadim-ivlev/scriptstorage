
storage = new NoteBookStorage()
saveNotebookTimeout = undefined
inote = undefined




@selectTheme = ->
    inote.setTheme $("#selectTheme_button").val()
    @saveNotebookLater()
    return



@saveNotebookLater = ->
    $("#saveIndicator").text "*"
    clearTimeout saveNotebookTimeout

    #saveWithVersion = ->
    #    saveNotebook true

    if $("#autoSave").is(":checked")
        saveNotebookTimeout = setTimeout saveNotebook , 2000
    return
        
        


@saveNotebook = (event) ->
    notebookName = $("#notebookName").text()
    notebookOwner = $(".notebookOwner").text()
    notebookAaccess = $("#notebookAccess").val()
    
    # If it was the button who initiated the event then dont pass the version
    notebookVersion = if event then null else $(".notebookVersion").text()

    xmlText = inote.getXmlText(notebookName)
    
    #console.log(xmlText);
    console.log "saveNotebook"
    
    #localStorage.setItem("inote_"+bookName, xmlText);
    storage.put notebookAaccess, notebookName, xmlText, notebookVersion, (d) ->
        o=eval "a=#{d}"
        return unless o
        if o.error
            alert o.error
        else
            $("#saveIndicator").text ""
            $(".notebookVersion").text o.version
        return

    return

@changeName = ->
    newName = prompt "Change the name", $("#notebookName").text()
    $("#notebookName").text newName if newName


openNotebook = (notebookOwner, notebookAccess, notebookName) ->
    clearAndInit()
    return    unless notebookName
    $(".notebookOwner").text notebookOwner
    $("#notebookName").text notebookName
    $("#notebookAccess").val notebookAccess
    #storage.get notebookOwner, notebookName, restoreNotebookFromXml
    return




restoreNotebookFromXml = (xmlText) ->
    empty = xmlText.replace(/\s/g, "") is ""
    if not empty
        inote.clear()
        inote.setXmlText xmlText
        notebook = $(xmlText)
        themeName = notebook.attr("theme")
        if themeName then $("#selectTheme_button").val themeName
    inote.init()  if $(".cell").length is 0
    return



getNotebookAccessFromUrl = ->
    notebook_access = ""
    try
        notebook_access = location.href.match(/access=([^&]*)/)[1]
    notebook_access = decodeURIComponent(notebook_access)
    notebook_access




getNotebookNameFromUrl = ->
    notebook_name = ""
    try
        notebook_name = location.href.match(/name=([^&]*)/)[1]
    notebook_name = decodeURIComponent(notebook_name)
    notebook_name



getNotebookOwnerFromUrl = ->
    notebook_owner = ""
    try
        notebook_owner = location.href.match(/owner=([^&]*)/)[1]
    notebook_owner = decodeURIComponent(notebook_owner)
    notebook_owner




clearAndInit = ->
    inote.clear()
    inote.init()
    return





#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$ ->
    #$(".loginHolder").load "/getloginlink"
    
    page = $("#page")
    xmlText = page.html()
    page.html("")
    inote = new iNote($("#page"))
    $("#selectTheme_button").val("default")
    inote.setTheme $("#selectTheme_button").val()

    #inote=new iNote($(document.body));

    #openNotebook getNotebookOwnerFromUrl(), getNotebookAccessFromUrl(), getNotebookNameFromUrl()
    restoreNotebookFromXml(xmlText)
    
    $("#notebookAccess").val getNotebookAccessFromUrl()

    
    ### Save if the user press Ctrl-S
    $("body").keydown (event) ->
        if event.ctrlKey and event.keyCode is 83 #Ctrl-S
            saveNotebook()
            false
    ###
    
    
    # hide save button if the user is not loginned
    userName= $("#userName").text()
    if not userName
        $("#saveGroup").hide()
    
    if userName != getNotebookOwnerFromUrl()
        $("#saveGroup").hide()
        
    #$("#btnClear").click(clearAndInit);
    $("#btnSave").click saveNotebook


#            $("#btnOpen").click(function(){
#                openNotebook($(".notebookOwner").text(), $("#notebookAccess").val(),  $("#notebookName").text() );
#            });
