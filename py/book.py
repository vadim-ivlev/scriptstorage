import webapp2
import jinja2
import os
import utils

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))



class Book(webapp2.RequestHandler):
    def get(self):
        #import pdb; pdb.set_trace()
        
        #get request params
        notebook_owner=self.request.get('notebook_owner')
        notebook_name=self.request.get('notebook_name')
        notebook_access=self.request.get('notebook_access')

        template_values = {
            'notebook_content': utils.get_notebook_content(notebook_owner,notebook_access, notebook_name),
            'login_link': utils.get_login_link(),
            'notebook_owner': notebook_owner,
            'notebook_name': notebook_name,
            'notebook_access': notebook_access    
            }
        template = jinja_environment.get_template('inote.html')
        text=template.render(template_values)
        self.response.out.write(text)




app = webapp2.WSGIApplication(
    [
        ('/book', Book)
    ],  debug=True )

