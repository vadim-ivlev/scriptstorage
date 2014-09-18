import webapp2
import utils

class PublicListHandler(webapp2.RequestHandler):
    """List database NoteBook public entries"""
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.out.write(utils.get_list_of_public_notebooks(self, 0,100))



app = webapp2.WSGIApplication(
    [
        ('/publiclist.*', PublicListHandler),
    ],  debug=True )

