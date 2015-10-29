// Generated by CoffeeScript 1.10.0
(function() {
  var build_breadcrumbs, build_delete_button, build_public_notebook_name_field, build_user_name_field, build_user_notebook_name_field, build_user_table2, buld_public_table, buld_user_table, clone_object, clone_with_path, collapse_folders, files_in_path, get_folder_content, get_href, open_file, processed_user_list, public_columns, raw_user_list, set_current_user_folder, user_columns;

  this.show_public_list = function(url, selector) {
    return $.ajax({
      url: url,
      success: function(d) {
        return buld_public_table(d, selector);
      },
      dataType: 'json'
    });
  };

  raw_user_list = null;

  processed_user_list = null;

  this.current_user_folder = '';

  set_current_user_folder = function(folderName, selector) {
    var ol;
    this.current_user_folder = folderName;
    $('.current_user_folder').html('');
    ol = build_breadcrumbs(this.current_user_folder, selector);
    return $('.current_user_folder').append(ol);
  };

  build_breadcrumbs = function(path, selector) {
    var a, h, i, j, len, li, ol, pa, path_array, text;
    path_array = ('/' + path).split('/');
    path_array.pop();
    ol = $('<ol></ol>');
    ol.addClass('breadcrumb');
    ol.css('background-color', 'transparent');
    ol.css('margin-bottom', 0);
    i = 0;
    for (j = 0, len = path_array.length; j < len; j++) {
      pa = path_array[j];
      li = $('<li></li>');
      h = path_array.slice(0, +i + 1 || 9e9).join('/') + '/';
      text = pa === '' ? 'home' : pa;
      a = $("<a>" + text + "</a>");
      a.attr('href', h.slice(1));
      a.click(function(event) {
        var folder;
        event.preventDefault();
        folder = $(this).attr('href');
        return open_file({
          is_folder: true,
          folder_name: folder,
          path: ''
        }, selector);
      });
      li.append(a);
      ol.append(li);
      i += 1;
    }
    return ol;
  };

  build_user_table2 = function(list, folder, selector) {
    processed_user_list = get_folder_content(list, folder);
    return buld_user_table(processed_user_list, selector);
  };

  this.show_user_list = function(url, selector) {
    return $.ajax({
      url: url,
      success: function(d) {
        raw_user_list = d;
        set_current_user_folder('', selector);
        return build_user_table2(raw_user_list, this.current_user_folder, selector);
      },
      dataType: 'json'
    });
  };

  public_columns = [
    {
      title: 'Name',
      data: 'notebook_name'
    }, {
      title: 'User',
      data: 'user_name',
      width: 120
    }, {
      title: '',
      data: 'access',
      width: 26
    }
  ];

  user_columns = [
    {
      title: 'Name',
      data: 'notebook_name'
    }, {
      title: 'Acc',
      data: 'access',
      width: 60
    }, {
      title: '',
      data: 'access',
      width: 26
    }
  ];

  get_href = function(d) {
    var access, name, unet;
    unet = encodeURIComponent(d.user_name + '|' + d.user_network);
    access = encodeURIComponent(d.access);
    name = encodeURIComponent(d.notebook_name);
    return "/page?owner=" + unet + "&access=" + access + "&name=" + name;
  };

  build_public_notebook_name_field = function(td, d) {
    var a, icon;
    td.html('');
    a = $('<a></a>');
    a.attr('href', get_href(d));
    a.text(d.notebook_name);
    icon = $("<span></span>");
    if (d.notebook_name.indexOf('/') === -1) {
      icon.addClass('icon-file');
      icon.css('opacity', 0.0);
    } else {
      icon.addClass("icon-folder");
    }
    return td.append(a);
  };

  build_user_notebook_name_field = function(td, d, selector) {
    var a, icon;
    a = $('<a></a>');
    icon = $("<span></span>");
    if (d.is_folder) {
      icon.addClass("icon-folder");
      a.text(d.folder_name);
      a.attr('href', '');
      a.click(function(event) {
        event.preventDefault();
        return open_file(d, selector);
      });
    } else {
      icon.addClass('icon-file');
      a.attr('href', get_href(d));
      a.text(d.rest_of_name);
    }
    td.html('');
    td.append(icon);
    return td.append(a);
  };

  build_delete_button = function(td, d) {
    var x;
    td.html('').css('text-align', 'right');
    if (!d.is_folder) {
      if (!($(".user_name").text() === d.user_name && $('.user_network').text() === d.user_network)) {
        return '';
      }
      x = $("<span class='toolButton' title='delete' >&#x00D7</span>");
      x.click(function() {
        return deleteNotebook(d.key_name);
      });
      return td.append(x);
    }
  };

  build_user_name_field = function(td, d) {
    if (d.is_folder) {
      return td.text('');
    } else {
      if (td.text() === "public") {
        td.addClass("cell_public");
        return td.addClass("icon-eye-before");
      } else {
        return td.addClass("icon-eye-transparent");
      }
    }
  };

  buld_public_table = function(d, selector) {
    var t;
    $(selector).html('');
    t = $('<table class="hover compact" width="100%" ></table>');
    t.hide();
    $(selector).append(t);
    t.dataTable({
      data: d,
      paging: false,
      columns: public_columns,
      createdRow: function(row, d, i) {
        var tds;
        tds = $(row).find('td');
        build_public_notebook_name_field(tds.first(), d);
        return build_delete_button(tds.last(), d);
      }
    });
    t.show();
  };

  buld_user_table = function(d, selector) {
    var t;
    $(selector).html('');
    t = $('<table class="hover compact" width="100%" ></table>');
    t.hide();
    $(selector).append(t);
    t.dataTable({
      data: d,
      paging: false,
      columns: user_columns,
      createdRow: function(row, d, i) {
        var tds;
        tds = $(row).find('td');
        build_user_notebook_name_field(tds.first(), d, selector);
        build_delete_button(tds.last(), d);
        return build_user_name_field($(tds[1]), d);
      }
    });
    t.show();
  };

  clone_object = function(o) {
    var c, k;
    c = {};
    for (k in o) {
      c[k] = o[k];
    }
    return c;
  };

  clone_with_path = function(o, path) {
    var c, next_slash;
    if (path == null) {
      path = '';
    }
    if (!o) {
      return;
    }
    if (o.notebook_name.indexOf(path) !== 0) {
      return;
    }
    c = clone_object(o);
    c.path = path;
    c.rest_of_name = o.notebook_name.slice(path.length);
    next_slash = c.rest_of_name.indexOf('/');
    c.folder_name = '';
    c.is_folder = next_slash !== -1;
    c.next_slash = next_slash;
    if (c.is_folder) {
      c.folder_name = c.rest_of_name.slice(0, +next_slash + 1 || 9e9);
    }
    return c;
  };

  files_in_path = function(arr, path) {
    var a, c, j, len, o;
    a = [];
    for (j = 0, len = arr.length; j < len; j++) {
      o = arr[j];
      if (c = clone_with_path(o, path)) {
        a.push(c);
      }
    }
    return a;
  };

  collapse_folders = function(arr) {
    var a, folders, j, len, o;
    folders = {};
    a = [];
    for (j = 0, len = arr.length; j < len; j++) {
      o = arr[j];
      if (!o.is_folder) {
        a.push(clone_object(o));
      } else if (!folders[o.folder_name]) {
        folders[o.folder_name] = 1;
        a.push(clone_object(o));
      }
    }
    return a;
  };

  get_folder_content = function(a, path) {
    return collapse_folders(files_in_path(a, path));
  };

  open_file = function(o, selector) {
    if (o.is_folder) {
      set_current_user_folder(o.path + o.folder_name, selector);
      return build_user_table2(raw_user_list, this.current_user_folder, selector);
    }
  };

}).call(this);

//# sourceMappingURL=notebook_list.js.map
