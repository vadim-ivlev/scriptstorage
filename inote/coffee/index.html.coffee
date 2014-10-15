store = new NoteBookStorage()



# click handler to delete a notebook ============================================
@deleteNotebook = (key_name) ->
    return unless confirm("Are you sure?")

    store.del(
        key_name
    ,
        (d) -> if d.error then alert (d.error) else setTimeout('location.reload(true)',100)
    ,
        (err) -> alert "Deleting Error"+err
    )


# ------------------------- Data table functions --------------------

show_list = (url, selector) ->
    store.get_list url, (d)->
        buildTable(d, selector)

public_columns =

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

# fills container td with notebook name
build_notebook_name_field = (td,d) ->
    td.html('')
    unet=encodeURIComponent(d.user_name+'|'+d.user_network)
    access=encodeURIComponent(d.access)
    name=encodeURIComponent(d.notebook_name)
    a=$('<a></a>')
    
    a.attr 'href', "/page?owner=#{unet}&access=#{access}&name=#{name}"
    a.text d.notebook_name
    
    icon = $("<span></span>")
    if d.notebook_name.indexOf('/') is -1
        icon.addClass 'icon-file'
        icon.css 'opacity', 0.0
    else
        icon.addClass "icon-folder"

    td.append icon
    td.append a

# adds delete button to container td
build_delete_button = (td, d) ->
    td.html('').css('text-align','right')
    # check if the user can delete the notebook
    unless $(".user_name").text()==d.user_name and $('.user_network').text()==d.user_network
        return ''
    
    x = $ "<span class='toolButton' title='delete' >&#x00D7</span>"
    x.click -> deleteNotebook(d.key_name)
    td.append x

# adds eye icon to the user field
build_user_name_field = (td, d) ->
    if td.text() == "public"
        td.addClass "cell_public"
        td.addClass "icon-eye-before"
    else
        td.addClass "icon-eye-transparent"


# build table from json data d, in the container specified by selector
buildTable = (d, selector)->
    t=$ '<table class="hover compact" width="100%" ></table>'
    t.hide()
    $(selector).append t

    # fill it with data using dataTable library
    t.dataTable
        data: d,
        paging:false
        columns: if selector is "#publicList" then public_columns else user_columns
        createdRow: (row, d, i) ->
            tds=$(row).find('td')
            build_notebook_name_field tds.first(), d
            build_delete_button tds.last(), d
            # if it is a user's list change style of public notebooks
            if selector is "#userList"
                build_user_name_field $(tds[1]), d

        
    t.show()
    #showProperPane()
    return


# Hide user tab if he is not signed in
showProperPane = () ->
    if not $(".user_name").text()
        #$('.publicPane').hide()
        $('.userTab').hide()
    else
        $('.userTab').tab('show')
        $('#publicPane').removeClass('active')
        $('#userPane').addClass('active')




# on page load ==================================================================
$ ->
    $("#notebookList").hide()
    show_list('/publiclist','#publicList')
    show_list('/userlist','#userList')
    
    # Hide user tab if he is not signed in
    showProperPane()


    $("#btnCreate").click ->
        newName = "N" + (5000000 + Math.floor(999000 * Math.random()))
        newName = prompt "Change the name", newName
        if newName
            #document.location.href = "/page?owner=" + encodeURIComponent($("#userName").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
            document.location.href = "/page?owner=" + encodeURIComponent($(".user_name").text() + "|" + $(".user_network").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
    
