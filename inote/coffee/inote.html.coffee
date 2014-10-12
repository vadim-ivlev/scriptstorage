
storage = new NoteBookStorage()
saveNotebookTimeout = undefined
inote = undefined


@preventClick = (event) ->
    #event.preventDefault()
    event.stopPropagation()
    return

@selectTheme = ->
    inote.setTheme $("#selectTheme_button").val()
    @saveNotebookLater()
    return

# select key binding mode for the editor. vim | sublime | default
@selectKeyMap = ->
    inote.setKeyMap $("#notebookEditor").val()
    @saveNotebookLater()
    return


@clearSaveIndicator = ->
    $("#saveIndicator").text ""


@saveNotebookLater = ->
    $("#saveIndicator").text "*"
    clearTimeout saveNotebookTimeout


    if $("#autoSave").is(":checked")
        saveNotebookTimeout = setTimeout saveNotebook , 2000
    return
        

@saveNotebook = (event) ->
    notebookName = $("#notebookName").text()
    #notebookOwner = $(".notebookOwner").text()
    notebookOwner = $(".user_name").text()
    notebookAccess = $(".nbAccess").text()
    
    # If it was the button who initiated the event then dont pass the version
    notebookVersion = if event then null else $(".notebookVersion").text()

    xmlText = inote.getXmlText(notebookName)
    
    #console.log(xmlText);
    console.log "saveNotebook"
    
    #localStorage.setItem("inote_"+bookName, xmlText);
    storage.put notebookAccess, notebookName, xmlText, notebookVersion, (d) ->
        o=d
        return unless o
        if o.error
            alert o.error
        else
            $("#saveIndicator").text ""
            $(".notebookVersion").text o.version
        return

    hideMenu()
    return

@saveAs = ->
    newName = prompt "Save as", $("#notebookName").text()
    $("#notebookName").text newName if newName
    @saveNotebook(true)
    hideMenu()



@showShareSourceDialog = (cellNumber) ->
    aInp=$('#shareSourceDialog #cellSourceLink')
    inpHref =  '/read' + getPageQueryString() + '&element_id=in'+cellNumber
    aInp.text inpHref
    aInp.attr 'href', inpHref

    aOut=$('#shareSourceDialog #cellOutputLink')
    outHref =  '/read' + getPageQueryString() + '&element_id=out'+cellNumber
    aOut.text outHref
    aOut.attr 'href', outHref

    $("#shareSourceDialog").show()


@showRenameDialog = (btnOkText, callback) ->
    b = $("#renameDialog .btnOk")
    b.text(btnOkText)
    b.unbind()
    b.bind('click', callback)
    $("#renameDialog").show()

@rename = ->
    alert "Not implemented"



getPageQueryString = ->
    
    user_name = $(".user_name").text()
    user_network = $(".user_network").text()
    notebook_name = $("#notebookName").text()
    notebook_access = $(".nbAccess").text()
    
    unet=encodeURIComponent(user_name+'|'+user_network)
    access=encodeURIComponent(notebook_access )
    name=encodeURIComponent(notebook_name)
    return "?owner=#{unet}&access=#{access}&name=#{name}"



@getPageUrl = (user_name, user_network, access, notebook_name) ->
    unet=encodeURIComponent(user_name+'|'+user_network)
    access=encodeURIComponent(access)
    name=encodeURIComponent(notebook_name)
    return "/page?owner=#{unet}&access=#{access}&name=#{name}"

@rename2 = (accessChanged) ->
    notebookName = old_notebookName =$("#notebookName").text()
    notebookAccess = old_notebookAccess = $(".nbAccess").text()
    
    if (accessChanged)
        notebookAccess = if old_notebookAccess is "public" then "private" else "public"
    else
        notebookName = prompt 'Rename', old_notebookName
        if not notebookName
            return


    notebookVersion = null
    xmlText = inote.getXmlText(notebookName)
    notebookOwner = $("#notebookOwner").text()

    key_name = notebookOwner + "/" + old_notebookAccess + "/" + old_notebookName

    console.log "Rename Notebook: " +key_name

    storage.rename key_name, notebookAccess, notebookName, xmlText, notebookVersion, (d) ->
        o=d
        return unless o
        if o.error
            alert o.error
        else
            $("#notebookName").text notebookName
            $("#saveIndicator").text ""
            $(".notebookVersion").text o.version
            $(".nbAccess").text notebookAccess
            window.history.replaceState(null, notebookAccess, '/page'+getPageQueryString() )
        return
    hideMenu()
    return


###
openNotebook = (notebookOwner, notebookAccess, notebookName) ->
    clearAndInit()
    return    unless notebookName
    $(".notebookOwner").text notebookOwner
    $("#notebookName").text notebookName
    #$("#notebookAccess").val notebookAccess
    #storage.get notebookOwner, notebookName, restoreNotebookFromXml
    return
###



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

    # if there is no cells do full init, oterwise just assign keys
    if $(".cell").length is 0
        inote.init()
    else
        inote.bindKeys()


    @clearSaveIndicator()
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



###
clearAndInit = ->
    inote.clear()
    inote.init()
    return
###
showMenu = ->
    $("#saveGroup").animate({left:0, easing:'linear'}, 100)

hideMenu = ->
    $("#saveGroup").animate({left:'-255px', easing:'linear'}, 100)




#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$ ->
    #$(".loginHolder").load "/getloginlink"
    
    # page transition
    #$("body").css("display", "none")
    
    page = $("#page")
    xmlText = page.html()
    page.html("")
    inote = new iNote($("#page"))
    window.runCell=inote.runCell
    
    $("#selectTheme_button").val("default")
    inote.setTheme "default"
    
    $("#notebookEditor").val("default")
    inote.setKeyMap "default"

    #inote=new iNote($(document.body));

    #openNotebook getNotebookOwnerFromUrl(), getNotebookAccessFromUrl(), getNotebookNameFromUrl()
    restoreNotebookFromXml(xmlText)
    
    #$("#notebookAccess").val getNotebookAccessFromUrl()

    
    
    # hide save buttons if the user is not loginned
    userName= $(".user_name").text()
    userNetwork= $(".user_network").text()
    #userId= $(".user_id").text()
    userNameNetwork = "#{userName}|#{userNetwork}"
    
    # first check if notebookOwner was returned by the server
    notebookOwner = $("#notebookOwner").text()
    if not notebookOwner
        notebookOwner = getNotebookOwnerFromUrl()

    # Save if the user press Ctrl-S
    $("body").keydown (event) ->
        if event.ctrlKey and event.keyCode is 83 #Ctrl-S
            if not userNameNetwork
                alert "Please log in to save changes."
                return
            if userNameNetwork != notebookOwner
                alert "Only '#{notebookOwner}' can save changes"
                return
            saveNotebook()
            false
    
    $("#btnHideMenu").click (event) ->
        event.stopPropagation()
        hideMenu()

    $("#btnMenu").click (event) ->
        event.stopPropagation()
        showMenu()

    $("html").click (event) ->
        hideMenu()

    $("#saveGroup").click (event) ->
        event.stopPropagation()

    #$("#notebookAccess").on "focus", (event) ->


    #$("#notebookAccess").change (event) ->
    #    rename2(true)

    window.onbeforeunload = ->
        if $("#saveIndicator").text()
            return "You have unsaved changes."

    #$("#btnClear").click(clearAndInit);

    # page transition
    #$("body").fadeIn(1000)




#            $("#btnOpen").click(function(){
#                openNotebook($(".notebookOwner").text(), $("#notebookAccess").val(),  $("#notebookName").text() );
#            });
