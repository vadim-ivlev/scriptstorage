# HELLOJS
prepareOAuthorization =() ->
    #$.getScript "/inote/libs/hello.min.js", ->
    # init ================== set OAuth 2 parameners =======================
    hello.init
        facebook :'1517454335144201'
        windows:'0000000044121F60'
    ,
        #redirect_uri:'http://inote.vadimivlev.com'
        redirect_uri:'http://inote.vadimivlev.com/inote/html/login.html'
        display: 'popup'


    # on login ,call user information for the given network =======================
    hello.on "auth.login", (auth) ->
      hello(auth.network).api("/me").success (r) ->
        console.log "auth.login"
        console.log r
        $page_ = $(".oauthLogin")
        $div_ = $("""
            <div id='profile_'>
                <img src='#{r.thumbnail}' style='width:50px; height:50px; border-radius:25px;vertical-align:middle;'/>
                id: #{r.id}
                name: #{r.name}
            </div>
            """).appendTo($page_)
        return
      return
    
    # on logout ,call user information for the given network =====================
    hello.on "auth.logout", (auth) ->
        console.log "auth.logout"
        console.log auth
    
    # Adds social login buttons to a container ====================================
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
        oLogin.append("<br>")
        oLogin.append("<a href='javascript:window.history.back()'>back</a>")
    


    # adds logout button to container =================================
    buildLogoutButton = (oLogout) ->
        addLogoutLink =(iconClass, network) ->
            $("<a id='#{network}_logout' class='#{iconClass}' href='' style='text-decoration:none; margin:3px'>logout</a>").appendTo(oLogout).click (e) ->
                e.preventDefault()
                hello.logout(network, {force:true})
                location.reload()
        
        addLogoutLink "icon-windows", "windows"
        
        oLogin.append("<br>")
        oLogin.append("<a href='javascript:window.history.back()'>back</a>")
    
    




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








# on page load ==================================================================
$ ->
    prepareOAuthorization()
