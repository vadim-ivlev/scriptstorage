
# Build a lisy of notebooks on HTML page ========================================
buildNotebookList = (data) =>
    key_names = data.split("\n")
    s = ""
    last_owner = ""
    last_access = ""

    for key_name in key_names
        name_parts = key_name.split("/")
        continue    if name_parts.length < 3
        notebook_owner = name_parts[0]
        notebook_access = name_parts[1]
        notebook_name = name_parts[2]
        
        unless last_owner is notebook_owner
            s += "<div style='padding-left: 0px;'>" + notebook_owner + "</div>"
            last_owner = notebook_owner
        unless last_access is notebook_access
            s += "<div  style='padding-left: 25px; color:" + ((if notebook_access is "private" then "black" else "")) + ";  '>" + notebook_access + "</div>"
            last_access = notebook_access
        s += """
        <div style='padding-left: 50px;'>
           <a 
           href='/page?owner=#{encodeURIComponent(notebook_owner)}&access=#{encodeURIComponent(notebook_access)}&name=#{encodeURIComponent(notebook_name)}'
           >#{notebook_name}</a>&nbsp;&nbsp;&nbsp;
           <span class='toolButton' title='delete' onclick='deleteNotebook("#{key_name}")'>&#x00D7</span>
        </div>
        """
        
        
    $("#notebookList").html s

# click handler to delete a notebook ============================================
@deleteNotebook = (key_name) ->
    return    unless confirm("Are you sure?")
    #storage.del(key_name, location.reload, alert)
    $.ajax
        url: "/delete"
        dataType: "text"
        data:
            key_name: key_name

        success: (data) -> setTimeout('location.reload(true)',100)
        error: (e) -> alert(e)
    return


storage = new NoteBookStorage()
# on page load ==================================================================
$ ->
    loginHolder =$(".loginHolder")
    # check if login text contains python server template 
    if loginHolder.text().match(/^{{/)
        loginHolder.load "/getloginlink"
    
    
    # check if notebook list contains python server template 
    if $("#notebookList").text().match(/^{{/)
        storage.list buildNotebookList
    else
        buildNotebookList  $("#notebookList").text()
    
    $("#btnCreate").click ->
        newName = "N" + (5000000 + Math.floor(999000 * Math.random()))
        newName = prompt "Change the name", newName
        if newName
            #document.location.href = "/page?owner=" + encodeURIComponent($("#userName").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
            document.location.href = "/page?owner=" + encodeURIComponent($(".user_social_name").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
    
    # check if login text has login 
    #loginHolder.addClass(if loginHolder.text().match(/login/i) then "icon-login" else "icon-logout")

    #prepareOAuthorization()
