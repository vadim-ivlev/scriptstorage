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
    


    # adds logout button to container =================================
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
    $("<span>Sign in with</span><br><br>").appendTo oLogin
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









# New code ======================================================================

# OAuth parameters
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
    on_signin(r)


# on logout ,===================================================================
hello.on "auth.logout", (auth) ->
    console.log "auth.logout"
    console.log auth
    on_signout()



# r is the record from hello.login event
write_cookie = (r) ->
    $.cookie('network', r.network, { expires: 7, path: '/' })
    $.cookie('id', r.id, { expires: 7, path: '/' })
    $.cookie('name', r.name, { expires: 7, path: '/' })
    $.cookie('thumbnail', r.thumbnail, { expires: 7, path: '/' })
    return

read_cookie = ->
    #$.cookie()
    network: $.cookie('network')
    id: $.cookie('id')
    name: $.cookie('name')
    thumbnail: $.cookie('thumbnail')
        


delete_cookie = ->
    $.removeCookie('network', { path: '/' })
    $.removeCookie('id', { path: '/' })
    $.removeCookie('name', { path: '/' })
    $.removeCookie('thumbnail', { path: '/' })
    return



get_signed_network_name = ->
    read_cookie().network


# GUI depends on if the user is signed in or out
adjust_ui = -> 
    build_signout_ui =(network_name) ->
        # And the network logout link to contain
        addLogoutLink =($container, network) ->
            $("<a id='#{network}_logout' class='icon-#{network}' href='' style='text-decoration:none; margin:3px'>logout</a>")
                .click (e) -> e.preventDefault(); hello.logout(network, {force:true})
                .appendTo(oLogout)
        
        c=$('.oauthHolder').html('')
        addLogoutLink c, network_name

    build_signin_ui = ->
        # And the network logout link to contain
        addLoginLink =($container, network) ->
            $("<a id='#{network}_login' class='icon-#{network}' href='' style='text-decoration:none; margin:3px'></a>")
            .click (e) -> e.preventDefault(); hello.login(network)
            .appendTo($container)
        
        c=$('.oauthHolder').html('')
        addLoginLink c, "windows"
        addLoginLink c, "googleplus"
        addLoginLink c, "github"
        addLoginLink c, "wordpress"
        addLoginLink c, "twitter"
        addLoginLink c, "linkedin"
    
    if network_name = get_signed_network_name()
        build_signout_ui(network_name) 
    else 
        build_signin_ui()


# Sign in/out logic =========================================

# ON SIGN IN. When the user successfully signed in the server. 
on_signin = (r) -> write_cookie(r); adjust_ui()


# PAGE LOAD. When the page loaded from the server,
on_page_load = -> adjust_ui()


# ON SIGN OUT
on_signout = -> delete_cookie(); adjust_ui()





# on page load ==================================================================   
$ ->
    #prepareOAuthorization()
    on_page_load()

