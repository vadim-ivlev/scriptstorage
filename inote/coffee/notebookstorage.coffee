class @NoteBookStorage
    
    
    list : (onsuccess, onerror) ->
        $.ajax
            type: "GET"
            url: "/list"
            dataType: "text"
            success: onsuccess
            error: onerror



    get : (owner_nickname, notebook_name, onsuccess, onerror) ->
        #onsuccess( localStorage.getItem("inote_"+notebook_name))
        $.ajax
            type: "GET"
            url: "/read"
            dataType: "text"
            data:
                owner_nickname: owner_nickname
                notebook_name: notebook_name

            success: onsuccess
            error: onerror



    put : (access, notebook_name, notebook_content, onsuccess, onerror) ->
        #localStorage.setItem "inote_" + notebook_name, notebook_content
        $.ajax
            type: "POST"
            url: "/write"
            dataType: "text"
            data:
                notebook_name: notebook_name
                access: access
                content: notebook_content

            success: onsuccess
            error: onerror



    del: (key_name, onsuccess, onerror) ->
        $.ajax
            url: "/delete"
            data:{ key_name: key_name }
            success:  -> onsuccess?() 
            error: (e) -> onerror?(e)



