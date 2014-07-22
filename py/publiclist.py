import webapp2
from notebook import NoteBook

from google.appengine.ext import db
from google.appengine.api import users
import utils

class PublicListHandler(webapp2.RequestHandler):
    """List database NoteBook entries"""
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.out.write(utils.get_list_of_public_notebooks(0,100))



app = webapp2.WSGIApplication(
    [
        ('/publiclist.*', PublicListHandler),
    ],  debug=True )

