import cgi
import webapp2

from google.appengine.api import urlfetch
#from google.appengine.api import memcache
#SovDef/examples/full/datasource/demo.php?q=usa&90315
#http://www.publicsectorcredit.org/SovDef/examples/full/datasource/demo.php?q=AFG&10833


class ListHandler(webapp2.RequestHandler):
    """List notebook names"""
    def get(self):

#        path=self.request.path_qs.replace("/proxy/","")
#        resp=urlfetch.fetch("http://www.publicsectorcredit.org/"+path)


#        a=self.request.path_qs.split("/")
#        url=a[2]+"://"+a[3]+"/"
#        the_rest=a[4:]
#        the_rest_str="/".join(the_rest)
#        full_url=url+the_rest_str
#        resp=urlfetch.fetch(full_url)




        path=self.request.path_qs.replace("/proxy/","")
        resp=urlfetch.fetch(path)



        self.response.headers=resp.headers.data
#        self.response.headers['Content-Type'] = 'text/xml'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(resp.content)




app = webapp2.WSGIApplication(
    [
        ('/proxy/.*', ListHandler)
    ],  debug=True )

