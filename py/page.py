import webapp2
import jinja2
import os
import utils

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))



class Page(webapp2.RequestHandler):
    def get(self):
        #import pdb; pdb.set_trace()
        
        #get request params
        notebook_owner=self.request.get('owner')
        notebook_name=self.request.get('name')
        notebook_access=self.request.get('access')
        version=self.request.get('version')
        debug=self.request.get('debug')
        content=""
        
        # retrieve the page if it is allowed
        if utils.access_allowed(self,notebook_access, notebook_owner):
            (content, version)=utils.get_notebook_content(notebook_owner,notebook_access, notebook_name, version)

        if not version:
            version = "0"

        template_values = {
            'user_social_name': utils.get_user_name(self),
            'user_network': utils.get_user_network(self),    
            'user_id': utils.get_user_id(self),    
            'notebook_content': content,
            'notebook_version': str(version),
            'login_link': utils.get_login_link(),
            'notebook_owner': notebook_owner,
            'notebook_name': notebook_name,
            'notebook_access': notebook_access    
            }

        # if there is debug param in url render the debug version
        folder = 'html_debug/' if debug else 'html/'
        template = jinja_environment.get_template( folder+'inote.html' )
        text=template.render(template_values)
        
        self.response.headers['Content-Type'] = 'text/html'
        self.response.headers['Content-Version'] = str(version)
        self.response.out.write(text)




app = webapp2.WSGIApplication(
    [
        ('/page.*', Page)
    ],  debug=True )

