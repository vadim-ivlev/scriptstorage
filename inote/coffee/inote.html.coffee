
storage = new NoteBookStorage()
saveNotebookTimeout = undefined
inote = undefined




@selectTheme = ->
    inote.setTheme $("#selectTheme_button").val()
    @saveNotebookLater()
    return


@selectKeyMap = ->
    inote.setKeyMap $("#notebookEditor").val()
    @saveNotebookLater()
    return


@saveNotebookLater = ->
    $("#saveIndicator").text "*"
    clearTimeout saveNotebookTimeout


    if $("#autoSave").is(":checked")
        saveNotebookTimeout = setTimeout saveNotebook , 2000
    return
        

@saveNotebook = (event) ->
    notebookName = $("#notebookName").text()
    #notebookOwner = $(".notebookOwner").text()
    notebookOwner = $(".user_social_name").text()
    notebookAccess = $("#notebookAccess").val()
    
    # If it was the button who initiated the event then dont pass the version
    notebookVersion = if event then null else $(".notebookVersion").text()

    xmlText = inote.getXmlText(notebookName)
    
    #console.log(xmlText);
    console.log "saveNotebook"
    
    #localStorage.setItem("inote_"+bookName, xmlText);
    storage.put notebookAccess, notebookName, xmlText, notebookVersion, (d) ->
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

        keyMap= notebook.attr("keyMap")
        if keyMap then $("#notebookEditor").val keyMap

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
    
    # page transition
    #$("body").css("display", "none")
    
    page = $("#page")
    xmlText = page.html()
    page.html("")
    inote = new iNote($("#page"))
    
    $("#selectTheme_button").val("default")
    inote.setTheme "default" 
    
    $("#notebookEditor").val("default")
    inote.setKeyMap "default" 

    #inote=new iNote($(document.body));

    #openNotebook getNotebookOwnerFromUrl(), getNotebookAccessFromUrl(), getNotebookNameFromUrl()
    restoreNotebookFromXml(xmlText)
    
    $("#notebookAccess").val getNotebookAccessFromUrl()

    ###
    # Save if the user press Ctrl-S
    $("body").keydown (event) ->
        if event.ctrlKey and event.keyCode is 83 #Ctrl-S
            saveNotebook()
            false
    ###
    
    #userName= $("#userName").text()
    
    # hide save buttons if the user is not loginned
    #$("#saveGroup").hide()
    userName= $(".user_social_name").text()
    userNetwork= $(".user_network").text()
    userId= $(".user_id").text()
    userNameNetwork="#{userName}|#{userNetwork}"
    notebookOwner=getNotebookOwnerFromUrl()

    if userNameNetwork and userNameNetwork is notebookOwner
        $("#saveGroup").show()
        # Save if the user press Ctrl-S
        $("body").keydown (event) ->
            if event.ctrlKey and event.keyCode is 83 #Ctrl-S
                saveNotebook()
                false
    ### 
    if userName != 
        $("#saveGroup").hide()
    ###
    
    #$("#btnClear").click(clearAndInit);

    # page transition
    #$("body").fadeIn(1000)




#            $("#btnOpen").click(function(){
#                openNotebook($(".notebookOwner").text(), $("#notebookAccess").val(),  $("#notebookName").text() );
#            });
