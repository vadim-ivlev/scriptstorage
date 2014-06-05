

        var storage=new NoteBookStorage();

        function buildNotebookList(data)
        {
            var key_names=data.split("\n");
            var s="";
            var last_owner="";
            var last_access="";

            for (var i=0; i<key_names.length; i++)
            {
                var key_name=key_names[i];
                var name_parts=key_name.split("/");
                if (name_parts.length<3) continue;

                var notebook_owner=name_parts[0];
                var notebook_access=name_parts[1];
                var notebook_name=name_parts[2];
                //if (access=="private" && notebook_owner!=nickname) continue

//                if (last_owner!=notebook_owner || last_access!=notebook_access){
//                    s+="<div style='padding-left: 0px;'>"+notebook_owner +" <br>"+notebook_access+"</div>";
//                    last_owner=notebook_owner;
//                    last_access=notebook_access;
//                }

                if (last_owner!=notebook_owner){
                    s+="<div style='padding-left: 0px;'>"+notebook_owner +"</div>";
                    last_owner=notebook_owner;
                }

                if (last_access!=notebook_access){
                    s+="<div  style='padding-left: 25px; color:"+(notebook_access=="private"?"black":"")+";  '>"+notebook_access+"</div>";
                    last_access=notebook_access;
                }

                s+="<div style='padding-left: 50px;'>"+
                        "<a href='inote.html?"+
                        "notebook_owner="+encodeURIComponent(notebook_owner)+
                        "&notebook_access="+encodeURIComponent(notebook_access)+
                        "&notebook_name="+encodeURIComponent(notebook_name)+
                          "'>"+notebook_name+"</a>&nbsp;&nbsp;&nbsp;"+

                        "<span class='toolButton' title='delete' onclick='deleteNotebook(\""+key_name+"\")'>&#x00D7</span>"+

                   "</div>";

            }

            $("#notebookList").html(s);
        }


        function deleteNotebook(key_name)
        {
            if (! confirm ("Sure?")) return;

            $.ajax({
                url: "/delete",
                data: {key_name: key_name},
                success:function (data){
                    location.reload();
                },
                error:function(e){
                  alert(e);
                }
            });

        }

        $(function(){
            $(".loginHolder").load("/getloginlink");
            storage.list(buildNotebookList);

            $("#btnCreate").click(function(){
                var newName="N"+(5000000+Math.floor(999000*Math.random()));
                document.location.href="inote.html?notebook_owner="+encodeURIComponent($("#userName").text())+
                        "&notebook_access="+encodeURIComponent("public")+
                        "&notebook_name="+encodeURIComponent(newName);
            });

        });

