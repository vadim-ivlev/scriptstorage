
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


###
# HELLOJS
prepareOAuthorization =() ->
    #$.getScript "/inote/libs/hello.min.js", ->
    # init 
    h ello.init
        facebook :'1517454335144201'
        windows:'0000000044121F60'
    ,
        #redirect_uri:'http://inote.vadimivlev.com'
        redirect_uri:'http://inote.vadimivlev.com/inote/html/login.html'
        display: 'popup'


    # on login ,call user information for the given network
    hello.on "auth.login", (auth) ->
      hello(auth.network).api("/me").success (r) ->
        console.log "auth.login"
        console.log r
        $page_ = $("#page")
        $div_ = $("""
            <div id='profile_'>
                <img src='#{r.thumbnail}' style='width:50px; height:50px; border-radius:25px;vertical-align:middle;'/>
                id: #{r.id}
                name: #{r.name}
            </div>
            """).appendTo($page_)
        return
      return
    
    # on logout ,call user information for the given network
    hello.on "auth.logout", (auth) ->
        console.log "auth.logout"
        console.log auth
    
    
    buildLoginButtons = (oLogin)->
        addLoginLink =(iconClass, network) ->
            $("<a id='#{network}_login' class='#{iconClass}' href='' style='text-decoration:none; margin:3px'></a>").appendTo(oLogin).click (e) ->
                e.preventDefault()
                hello.login(network)
        
        addLoginLink "icon-windows", "windows"
        addLoginLink "icon-googleplus", "googleplus"
        addLoginLink "icon-githib", "github"
        addLoginLink "icon-wordpress", "wordpress"
        addLoginLink "icon-twitter", "twitter"
        addLoginLink "icon-linkedin", "linkedin"
    
    buildLogoutButton = (oLogout) ->
        addLogoutLink =(iconClass, network) ->
            $("<a id='#{network}_logout' class='#{iconClass}' href='' style='text-decoration:none; margin:3px'>logout</a>").appendTo(oLogout).click (e) ->
                e.preventDefault()
                hello.logout(network, {force:true})
                location.reload()
        
        addLogoutLink "icon-windows", "windows"

    oauthHolder = $(".oauthHolder")
    oauthHolder.html ""
      
    oLogin = $("<span id='oLogin'></span>").appendTo oauthHolder
    $("<span>Login </span>").appendTo oLogin
    oLogout = $("<span id='oLogout'></span>").appendTo oauthHolder
    
    buildLoginButtons(oLogin)
    buildLogoutButton(oLogout)
    
    #TEST
    checkNetwork = (network) ->
        r=hello(network).getAuthResponse()
        butIn=oLogin.find("##{network}_login")

        butOut=oLogout.find("##{network}_logout")
        if r
            storage.list buildNotebookList
            oLogin.hide()
            butIn.hide()
            butOut.show()
            console.log r
        else
            oLogin.show()
            butIn.show()
            butOut.hide()
    
    adjustGUI = () ->
        checkNetwork "windows"
        console.log "adjustGUI"

    adjustGUI()
###
#
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
        document.location.href = "/page?owner=" + encodeURIComponent($("#userName").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
    
    # check if login text has login 
    #loginHolder.addClass(if loginHolder.text().match(/login/i) then "icon-login" else "icon-logout")

    #prepareOAuthorization()
