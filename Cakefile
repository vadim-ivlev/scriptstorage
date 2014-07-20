###*

 `cake` - list tasks 
 `cake <taskName>` -run taskName

###


isWin = /^win/.test(process.platform)
curDirSymbol = if isWin then "%cd%" else "`pwd`"


js_files_text ="""
        if dbg            
            script(src='inote/libs/codemirror-4.3/lib/codemirror.js')
            script(src='inote/libs/codemirror-4.3/addon/hint/show-hint.js')
            script(src='inote/libs/codemirror-4.3/addon/hint/javascript-hint.js')
            script(src='inote/libs/codemirror-4.3/addon/comment/comment.js')
            script(src='inote/libs/codemirror-4.3/mode/xml/xml.js')
            script(src='inote/libs/codemirror-4.3/mode/javascript/javascript.js')
            script(src='inote/libs/codemirror-4.3/mode/css/css.js')
            script(src='inote/libs/codemirror-4.3/mode/htmlmixed/htmlmixed.js')
            script(src='inote/libs/codemirror-4.3/mode/coffeescript/coffeescript.js')
            script(src='i n o t e/libs/codemirror-4.3/addon/edit/formatting.js')
            script(src='inote/libs/codemirror-4.3/addon/edit/matchbrackets.js')
            script(src='inote/libs/codemirror-4.3/addon/edit/closetag.js')
            script(src='inote/libs/codemirror-4.3/addon/fold/foldcode.js')
            script(src='inote/libs/codemirror-4.3/addon/fold/foldgutter.js')
            script(src='inote/libs/codemirror-4.3/addon/fold/brace-fold.js')
            script(src='inote/libs/codemirror-4.3/addon/fold/xml-fold.js')
            script(src='inote/libs/codemirror-4.3/addon/fold/indent-fold.js')
            script(src='inote/libs/codemirror-4.3/addon/dialog/dialog.js')
            script(src='inote/libs/codemirror-4.3/addon/search/searchcursor.js')
            script(src='inote/libs/codemirror-4.3/addon/search/search.js')
            
            script(src='inote/libs/codemirror-4.3/keymap/vim.js')
            script(src='inote/libs/codemirror-4.3/keymap/sublime.js')
            
            script(src='inote/libs/coffee-script.js')
            script(src='inote/libs/json2.min.js')
            script(src='inote/libs/showdown.js')
            script(src='inote/libs/colResizable-1.3.min.js')
                
            script(src='inote/js/cdmirror.js')
            script(src='inote/js/cell.js')
            script(src='inote/js/inote.js')
            script(src='inote/js/notebookstorage.js')
            script(src='inote/js/inote.html.js')
        else
"""
    
js_files = js_files_text.match(/inote\/[^']*js/g)

console.log js_files


fs = require "fs"
{exec, spawn} = require 'child_process'
uglify = require("uglify-js")


task "server", "type: dev_appserver.py #{curDirSymbol}", ->
    execOut "dev_appserver.py #{curDirSymbol}"


task "rebuild", "rebuild all", ->
    rebuild()


task "watch", "Watch for changes and regenerate js, css и html.", ->
    fs.watch 'inote/coffee',  (event, filename) -> postpone  -> generateJs()
    fs.watch 'inote/jade',  (event, filename) -> postpone  -> generateHtml()
    fs.watch 'inote/less',  (event, filename) -> postpone  -> generateCss()


task "deploy", "type: appcfg.py update  #{curDirSymbol}", ->
    execOut "appcfg.py update  #{curDirSymbol}"

task "push", "push changes to Git", ->
    execOut "git add -A .", ->
        execOut 'git commit -am "a"', ->
            execOut 'git push'


task "test", "QUnit tests", ->
    execOut "qunit -c inote/js/cell.js -t inote/js/qunit-tests.js"



###
task 'deploy', '', ->
    execOut "tar -czf .upload.tgz *", (commandLine, err, stdout, stderr) ->
        execOut "ssh -i .Tester.key Tester-1@memorial06.cloudapp.net rm -rf /var/www/podvig-html", (commandLine, err, stdout, stderr) ->
            execOut "ssh -i .Tester.key Tester-1@memorial06.cloudapp.net mkdir /var/www/podvig-html", (commandLine, err, stdout, stderr) ->
                execOut "scp -r -i .Tester.key .upload.tgz Tester-1@memorial06.cloudapp.net:/var/www/podvig-html", (commandLine, err, stdout, stderr) ->
                    execOut "ssh -i .Tester.key Tester-1@memorial06.cloudapp.net tar xzf /var/www/podvig-html/.upload.tgz -C /var/www/podvig-html", (commandLine, err, stdout, stderr) ->
                        execOut "ssh -i .Tester.key Tester-1@memorial06.cloudapp.net rm -f /var/www/podvig-html/.upload.tgz", (commandLine, err, stdout, stderr) ->            
###



rebuild = ->
    generateJs()
    generateHtml()
    try generateCss()


generateHtml = (onDone)->
    execOut 'jade -P "inote/jade/" -o "inote/html/"', ->
        execOut 'jade -P -O "{ dbg: 1 }" "inote/jade/"  -o "inote/html_debug/"', ->
            execOut "cp inote/html/*.html py/html/", ->
                execOut "cp inote/html_debug/*.html py/html_debug/", onDone



generateCss = ->
    execOut 'lessc  inote/less/index.less  inote/css/index.css', ->
        execOut 'lessc  inote/less/inote.less  inote/css/inote.css' #, ->
            #execOut 'lessc  inote/less/login.less  inote/css/login.css'


generateJs = ->
    removeGeneratedJsFiles()
    generateJsFiles ->
        uglify_minify()




# make js 
generateJsFiles = (onDone)->
    execOut "coffee -m --output inote/js/ --compile inote/coffee/", onDone


# removes generatet js files
removeGeneratedJsFiles = ->
    for file in fs.readdirSync("inote/coffee") when /\.coffee$/.test file
        try
            fs.unlinkSync "inote/js/#{file.replace('.coffee','.js')}"
        catch err

        try
            fs.unlinkSync "inote/js/#{file.replace('.coffee','.map')}"
        catch err

    
# uglify minify js files
uglify_minify = ->
    write_file "inote/js/all.js", uglify.minify( js_files ).code


            
# Выполняет команду OS и печатает вывод и сообщения об ошибках
execOut = (commandLine, cb) ->
    console.log("> #{commandLine}")
    exec commandLine, (err, stdout, stderr) ->
        if stdout
            console.log(stdout)
        if stderr
            console.log(stderr)
        if(cb)
            cb(commandLine, err, stdout, stderr)
            


# calls func function in 200 msec.
# Windows fix. 
# Prevents multiple rebuilds 
# when file system generates several events on one file 
TT=0
postpone = (func)->
    clearTimeout TT
    TT = setTimeout func , 200


write_file = (file_name, text) ->
    console.log "write_file: #{file_name} - #{text.length} bytes. "
    fs.writeFile file_name, text, (err) ->
      if err
        console.log err
      else
        console.log "File saved:#{file_name} - #{text.length} bytes."
    return
    
