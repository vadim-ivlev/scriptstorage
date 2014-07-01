import webapp2
from google.appengine.ext import db
from google.appengine.api import users
import utils

class ReadHandler(webapp2.RequestHandler):
    """
    Read content of the notebook
    """
    def get(self):
        #get request params
        owner_nickname=self.request.get('owner_nickname')
        notebook_name=self.request.get('notebook_name')
        notebook_access=self.request.get('notebook_access')

        self.response.headers['Content-Type'] = 'text/plain'
        self.response.out.write(utils.get_notebook_content(owner_nickname, notebook_access, notebook_name))
        


app = webapp2.WSGIApplication(
    [
        ('/read.*', ReadHandler)
    ],  debug=True )

