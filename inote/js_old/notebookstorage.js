

function NoteBookStorage(){

    this.list=function(callback,onerror)
    {
        $.ajax ({
                type:"GET",
                url:"/list",
                dataType: "text",
                success:callback,
                error:onerror
            });
    }

    this.get=function(owner_nickname,notebook_name, callback, onerror)
    {
        $.ajax ({
            type:"GET",
            url:"/read",
            dataType: "text",
            data: {owner_nickname:owner_nickname, notebook_name:notebook_name},
            success:callback,
            error:onerror //function(){ callback( localStorage.getItem("inote_"+notebook_name)) ;}
        });
    }

    this.put=function(access, notebook_name, content, callback, onerror)
    {
        $.ajax ({
            type:"POST",
            url:"/write",
            dataType: "text",
            data:{ notebook_name: notebook_name, access:access, content:content},
            success:callback,
            error:onerror
        });
        localStorage.setItem("inote_"+notebook_name, content);
    }

}