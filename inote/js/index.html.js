// Generated by CoffeeScript 1.7.1
(function() {
  var buildNotebookList, storage;

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
        s += "<div style='padding-left: 50px;'>\n   <a \n   href='inote.html?notebook_owner=" + (encodeURIComponent(notebook_owner)) + "&notebook_access=" + (encodeURIComponent(notebook_access)) + "&notebook_name=" + (encodeURIComponent(notebook_name)) + "'\n   >" + notebook_name + "</a>&nbsp;&nbsp;&nbsp;\n   <span class='toolButton' title='delete' onclick='deleteNotebook(\"" + key_name + "\")'>&#x00D7</span>\n</div>";
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
        return location.reload();
      },
      error: function(e) {
        return alert(e);
      }
    });
  };

  storage = new NoteBookStorage();

  $(function() {
    $(".loginHolder").load("/getloginlink");
    storage.list(buildNotebookList);
    return $("#btnCreate").click(function() {
      var newName;
      newName = "N" + (5000000 + Math.floor(999000 * Math.random()));
      return document.location.href = "inote.html?notebook_owner=" + encodeURIComponent($("#userName").text()) + "&notebook_access=" + encodeURIComponent("public") + "&notebook_name=" + encodeURIComponent(newName);
    });
  });

}).call(this);

//# sourceMappingURL=index.html.map
