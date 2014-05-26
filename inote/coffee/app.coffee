# implement console log to avoid ie fail
if typeof window.console == 'undefined'
    window.console = {};
if !window.console.log
    window.console.log = -> {}

# enable cross domain support
# see http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
jQuery.support.cors = true

angular.module("MyApp", ['pasvaz.bindonce']).config [
    "$httpProvider",
    ($httpProvider) ->
        delete $httpProvider.defaults.headers.common["X-Requested-With"]
]

window.onerror = (msg, url, line)->
    # You can view the information in an alert to see things working like so:
    data = "Error: " + msg + "\nurl: " + url + "\nline #: " + line
    alert(data);

    # Report this error via ajax so you can keep track of what pages have JS issues
    ###
    $.ajax
        dataType: "json"
        url: "error_handler"
        type: "post"
        data:
            text: data
        success: (data, textStatus, jqXHR) ->
            $scope.$apply onSuccess(data, callbackParam)
        error: ->
            $scope.$apply onError(callbackParam)
    ###
    # If true, then error alerts (like in older versions of Internet Explorer) will be suppressed.
    return false
