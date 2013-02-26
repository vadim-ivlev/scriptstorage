import webapp2
from notebook import NoteBook

from google.appengine.ext import db
from google.appengine.api import users


class ListHandler(webapp2.RequestHandler):
    """List database NoteBook entries"""
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'


        #get the user nick name
        nickname=u''
        if users.get_current_user():
            nickname=users.get_current_user().nickname()

#        notebooks = db.GqlQuery("SELECT * FROM NoteBook")
#        notebooks= NoteBook.all()

#        for notebook in notebooks:
#            self.response.out.write('notebook_name: %s\n' % notebook.notebook_name)




        keys=db.Query(NoteBook, keys_only=True)
        for key in keys:
            key_name=key.name()
            if not key_name: continue

            key_name_parts=key_name.split("/")
            if len(key_name_parts)<2: continue

            access=key_name_parts[1]
            notebook_owner=key_name_parts[0]
            if access=="private" and notebook_owner!=nickname: continue

            self.response.out.write("%s\n" % key_name)


app = webapp2.WSGIApplication(
    [
        ('/list.*', ListHandler),
    ],  debug=True )

