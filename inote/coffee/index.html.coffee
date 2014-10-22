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
    show_public_list('/publiclist','#publicList')
    show_user_list('/userlist','#userList')

    # Hide user tab if he is not signed in
    showProperPane()


    $("#btnCreate").click ->
        newName = "N" + (5000000 + Math.floor(999000 * Math.random()))
        newName = prompt "Change the name", newName
        if newName
            #document.location.href = "/page?owner=" + encodeURIComponent($("#userName").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
            document.location.href = "/page?owner=" + encodeURIComponent($(".user_name").text() + "|" + $(".user_network").text()) + "&access=" + encodeURIComponent("public") + "&name=" + encodeURIComponent(newName)
    
