import webapp2
import utils

class UserListHandler(webapp2.RequestHandler):
    """List database NoteBook user's entries"""
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.out.write(utils.get_list_of_user_notebooks(self, 0, 100))



app = webapp2.WSGIApplication(
    [
        ('/userlist.*', UserListHandler),
    ],  debug=True )

