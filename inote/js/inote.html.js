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

  this.saveNotebookLater = function() {
    clearTimeout(saveNotebookTimeout);
    if ($("#autoSave").is(":checked")) {
      saveNotebookTimeout = setTimeout(saveNotebook, 2000);
    } else {
      null;
    }
    $("#saveIndicator").text("");
  };

  this.saveNotebook = function() {
    var notebookAaccess, notebookName, notebookOwner, xmlText;
    notebookName = $("#notebookName").val();
    notebookOwner = $(".notebookOwner").text();
    notebookAaccess = $("#notebookAccess").val();
    xmlText = inote.getXmlText(notebookName);
    console.log("saveNotebook");
    storage.put(notebookAaccess, notebookName, xmlText, function(d) {
      $("#saveIndicator").text("(saved)");
    });
  };

  openNotebook = function(notebookOwner, notebookAccess, notebookName) {
    clearAndInit();
    if (!notebookName) {
      return;
    }
    $(".notebookOwner").text(notebookOwner);
    $("#notebookName").val(notebookName);
    $("#notebookAccess").val(notebookAccess);
  };

  restoreNotebookFromXml = function(xmlText) {
    var notebook, themeName;
    if (!xmlText) {
      return;
    }
    inote.clear();
    inote.setXmlText(xmlText);
    notebook = $(xmlText);
    themeName = notebook.attr("theme");
    if (themeName) {
      $("#selectTheme_button").val(themeName);
    }
    if ($(".cell").length === 0) {
      inote.init();
    }
  };

  getNotebookAccessFromUrl = function() {
    var notebook_access;
    notebook_access = "";
    try {
      notebook_access = location.href.match(/notebook_access=([^&]*)/)[1];
    } catch (_error) {}
    notebook_access = decodeURIComponent(notebook_access);
    return notebook_access;
  };

  getNotebookNameFromUrl = function() {
    var notebook_name;
    notebook_name = "";
    try {
      notebook_name = location.href.match(/notebook_name=([^&]*)/)[1];
    } catch (_error) {}
    notebook_name = decodeURIComponent(notebook_name);
    return notebook_name;
  };

  getNotebookOwnerFromUrl = function() {
    var notebook_owner;
    notebook_owner = "";
    try {
      notebook_owner = location.href.match(/notebook_owner=([^&]*)/)[1];
    } catch (_error) {}
    notebook_owner = decodeURIComponent(notebook_owner);
    return notebook_owner;
  };

  clearAndInit = function() {
    inote.clear();
    inote.init();
  };

  $(function() {
    var page, xmlText;
    page = $("#page");
    xmlText = page.html();
    page.html("");
    inote = new iNote($("#page"));
    inote.setTheme("default");
    restoreNotebookFromXml(xmlText);
    $("#notebookAccess").val(getNotebookAccessFromUrl());
    $("body").keydown(function(event) {
      if (event.ctrlKey && event.keyCode === 83) {
        saveNotebook();
        return false;
      }
    });
    $("#btnSave").click(saveNotebook);
  });

}).call(this);

//# sourceMappingURL=inote.html.map
