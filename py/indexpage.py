import webapp2
import jinja2
import os
import utils

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))



class IndexPage(webapp2.RequestHandler):
    def get(self):
        #import pdb; pdb.set_trace()
        debug=self.request.get('debug')
        template_values = {
            'user_social_name': utils.get_user_name(self),
            'user_network': utils.get_user_network(self),    
            'notebook_list': utils.get_list_of_notebooks(self),
            'login_link': utils.get_login_link()
            }
        # if there is debug param in url render the debug version
        folder = 'html_debug/' if debug else 'html/'
        template = jinja_environment.get_template( folder+'index.html' )
        self.response.out.write(template.render(template_values))



app = webapp2.WSGIApplication(
    [
        ('/', IndexPage),
        ('/indexpage', IndexPage)
    ],  debug=True )

