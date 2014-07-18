import webapp2
from notebook import NoteBook

from google.appengine.ext import db
from google.appengine.api import users
import utils


class DeleteHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'

        #get the user nick name
        nickname=utils.get_user_social_id(self)

        #if users.get_current_user():
        #    nickname=users.get_current_user().nickname()

        key_name=self.request.get('key_name')
        if not key_name: return

        key_name_parts=key_name.split("/")
        if len(key_name_parts)<2: return

        notebook_owner=key_name_parts[0]
        if notebook_owner!=nickname: return


        #delete notebook

        k=db.Key.from_path("NoteBook",key_name);
        db.delete(k);

        self.response.out.write("OK")

app = webapp2.WSGIApplication(
    [
        ('/delete.*', DeleteHandler),
    ],  debug=True )

