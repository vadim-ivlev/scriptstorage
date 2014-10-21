// Generated by CoffeeScript 1.8.0
(function() {
  var getNotebookAccessFromUrl, getNotebookNameFromUrl, getNotebookOwnerFromUrl, getPageQueryString, hideMenu, inote, restoreNotebookFromXml, saveNotebookTimeout, showMenu, storage;

  storage = new NoteBookStorage();

  saveNotebookTimeout = void 0;

  inote = void 0;

  this.preventClick = function(event) {
    event.stopPropagation();
  };

  this.selectTheme = function() {
    inote.setTheme($("#selectTheme_button").val());
    this.saveNotebookLater();
  };

  this.selectKeyMap = function() {
    inote.setKeyMap($("#notebookEditor").val());
    this.saveNotebookLater();
  };

  this.clearSaveIndicator = function() {
    return $("#saveIndicator").text("");
  };

  this.saveNotebookLater = function() {
    $("#saveIndicator").text("*");
    clearTimeout(saveNotebookTimeout);
    if ($("#autoSave").is(":checked")) {
      saveNotebookTimeout = setTimeout(saveNotebook, 2000);
    }
  };

  this.saveNotebook = function(event) {
    var notebookAccess, notebookName, notebookOwner, notebookVersion, xmlText;
    notebookName = $("#notebookName").text();
    notebookOwner = $(".user_name").text();
    notebookAccess = $(".nbAccess").text();
    notebookVersion = event ? null : $(".notebookVersion").text();
    xmlText = inote.getXmlText(notebookName);
    console.log("saveNotebook");
    storage.put(notebookAccess, notebookName, xmlText, notebookVersion, function(d) {
      var o;
      o = d;
      if (!o) {
        return;
      }
      if (o.error) {
        alert(o.error);
      } else {
        $("#saveIndicator").text("");
        $(".notebookVersion").text(o.version);
      }
    });
    hideMenu();
  };

  this.saveAs = function() {
    var newName;
    newName = prompt("Save as", $("#notebookName").text());
    if (newName) {
      $("#notebookName").text(newName);
    }
    this.saveNotebook(true);
    return hideMenu();
  };

  this.showShareSourceDialog = function(cellNumber) {
    var aInp, aOut, inpHref, outHref;
    aInp = $('#shareSourceDialog #cellSourceLink');
    inpHref = '/read' + getPageQueryString() + '&element_id=in' + cellNumber;
    aInp.text(inpHref);
    aInp.attr('href', inpHref);
    aOut = $('#shareSourceDialog #cellOutputLink');
    outHref = '/read' + getPageQueryString() + '&element_id=out' + cellNumber;
    aOut.text(outHref);
    aOut.attr('href', outHref);
    return $("#shareSourceDialog").show();
  };

  this.showRenameDialog = function(btnOkText, callback) {
    var b;
    b = $("#renameDialog .btnOk");
    b.text(btnOkText);
    b.unbind();
    b.bind('click', callback);
    return $("#renameDialog").show();
  };

  this.rename = function() {
    return alert("Not implemented");
  };

  getPageQueryString = function() {
    var access, name, notebook_access, notebook_name, unet, user_name, user_network;
    user_name = $(".user_name").text();
    user_network = $(".user_network").text();
    notebook_name = $("#notebookName").text();
    notebook_access = $(".nbAccess").text();
    unet = encodeURIComponent(user_name + '|' + user_network);
    access = encodeURIComponent(notebook_access);
    name = encodeURIComponent(notebook_name);
    return "?owner=" + unet + "&access=" + access + "&name=" + name;
  };

  this.getPageUrl = function(user_name, user_network, access, notebook_name) {
    var name, unet;
    unet = encodeURIComponent(user_name + '|' + user_network);
    access = encodeURIComponent(access);
    name = encodeURIComponent(notebook_name);
    return "/page?owner=" + unet + "&access=" + access + "&name=" + name;
  };

  this.rename2 = function(accessChanged) {
    var key_name, notebookAccess, notebookName, notebookOwner, notebookVersion, old_notebookAccess, old_notebookName, xmlText;
    notebookName = old_notebookName = $("#notebookName").text();
    notebookAccess = old_notebookAccess = $(".nbAccess").text();
    if (accessChanged) {
      notebookAccess = old_notebookAccess === "public" ? "private" : "public";
    } else {
      notebookName = prompt('Rename', old_notebookName);
      if (!notebookName) {
        return;
      }
    }
    notebookVersion = null;
    xmlText = inote.getXmlText(notebookName);
    notebookOwner = $("#notebookOwner").text();
    key_name = notebookOwner + "/" + old_notebookAccess + "/" + old_notebookName;
    console.log("Rename Notebook: " + key_name);
    storage.rename(key_name, notebookAccess, notebookName, xmlText, notebookVersion, function(d) {
      var o;
      o = d;
      if (!o) {
        return;
      }
      if (o.error) {
        alert(o.error);
      } else {
        $("#notebookName").text(notebookName);
        $("#saveIndicator").text("");
        $(".notebookVersion").text(o.version);
        $(".nbAccess").text(notebookAccess);
        window.history.replaceState(null, notebookAccess, '/page' + getPageQueryString());
      }
    });
    hideMenu();
  };


  /*
  openNotebook = (notebookOwner, notebookAccess, notebookName) ->
      clearAndInit()
      return    unless notebookName
      $(".notebookOwner").text notebookOwner
      $("#notebookName").text notebookName
       *$("#notebookAccess").val notebookAccess
       *storage.get notebookOwner, notebookName, restoreNotebookFromXml
      return
   */

  restoreNotebookFromXml = function(xmlText) {
    var empty, keyMap, notebook, themeName;
    empty = xmlText.replace(/\s/g, "") === "";
    if (!empty) {
      inote.clear();
      inote.setXmlText(xmlText);
      notebook = $(xmlText);
      themeName = notebook.attr("theme");
      if (themeName) {
        $("#selectTheme_button").val(themeName);
      }
      keyMap = notebook.attr("keyMap");
      if (keyMap) {
        $("#notebookEditor").val(keyMap);
      }
    }
    if ($(".cell").length === 0) {
      inote.init();
    } else {
      inote.bindKeys();
    }
    this.clearSaveIndicator();
  };

  getNotebookAccessFromUrl = function() {
    var notebook_access;
    notebook_access = "";
    try {
      notebook_access = location.href.match(/access=([^&]*)/)[1];
    } catch (_error) {}
    notebook_access = decodeURIComponent(notebook_access);
    return notebook_access;
  };

  getNotebookNameFromUrl = function() {
    var notebook_name;
    notebook_name = "";
    try {
      notebook_name = location.href.match(/name=([^&]*)/)[1];
    } catch (_error) {}
    notebook_name = decodeURIComponent(notebook_name);
    return notebook_name;
  };

  getNotebookOwnerFromUrl = function() {
    var notebook_owner;
    notebook_owner = "";
    try {
      notebook_owner = location.href.match(/owner=([^&]*)/)[1];
    } catch (_error) {}
    notebook_owner = decodeURIComponent(notebook_owner);
    return notebook_owner;
  };


  /*
  clearAndInit = ->
      inote.clear()
      inote.init()
      return
   */

  showMenu = function() {
    return $("#saveGroup").animate({
      left: 0,
      easing: 'linear'
    }, 100);
  };

  hideMenu = function() {
    return $("#saveGroup").animate({
      left: '-255px',
      easing: 'linear'
    }, 100);
  };

  $(function() {
    var headerTimeout, hide_header, hide_header_later, lastScroll, notebookOwner, page, show_header, userName, userNameNetwork, userNetwork, xmlText;
    page = $("#page");
    xmlText = page.html();
    page.html("");
    inote = new iNote($("#page"));
    window.runCell = inote.runCell;
    $("#selectTheme_button").val("default");
    inote.setTheme("default");
    $("#notebookEditor").val("default");
    inote.setKeyMap("default");
    restoreNotebookFromXml(xmlText);
    userName = $(".user_name").text();
    userNetwork = $(".user_network").text();
    userNameNetwork = "" + userName + "|" + userNetwork;
    notebookOwner = $("#notebookOwner").text();
    if (!notebookOwner) {
      notebookOwner = getNotebookOwnerFromUrl();
    }
    $("body").keydown(function(event) {
      if (event.ctrlKey && event.keyCode === 83) {
        if (!userNameNetwork) {
          alert("Please log in to save changes.");
          return;
        }
        if (userNameNetwork !== notebookOwner) {
          alert("Only '" + notebookOwner + "' can save changes");
          return;
        }
        saveNotebook();
        return false;
      }
    });
    $("#btnHideMenu").click(function(event) {
      event.stopPropagation();
      return hideMenu();
    });
    $("#btnMenu").click(function(event) {
      event.stopPropagation();
      return showMenu();
    });
    $("html").click(function(event) {
      return hideMenu();
    });
    $("#saveGroup").click(function(event) {
      return event.stopPropagation();
    });
    window.onbeforeunload = function() {
      if ($("#saveIndicator").text()) {
        return "You have unsaved changes.";
      }
    };
    headerTimeout = 0;
    hide_header_later = function() {
      clearTimeout(headerTimeout);
      return headerTimeout = setTimeout(hide_header, 3000);
    };
    hide_header = function() {
      if ($(window).scrollTop() > 40) {
        return $('.header').stop().animate({
          top: "-40px",
          opacity: 0.0
        }, 400);
      }
    };
    show_header = function(hide_later) {
      if (hide_later == null) {
        hide_later = false;
      }
      $('.header').css('background-color', $('body').css('background-color'));
      if ($(window).scrollTop() < 10) {
        $('.header').removeClass('header_shadow');
      } else {
        $('.header').addClass('header_shadow');
      }
      if (hide_later) {
        return $('.header').stop().animate({
          top: "0",
          opacity: 1.0
        }, 50, hide_header_later);
      } else {
        clearTimeout(headerTimeout);
        return $('.header').stop().animate({
          top: "0",
          opacity: 1.0
        }, 50);
      }
    };
    lastScroll = 0;
    $(window).scroll(function(e) {
      var st;
      st = $(this).scrollTop();
      if (st > lastScroll && st > 40) {
        hide_header();
      } else {
        show_header(true);
      }
      return lastScroll = st;
    });
    $('.header').mouseenter(function() {
      return show_header(false);
    });
    return $('.header').mouseleave(hide_header);
  });

}).call(this);

//# sourceMappingURL=inote.html.js.map
