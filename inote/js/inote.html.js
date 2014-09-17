// Generated by CoffeeScript 1.7.1
(function() {
  var clearAndInit, getNotebookAccessFromUrl, getNotebookNameFromUrl, getNotebookOwnerFromUrl, inote, openNotebook, restoreNotebookFromXml, saveNotebookTimeout, storage;

  storage = new NoteBookStorage();

  saveNotebookTimeout = void 0;

  inote = void 0;

  this.selectTheme = function() {
    inote.setTheme($("#selectTheme_button").val());
    this.saveNotebookLater();
  };

  this.selectKeyMap = function() {
    inote.setKeyMap($("#notebookEditor").val());
    this.saveNotebookLater();
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
    notebookOwner = $(".user_social_name").text();
    notebookAccess = $("#notebookAccess").val();
    notebookVersion = event ? null : $(".notebookVersion").text();
    xmlText = inote.getXmlText(notebookName);
    console.log("saveNotebook");
    storage.put(notebookAccess, notebookName, xmlText, notebookVersion, function(d) {
      var o;
      o = eval("a=" + d);
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
  };

  this.changeName = function() {
    var newName;
    newName = prompt("Change the name", $("#notebookName").text());
    if (newName) {
      return $("#notebookName").text(newName);
    }
  };

  openNotebook = function(notebookOwner, notebookAccess, notebookName) {
    clearAndInit();
    if (!notebookName) {
      return;
    }
    $(".notebookOwner").text(notebookOwner);
    $("#notebookName").text(notebookName);
    $("#notebookAccess").val(notebookAccess);
  };

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
    }
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

  clearAndInit = function() {
    inote.clear();
    inote.init();
  };

  $(function() {
    var notebookOwner, page, userId, userName, userNameNetwork, userNetwork, xmlText;
    page = $("#page");
    xmlText = page.html();
    page.html("");
    inote = new iNote($("#page"));
    $("#selectTheme_button").val("default");
    inote.setTheme("default");
    $("#notebookEditor").val("default");
    inote.setKeyMap("default");
    restoreNotebookFromXml(xmlText);
    $("#notebookAccess").val(getNotebookAccessFromUrl());
    userName = $(".user_social_name").text();
    userNetwork = $(".user_network").text();
    userId = $(".user_id").text();
    userNameNetwork = "" + userName + "|" + userNetwork;
    notebookOwner = getNotebookOwnerFromUrl();
    if (userNameNetwork && userNameNetwork === notebookOwner) {
      $("body").keydown(function(event) {
        if (event.ctrlKey && event.keyCode === 83) {
          saveNotebook();
          return false;
        }
      });
    }
    $("#btnMenu").click(function(event) {
      event.stopPropagation();
      return $("#saveGroup").animate({
        left: 0
      }, 50);
    });
    $("html").click(function(event) {
      return $("#saveGroup").animate({
        left: '-210px'
      }, 50);
    });
    return $("#saveGroup").click(function(event) {
      return event.stopPropagation();
    });
  });

}).call(this);

//# sourceMappingURL=inote.html.map
