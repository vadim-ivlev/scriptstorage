###*

 `cake` - list tasks 
 `cake <taskName>` -run taskName

###


fs = require "fs"
{exec, spawn} = require 'child_process'


task "server", "type: dev_appserver.py `pwd`", ->


task "rebuild", "rebuild all", ->
    rebuild()


task "watch", "Watch for changes and regenerate js, css и html.", ->
    fs.watch 'inote/coffee',  (event, filename) -> postpone  -> generateJs()
    fs.watch 'inote/jade',  (event, filename) -> postpone  -> generateHtml()
    fs.watch 'inote/less',  (event, filename) -> postpone  -> generateCss()


task "deploy", "type: appcfg.py update `pwd`", ->
    execOut "appcfg.py update `pwd`"

task "push", "push changes to Git", ->
    execOut "git add -A .", ->
        execOut 'git commit -am "a"', ->
            execOut 'git push'


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
    generateCss()


generateHtml = (onDone)->
    execOut "jade -P inote/jade/ -o 'inote/'", ->
        execOut "cp inote/*.html py/", onDone



generateCss = ->
    execOut 'lessc  inote/less/index.less  inote/css/index.css', ->
        execOut 'lessc  inote/less/inote.less  inote/css/inote.css'


generateJs = ->
    removeGeneratedJsFiles()
    generateJsFiles()




# Сделает по одному js файлу на каждый коффе
generateJsFiles = (onDone)->
    execOut "coffee -m --output inote/js/ --compile inote/coffee/", onDone


# Удаляет js файлы генерированные из coffee
removeGeneratedJsFiles = ->
    for file in fs.readdirSync("inote/coffee") when /\.coffee$/.test file
        try
            fs.unlinkSync "inote/js/#{file.replace('.coffee','.js')}"
        catch err

        try
            fs.unlinkSync "inote/js/#{file.replace('.coffee','.map')}"
        catch err




            
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

###
var fs = require('fs');
var uglify = require("uglify-js");

var uglified = uglify.minify(['file1.js', 'file2.js', 'file3.js']);

fs.writeFile('concat.min.js', uglified.code, function (err){
      if(err) {
              console.log(err);
                } else {
                        console.log("Script generated and saved:", 'concat.min.js');
                          }      
});
###
