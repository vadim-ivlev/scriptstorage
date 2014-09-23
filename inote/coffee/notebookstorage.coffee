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
                name: notebook_name

            success: onsuccess
            error: onerror



    put : (notebook_access, notebook_name, notebook_content, notebook_version, onsuccess, onerror) ->
        #localStorage.setItem "inote_" + notebook_name, notebook_content
        r =
            type: "POST"
            url: "/write"
            dataType: "json"
            data:
                name: notebook_name
                access: notebook_access
                content: notebook_content

            success: onsuccess
            error: onerror
        
        if notebook_version
            r.data.version = notebook_version
        
        $.ajax r


    del: (key_name, onsuccess, onerror) ->
        $.ajax
            url: "/delete"
            data:{ key_name: key_name }
            success:  -> onsuccess?()
            error: (e) -> onerror?(e)



