// Generated by CoffeeScript 1.7.1
(function() {
  var buildNotebookList, prepareOAuthorization, storage;

  buildNotebookList = (function(_this) {
    return function(data) {
      var key_name, key_names, last_access, last_owner, name_parts, notebook_access, notebook_name, notebook_owner, s, _i, _len;
      key_names = data.split("\n");
      s = "";
      last_owner = "";
      last_access = "";
      for (_i = 0, _len = key_names.length; _i < _len; _i++) {
        key_name = key_names[_i];
        name_parts = key_name.split("/");
        if (name_parts.length < 3) {
          continue;
        }
        notebook_owner = name_parts[0];
        notebook_access = name_parts[1];
        notebook_name = name_parts[2];
        if (last_owner !== notebook_owner) {
          s += "<div style='padding-left: 0px;'>" + notebook_owner + "</div>";
          last_owner = notebook_owner;
        }
        if (last_access !== notebook_access) {
          s += "<div  style='padding-left: 25px; color:" + (notebook_access === "private" ? "black" : "") + ";  '>" + notebook_access + "</div>";
          last_access = notebook_access;
        }
        s += "<div style='padding-left: 50px;'>\n   <a \n   href='/page?owner=" + (encodeURIComponent(notebook_owner)) + "&access=" + (encodeURIComponent(notebook_access)) + "&name=" + (encodeURIComponent(notebook_name)) + "'\n   >" + notebook_name + "</a>&nbsp;&nbsp;&nbsp;\n   <span class='toolButton' title='delete' onclick='deleteNotebook(\"" + key_name + "\")'>&#x00D7</span>\n</div>";
      }
      return $("#notebookList").html(s);
    };
  })(this);

  this.deleteNotebook = function(key_name) {
    if (!confirm("Are you sure?")) {
      return;
    }
    $.ajax({
      url: "/delete",
      dataType: "text",
      data: {
        key_name: key_name
      },
      success: function(data) {
        return setTimeout('location.reload(true)', 100);
      },
      error: function(e) {
        return alert(e);
      }
    });
  };

  prepareOAuthorization = function() {
    return $.getScript("/inote/libs/hello.min.js", function() {
      var fb, win_log, win_out, wl;
      hello.init({
        facebook: '1517454335144201',
        windows: '0000000044121F60'
      }, {
        redirect_uri: 'http://inote.vadimivlev.com',
        display: 'popup'
      });
      hello.on("auth.login", function(auth) {
        hello(auth.network).api("/me").success(function(r) {
          var $div_, $page_;
          console.log(r);
          $page_ = $("#page");
          $div_ = $("<div id='profile_'><img src='" + r.thumbnail + "' /> Hey " + r.name + " <br>id: " + r.id + "</div>").appendTo($page_);
        });
      });
      win_log = $("<a id='win_log' href=''' style='margin:5px'>win_log</a>").appendTo($(".oauthHolder"));
      win_log.click(function(e) {
        e.preventDefault();
        return hello.login('windows');
      });
      win_out = $("<a id='win_out' href='' style='margin:5px'>win_out</a>").appendTo($(".oauthHolder"));
      win_out.click(function(e) {
        e.preventDefault();
        hello.logout('windows', {
          force: true
        });
        return console.log("logout");
      });
      fb = hello("facebook").getAuthResponse();
      wl = hello("windows").getAuthResponse();
      console.log(fb);
      return console.log(wl);
    });
  };

  storage = new NoteBookStorage();

  $(function() {
    if ($(".loginHolder").text().match(/^{{/)) {
      $(".loginHolder").load("/getloginlink");
    }
    if ($("#notebookList").text().match(/^{{/)) {
      storage.list(buildNotebookList);
    } else {
      buildNotebookList($("#notebookList").text());
    }
    $("#btnCreate").click(function() {
      var newName;
      newName = "N" + (5000000 + Math.floor(999000 * Math.random()));
      return document.location.href = "/page?owner=" + encodeURIComponent($("#userName").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName);
    });
    return prepareOAuthorization();
  });

}).call(this);

//# sourceMappingURL=index.html.map
