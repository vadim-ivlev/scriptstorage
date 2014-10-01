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
        notebook_owner=self.request.get('owner')
        notebook_access=self.request.get('access')
        notebook_name=self.request.get('name')
        element_id=self.request.get('element_id')
        version=self.request.get('version')
        content=""


        
        
        self.response.headers['Content-Type'] = utils.get_mime_type( element_id )
        
        #import pdb; pdb.set_trace()
        # return part of the page no matter of the page access
        if element_id:
            (content,version)=utils.get_notebook_element(notebook_owner, notebook_access, notebook_name, element_id, version)
        else:
            # return the whole page if it is allowed 
            if utils.access_allowed(self, notebook_access, notebook_owner):
                (content,version)=utils.get_notebook_content(notebook_owner, notebook_access, notebook_name, version)
                

        if not version:
            version = "0"
        self.response.headers['Content-Version'] = str(version)
        self.response.out.write(content)
        


app = webapp2.WSGIApplication(
    [
        ('/read.*', ReadHandler)
    ],  debug=True )

