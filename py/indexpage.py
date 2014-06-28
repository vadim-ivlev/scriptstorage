import webapp2
import jinja2
import os
import utils

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))



class IndexPage(webapp2.RequestHandler):
    def get(self):
        #import pdb; pdb.set_trace()
        template_values = {
            'notebook_list': utils.get_list_of_notebooks(),
            'login_link': utils.get_login_link()
            }
        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render(template_values))



app = webapp2.WSGIApplication(
    [
        ('/', IndexPage),
        ('/indexpage', IndexPage)
    ],  debug=True )

