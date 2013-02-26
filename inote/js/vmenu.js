/**
 * Inserts a menu into the target element ont he page
 *
 *
 *
 * @param targetSelector selector of an element to insert menu
 * @param menuDescriptor an object like:
 * [
 *  {value:"v1", text:"text1, submenu:
 *      [
 *          {value:"v1", text:"text1},
 *          {value:"v2", text:"text2},
 *          {value:"v3", text:"text3},
 *          {value:"v4", text:"text4},
 *          ...
 *      ]
 *  },
 *  ...
 * ]
 *
 */
function Vmenu(targetElement, menuDescriptor)
{
    var menuHolder=createMenu(targetElement,menuDescriptor)
        .css("display","inline-block")
        .css("position","static")
        .css("border-color","#FFF")
        .click(function(event){

            var menu0=menuHolder.find(".menu_level_0").first();
            var textHolder=menuHolder.find("._textValue").first();


            var t=$(event.target).text();
            var v=$(event.target).parent().attr("value");
            $(event.target).parent().parent().css("display","none");
            textHolder.text(t);
            menu0.attr("value",v)
            if(console)console.log(t+" "+v);
        });



    function createMenuItem(menuDescr)
    {
        if (! menuDescr) return;
        var item=$('<span class="menu_level_0" value="'+menuDescr['value']+'"><span class="_textValue">'+menuDescr['text']+'</span></span>');

        item.hover(
                function(event){
                    item.find(".menu_level_1").first().css("display","block");
                },
                function(event){
                    item.find(".menu_level_1").first().css("display","none");
                }
            );


        createMenu(item, menuDescr.submenu);
        return item;
    }

    function createMenu(targ, menuArray)
    {
        if (! targ) return;
        if (! menuArray) return;
        if ( menuArray.length==0) return;

        var menuHolder=$('<div class="menu_level_1"/>');
        for (var i=0; i< menuArray.length; i++)
        {
            var item=createMenuItem(menuArray[i]);
            menuHolder.append(item);
        }
        targ.append(menuHolder);
        return menuHolder;

    }
}
