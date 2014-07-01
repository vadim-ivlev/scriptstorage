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
        notebook_owner=self.request.get('notebook_owner')
        notebook_access=self.request.get('notebook_access')
        notebook_name=self.request.get('notebook_name')
        element_id=self.request.get('element_id')

        
        self.response.headers['Content-Type'] = utils.get_mime_type( element_id )
        
        #import pdb; pdb.set_trace()

        if element_id:
            self.response.out.write(utils.get_notebook_element(notebook_owner, notebook_access, notebook_name, element_id))
        else:
            self.response.out.write(utils.get_notebook_content(notebook_owner, notebook_access, notebook_name))
        


app = webapp2.WSGIApplication(
    [
        ('/read.*', ReadHandler)
    ],  debug=True )

