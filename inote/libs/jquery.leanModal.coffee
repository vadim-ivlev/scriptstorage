(($) ->
    $.fn.extend leanModal: (options) ->
        
        defaults =
            top: 100
            overlay: 0.5
            closeButton: null

        overlay = $("<div id='lean_overlay'></div>")
        $("body").append overlay
        options = $.extend(defaults, options)
        return @each(->
            o = options
            $(this).click (e) ->
                modal_id = $(this).attr("href")
                $("#lean_overlay").click ->
                    close_modal modal_id
                    return

                $(o.closeButton).click ->
                    close_modal modal_id
                    return

                modal_height = $(modal_id).outerHeight()
                modal_width = $(modal_id).outerWidth()
                $("#lean_overlay").css
                    display: "block"
                    opacity: 0

                $("#lean_overlay").fadeTo 200, o.overlay
                $(modal_id).css
                    display: "block"
                    position: "fixed"
                    opacity: 0
                    "z-index": 11000
                    left: 50 + "%"
                    "margin-left": -(modal_width / 2) + "px"
                    top: o.top + "px"

                $(modal_id).fadeTo 200, 1
                e.preventDefault()
                return

            return
        )
        
        close_modal = (modal_id) ->
            $("#lean_overlay").fadeOut 200
            $(modal_id).css display: "none"
            return
        
        return

    return
) jQuery
