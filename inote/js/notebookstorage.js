// Generated by CoffeeScript 1.8.0
(function() {
  this.NoteBookStorage = (function() {
    function NoteBookStorage() {}

    NoteBookStorage.prototype.get_list = function(url, onsuccess, onerror) {
      return $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: onsuccess,
        error: onerror
      });
    };

    NoteBookStorage.prototype.get_publiclist = function(onsuccess, onerror) {
      return get_list('/publiclist', onsuccess, onerror);
    };

    NoteBookStorage.prototype.get_userlist = function(onsuccess, onerror) {
      return get_list('/userlist', onsuccess, onerror);
    };

    NoteBookStorage.prototype.get = function(owner_nickname, notebook_name, onsuccess, onerror) {
      return $.ajax({
        type: "GET",
        url: "/read",
        dataType: "text",
        data: {
          owner_nickname: owner_nickname,
          name: notebook_name
        },
        success: onsuccess,
        error: onerror
      });
    };

    NoteBookStorage.prototype.put = function(notebook_access, notebook_name, notebook_content, notebook_version, onsuccess, onerror) {
      var r;
      r = {
        type: "POST",
        url: "/write",
        dataType: "json",
        data: {
          name: notebook_name,
          access: notebook_access,
          content: notebook_content
        },
        success: onsuccess,
        error: onerror
      };
      if (notebook_version) {
        r.data.version = notebook_version;
      }
      return $.ajax(r);
    };

    NoteBookStorage.prototype.del = function(key_name, onsuccess, onerror) {
      return $.ajax({
        type: "GET",
        url: "/delete",
        dataType: "json",
        data: {
          key_name: key_name
        },
        success: function(d) {
          return typeof onsuccess === "function" ? onsuccess(d) : void 0;
        },
        error: function(e) {
          return typeof onerror === "function" ? onerror(e) : void 0;
        }
      });
    };

    NoteBookStorage.prototype.rename = function(key_name, notebook_access, notebook_name, notebook_content, notebook_version, onsuccess, onerror) {
      var r;
      r = {
        type: "POST",
        url: "/rename",
        dataType: "json",
        data: {
          key_name: key_name,
          name: notebook_name,
          access: notebook_access,
          content: notebook_content
        },
        success: onsuccess,
        error: onerror
      };
      if (notebook_version) {
        r.data.version = notebook_version;
      }
      return $.ajax(r);
    };

    return NoteBookStorage;

  })();

}).call(this);

//# sourceMappingURL=notebookstorage.js.map
