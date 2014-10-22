# ------------------------- Data table functions --------------------

@show_public_list = (url, selector) ->
    $.ajax
        url:url
        success: (d) ->  buld_public_table(d, selector)
        dataType: 'json'

raw_user_list = null
processed_user_list = null
current_user_folder = ''
set_current_user_folder = (folderName) ->
    current_user_folder = folderName
    a = $('<a href="/"></a>')
    a.text current_user_folder
    $('.current_user_folder').html ''
    $('.current_user_folder').append a

build_user_table2 = (raw_user_list, current_user_folder, selector) ->
    processed_user_list = get_folder_content raw_user_list, current_user_folder
    buld_user_table(processed_user_list, selector)


@show_user_list = (url, selector) ->
    $.ajax
        url:url
        success: (d) ->
            raw_user_list = d
            build_user_table2 raw_user_list, current_user_folder, selector
        dataType: 'json'

public_columns = [
    { title: 'Name',    data:'notebook_name' }
    { title: 'User',    data:'user_name', width:120 }
    { title: '',        data:'access',  width:26 }
]

user_columns = [
    { title: 'Name',    data:'notebook_name' }
    { title: 'Acc',     data:'access', width:60 }
    { title: '',        data:'access',  width:26 }
]

# builds  url to the notebook by data d 
get_href =(d) ->
    unet=encodeURIComponent(d.user_name+'|'+d.user_network)
    access=encodeURIComponent(d.access)
    name=encodeURIComponent(d.notebook_name)
    "/page?owner=#{unet}&access=#{access}&name=#{name}"



# fills container td with notebook name
build_public_notebook_name_field = (td,d) ->
    td.html('')
    a=$('<a></a>')
    a.attr 'href', get_href d
    a.text d.notebook_name
    
    icon = $("<span></span>")
    if d.notebook_name.indexOf('/') is -1
        icon.addClass 'icon-file'
        icon.css 'opacity', 0.0
    else
        icon.addClass "icon-folder"

    #td.append icon
    td.append a

# fills container td with notebook name
build_user_notebook_name_field = (td,d, selector) ->
    a=$('<a></a>')
    icon = $("<span></span>")
    
    if d.is_folder
        icon.addClass "icon-folder"
        a.text d.folder_name
        a.attr 'href', ''
        a.click (event) ->
            event.preventDefault()
            open_file d, selector
    else
        icon.addClass 'icon-file'
        #icon.css 'opacity', 0.0
        a.attr 'href', get_href d
        a.text d.rest_of_name

    td.html('')
    td.append icon
    td.append a

# adds delete button to container td
build_delete_button = (td, d) ->
    td.html('').css('text-align','right')
    if not d.is_folder
        # check if the user can delete the notebook
        unless $(".user_name").text()==d.user_name and $('.user_network').text()==d.user_network
            return ''
        
        x = $ "<span class='toolButton' title='delete' >&#x00D7</span>"
        x.click -> deleteNotebook(d.key_name)
        td.append x

# adds eye icon to the user field
build_user_name_field = (td, d) ->
    if d.is_folder
        td.text ''
    else
        if td.text() == "public"
            td.addClass "cell_public"
            td.addClass "icon-eye-before"
        else
            td.addClass "icon-eye-transparent"


# build table from json data d, in the container specified by selector
buld_public_table = (d, selector)->
    # TODO destroy dataTable()
    $(selector).html ''
    t=$ '<table class="hover compact" width="100%" ></table>'
    t.hide()
    $(selector).append t

    # fill it with data using dataTable library
    t.dataTable
        data: d,
        paging:false
        columns: public_columns
        createdRow: (row, d, i) ->
            tds=$(row).find('td')
            build_public_notebook_name_field tds.first(), d
            build_delete_button tds.last(), d
        
    t.show()
    return



# build table from json data d, in the container specified by selector
buld_user_table = (d, selector)->
    $(selector).html ''
    t=$ '<table class="hover compact" width="100%" ></table>'
    t.hide()
    $(selector).append t

    # fill it with data using dataTable library
    t.dataTable
        data: d,
        paging:false
        columns: user_columns
        createdRow: (row, d, i) ->
            tds=$(row).find('td')
            build_user_notebook_name_field tds.first(), d, selector
            build_delete_button tds.last(), d
            build_user_name_field $(tds[1]), d

        
    t.show()
    return



# shallow clone the object
clone_object = (o) ->
  c = {}
  c[k] = o[k] for k of o
  return c

#    If notebook_name contains slashes return a clone of the object.
  #  Otherwise return null.
  #
  #  The clone has additional properties:
  #    path: path  - folder/subfolder/ where the object belongs
  #    rest_of_name: full name minus path
  #    is_folder: true|false - if this is a folder or a leave (rest_of_name contains "/")
  #    folder_name: "name of the folder" - The first chunk of the rest_of_name including "/"
clone_with_path = (o, path='') ->
  if not o then return

  if o.notebook_name.indexOf(path) != 0 then return
  c = clone_object o
  c.path = path
  c.rest_of_name = o.notebook_name[path.length..]
  next_slash = c.rest_of_name.indexOf('/')
  c.folder_name = ''
  c.is_folder = next_slash != -1
  c.next_slash = next_slash
  if c.is_folder
    c.folder_name = c.rest_of_name[0..next_slash]
  return c


# returns an array of objects
files_in_path = (arr, path) ->
  a = []
  for o in arr
    a.push c  if c = clone_with_path(o,path)
  return a


# filter out nodes with the same folder_name
collapse_folders = (arr) ->
    folders={}
    a=[]
    for o in arr
        if not o.is_folder
            a.push clone_object(o)
        else if not folders[o.folder_name]
            folders[o.folder_name]=1
            a.push clone_object(o)
    return a

# returns directory content
get_folder_content = (a, path) ->
  collapse_folders files_in_path a, path

open_file = (o, selector) ->
  if o.is_folder
    set_current_user_folder(o.path + o.folder_name)
    build_user_table2 raw_user_list, current_user_folder, selector
      

