// Generated by CoffeeScript 1.7.1
(function() {
  var adjust_ui, build_oauth_panel, delete_cookie, get_signed_network_name, on_page_load, on_signin, on_signout, read_cookie, write_cookie;

  hello.init({
    facebook: '1517454335144201',
    windows: '0000000044121F60'
  }, {
    redirect_uri: 'http://inote.vadimivlev.com/inote/html/login.html',
    display: 'popup'
  });

  hello.on("auth.login", function(auth) {
    return hello(auth.network).api("/me").success(function(r) {
      var n;
      console.log("auth.login");
      r.network = auth.network;
      console.log(r);
      if (n = get_signed_network_name()) {
        return console.log("Has signed already in '" + n + "'");
      } else {
        console.log("Real sign in '" + n + "'");
        on_signin(r);
        return location.reload();
      }
    });
  });

  hello.on("auth.logout", function(auth) {
    console.log("auth.logout");
    console.log(auth);
    on_signout();
    return location.reload();
  });


  /* TEST is not used
  checkNetwork = (network) ->
      r=hello(network).getAuthResponse()
   */

  write_cookie = function(r) {
    $.cookie('network', r.network, {
      expires: 7,
      path: '/'
    });
    $.cookie('id', r.id, {
      expires: 7,
      path: '/'
    });
    $.cookie('name', r.name, {
      expires: 7,
      path: '/'
    });
    $.cookie('thumbnail', r.thumbnail, {
      expires: 7,
      path: '/'
    });
  };

  this.write_sample_cookies = function() {
    return write_cookie({
      network: 'windows',
      id: '123456789',
      name: 'vad Ивлев',
      thumbnail: 'http://ddd.ddd.com/'
    });
  };

  this.delete_sample_cookies = function() {
    return delete_cookie();
  };

  read_cookie = function() {
    return {
      network: $.cookie('network'),
      id: $.cookie('id'),
      name: $.cookie('name'),
      thumbnail: $.cookie('thumbnail')
    };
  };

  delete_cookie = function() {
    $.removeCookie('network', {
      path: '/'
    });
    $.removeCookie('id', {
      path: '/'
    });
    $.removeCookie('name', {
      path: '/'
    });
    $.removeCookie('thumbnail', {
      path: '/'
    });
  };

  get_signed_network_name = function() {
    console.log("get_signed_network_name: " + (read_cookie().network));
    return read_cookie().network;
  };

  adjust_ui = function() {
    var build_signin_ui, build_signout_ui, network_name;
    build_signout_ui = function() {
      var addLogoutLink, c;
      addLogoutLink = function($container) {
        var r;
        r = read_cookie();
        $("<span id='profile_" + r.id + "' title='id: " + r.id + "' class='icon-" + r.network + "' >\n    <img src='" + r.thumbnail + "' style='width:30px; height:30px; border-radius:25px;vertical-align:middle;'/>\n    " + r.name + "\n</span>").appendTo($container);
        return $("<a id='" + r.network + "_logout' href='' style='text-decoration:none; margin:3px'>logout</a>").click(function(e) {
          e.preventDefault();
          return hello.logout(r.network, {
            force: true
          });
        }).appendTo($container);
      };
      c = $('.oauthHolder').html('');
      return addLogoutLink(c);
    };
    build_signin_ui = function() {
      var addLoginLink, c;
      addLoginLink = function($container, network) {
        return $("<a id='" + network + "_login' class='icon-" + network + "' href='' style='text-decoration:none; margin:3px'></a>").click(function(e) {
          e.preventDefault();
          return hello.login(network);
        }).appendTo($container);
      };
      c = $('.oauthHolder').html('');
      addLoginLink(c, "windows");
      addLoginLink(c, "googleplus");
      addLoginLink(c, "github");
      addLoginLink(c, "wordpress");
      addLoginLink(c, "twitter");
      return addLoginLink(c, "linkedin");
    };
    if (network_name = get_signed_network_name()) {
      return build_signout_ui(network_name);
    } else {
      return build_signin_ui();
    }
  };

  build_oauth_panel = function() {
    return $("<div class='oauthHolder' style='border:1px solid silver; width:100%; min-height:10px; background-color:white; position:absolute0; padding-top:10px; padding-bottom:10px; top:0px; left:0px; display:block; z-index:30000' ></div>").prependTo("body");
  };

  this.show_oauth_panel = function() {
    return $(".oauthHolder").show();
  };

  this.hide_oauth_panel = function() {
    return $(".oauthHolder").hide();
  };

  on_signin = function(r) {
    write_cookie(r);
    return adjust_ui();
  };

  on_page_load = function() {
    return adjust_ui();
  };

  on_signout = function() {
    delete_cookie();
    return adjust_ui();
  };

  $(function() {
    build_oauth_panel();
    return on_page_load();
  });

}).call(this);

//# sourceMappingURL=login.html.map
