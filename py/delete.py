import webapp2
from notebook import NoteBook

from google.appengine.ext import db
from google.appengine.api import users
import utils


class DeleteHandler(webapp2.RequestHandler):
    def get(self):

        self.response.headers['Content-Type'] = 'text/plain'

        key_name = self.request.get('key_name')
        if not key_name: return "{'error':'No key_name specified.'}"

        #key_name_parts = key_name.split("/")
        #if len(key_name_parts) < 2: return
        #owner_name_network = utils.extract_name_network(key_name_parts[0])
        #user_name_network = utils.get_user_name_network(self)

        owner_name_network = utils.parse_key(key_name)['user_name_network']
        user_name_network = utils.get_user_name_network(self)
        
        
        if owner_name_network == user_name_network :
            db.delete(db.Key.from_path("NoteBook", key_name))
            self.response.out.write( "{'result':'Ok'}")
        else:
            self.response.out.write("{ 'error':'The notebook can be deleted by its owner only.'}")




app = webapp2.WSGIApplication(
    [
        ('/delete.*', DeleteHandler),
    ], debug=True)

