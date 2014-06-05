



       function selectTheme() {
            var input = document.getElementById("selectTheme_button");
            var theme = input.options[input.selectedIndex].innerHTML;
            inote.setTheme(theme);
            saveNotebookLater();

        }




        var storage=new NoteBookStorage();


        var saveNotebookTimeout;
        function saveNotebookLater(){
            clearTimeout(saveNotebookTimeout);
            ($("#autoSave").is(":checked")) ? saveNotebookTimeout=setTimeout(saveNotebook,2000) : null;
            $("#saveIndicator").text("");
        }


        function saveNotebook()
        {
            var notebookName=$("#notebookName").val();
            var notebookOwner=$(".notebookOwner").text();
            var notebookAaccess=$("#notebookAccess").val();

            xmlText=inote.getXmlText(notebookName);
            //console.log(xmlText);
            console.log("saveNotebook");

            //localStorage.setItem("inote_"+bookName, xmlText);


            storage.put(notebookAaccess,notebookName, xmlText, function(d){$("#saveIndicator").text("(saved)");});

//            $("#btnSave").css("color","silver");
        }

        function openNotebook(notebookOwner , notebookAccess, notebookName)
        {
            clearAndInit();
            if (!notebookName) return;

            $(".notebookOwner").text(notebookOwner);
            $("#notebookName").val(notebookName);
            $("#notebookAccess").val(notebookAccess);

            storage.get(notebookOwner, notebookName, restoreNotebookFromXml);
        }

        function restoreNotebookFromXml(xmlText)
        {
            if (! xmlText)
            {
                return;
            }
            inote.clear();
            inote.setXmlText(xmlText);

            var notebook = $(xmlText);
            var themeName=notebook.attr("theme");
            $("#selectTheme_button").val(themeName);



            if ($(".cell").length==0)
                inote.init();
        }

        function getNotebookAccessFromUrl()
        {
            var notebook_access="";
            try {
                notebook_access=location.href.match(/notebook_access=([^&]*)/)[1];
            } catch(e){}
            notebook_access=decodeURIComponent(notebook_access);
            return notebook_access;
        }



        function getNotebookNameFromUrl()
        {
            var notebook_name="";
            try {
                notebook_name=location.href.match(/notebook_name=([^&]*)/)[1];
            } catch(e){}
            notebook_name=decodeURIComponent(notebook_name);
            return notebook_name;
        }
        function getNotebookOwnerFromUrl()
        {
            var notebook_owner="";
            try {
                notebook_owner=location.href.match(/notebook_owner=([^&]*)/)[1];
            } catch(e){}
            notebook_owner=decodeURIComponent(notebook_owner);
            return notebook_owner;
        }

        function clearAndInit(){
            inote.clear();
            inote.init();
        }

        var inote;
        $(function(){
            $(".loginHolder").load("/getloginlink");
            inote=new iNote($("#page"));
//            inote=new iNote($(document.body));
            openNotebook(getNotebookOwnerFromUrl(), getNotebookAccessFromUrl(), getNotebookNameFromUrl());

            //handlers
            $('body').keydown(function(event){
                if (event.ctrlKey && event.keyCode==83) //Ctrl-S
                {
                    saveNotebook();
                    return false;
                }
            })
            //$("#btnClear").click(clearAndInit);
            $("#btnSave").click(saveNotebook);
//            $("#btnOpen").click(function(){
//                openNotebook($(".notebookOwner").text(), $("#notebookAccess").val(),  $("#notebookName").val() );
//            });
        });



