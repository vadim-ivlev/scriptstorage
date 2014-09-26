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




show_list = (url, selector) ->
    store.get_list url, (d)->
        buildTable(d, selector)



# build table from json data d, in the container specified by selector
buildTable = (d, selector)->
    t=$ '<table class="hover compact" width="100%" ></table>'
    t.hide()
    $(selector).append t
    # fill it with data usinf dataTable library
    t.dataTable
        data: d,
        paging:false
        createdRow: (row, d, i) ->
            unet=encodeURIComponent(d.user_name+'|'+d.user_network)
            access=encodeURIComponent(d.access)
            name=encodeURIComponent(d.notebook_name)
            tds=$(row).find('td')

            # create a link in the first cell
            tds.first().html('')
            a=$('<a></a>')
            a.appendTo(tds.first())
            a.attr 'href', "/page?owner=#{unet}&access=#{access}&name=#{name}"
            a.text d.notebook_name

            # create a span with a cross in the last cell
            tds.last().html('')
            #if $(".user_social_name").text()==d.user_name and $('.user_network').text()==d.user_network
            if true
                tds.last().css('text-align','right')
                x = $ "<span class='toolButton' title='delete' >&#x00D7</span>"
                x.appendTo(tds.last())
                x.click -> deleteNotebook(d.key_name)

        columns: [
            { title: 'Name', data:'notebook_name' }
            { title: 'Acc', data:'access', width:60 }
            { title: 'User', data:'user_name', width:120 }
            { title: '', data:'access',  width:26 }
        ]
    t.show()
    return


# on page load ==================================================================
$ ->
    # Hide user tab if he is not signed in
    if not $(".user_social_name").text()
        $('.userTab').hide()

    $("#notebookList").hide()
    show_list('/publiclist','#publicList')
    show_list('/userlist','#userList')
    
    $("#btnCreate").click ->
        newName = "N" + (5000000 + Math.floor(999000 * Math.random()))
        newName = prompt "Change the name", newName
        if newName
            #document.location.href = "/page?owner=" + encodeURIComponent($("#userName").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
            document.location.href = "/page?owner=" + encodeURIComponent($(".user_social_name").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
    
