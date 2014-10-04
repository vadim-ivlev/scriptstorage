
# New code ======================================================================

# OAuth parameters
hello.init
        facebook :'1517454335144201'
        windows:'0000000044121F60'
        github:'84a4f2c5dc8582a14718'
    ,
        redirect_uri:'http://inote.vadimivlev.com/'
        #redirect_uri:'http://inote.vadimivlev.com/inote/html/login.html'
        display: 'popup'
        #display: 'page'


# on login ,call user information for the given network =======================
hello.on "auth.login", (auth) ->
  hello(auth.network).api("/me").success (r) ->
    console.log "auth.login"

    # add network name to build a propper signout link, and to save in cookies
    r.network = auth.network
    console.log r
    if n=get_signed_network_name()
        console.log "Has signed already in '#{n}'"
    else
        console.log "Real sign in '#{n}'"
        on_signin(r)
        #go back
        #window.location.href = document.referrer
        # reload page
        location.reload()


# on logout ,===================================================================
hello.on "auth.logout", (auth) ->
    console.log "auth.logout"
    console.log auth
    on_signout()
    #go back
    #window.location.href = document.referrer
    # reload page
    location.reload()


### TEST is not used
checkNetwork = (network) ->
    r=hello(network).getAuthResponse()
###



# r is the record from hello.login event
write_cookie = (r) ->
    $.cookie('network', r.network, { expires: 7, path: '/' })
    $.cookie('id', r.id, { expires: 7, path: '/' })
    $.cookie('name', r.name, { expires: 7, path: '/' })
    $.cookie('thumbnail', r.thumbnail, { expires: 7, path: '/' })
    return

@write_sample_cookies = ->
    write_cookie
        network:'windows'
        id:'123456789'
        name:'vad Ивлев'
        thumbnail:'http://ddd.ddd.com/'

@delete_sample_cookies = ->
    delete_cookie()



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
    console.log "get_signed_network_name: #{read_cookie().network}"
    read_cookie().network


# GUI depends on if the user is signed in or out
adjust_ui = ->
    build_signout_ui = ->
        # And the network logout link to contain
        addLogoutLink =($container) ->
            r = read_cookie()
            $("""<span id='profile_#{r.id}' title='id: #{r.id}' class='i_con-#{r.network}' >
                </span>""").appendTo($container)
            #<img src='#{r.thumbnail}' style='width:30px; height:30px; border-radius:25px;vertical-align:middle;'/>
            #<span class='toolButton'>#{r.name}</span>

            $("<a id='#{r.network}_logout' href='' class='toolButton'>logout</a>")
                .click (e) -> e.preventDefault();  hello.logout(r.network, {force:true})
                .appendTo($container)
        
        c=$('.oauthHolder').html('')
        addLogoutLink c

    build_signin_ui = ->
        # And the network logout link to contain
        addLoginLink =($container, network) ->
            $("<a id='#{network}_login' class='icon-#{network}' href='' style='text-decoration:none; margin:3px'></a>")
            .click (e) -> e.preventDefault(); hello.login(network)
            .appendTo($container) 
        
        c=$('.oauthHolder').html('')
        addLoginLink c, "windows"
        #addLoginLink c, "googleplus"
        addLoginLink c, "github" 
        #addLoginLink c, "wordpress"
        #addLoginLink c, "twitter"
        #addLoginLink c, "linkedin"
        
    
    if network_name = get_signed_network_name()
        # hide google login holder
        $('.loginHolder').hide()
        build_signout_ui(network_name)
    else
        # hide google login holder
        $('.loginHolder').show()
        build_signin_ui()

    if $('.user_network').text() is 'gmail'
        $('.oauthHolder').hide()
    else
        $('.oauthHolder').show()
@show_oauth_panel = ->
    $(".oauthHolder").show()

@hide_oauth_panel= ->
    $(".oauthHolder").hide()
        
# Sign in/out logic =========================================

# ON SIGN IN. When the user successfully signed in the server. 
on_signin = (r) -> write_cookie(r); adjust_ui()


# PAGE LOAD. When the page loaded from the server,
on_page_load = -> adjust_ui()


# ON SIGN OUT
on_signout = -> delete_cookie(); adjust_ui()





# on page load ==================================================================   
$ ->
    on_page_load()

