import webapp2
import json
import utils

class WriteHandler(webapp2.RequestHandler):
    """Writes to database"""
    def post(self):

        #get request params
        access = self.request.get('access')
        notebook_name = self.request.get('name')
        content = self.request.get('content')
        version = self.request.get('version')

        r = utils.save_notebook(access, notebook_name, content, version, self)

        self.response.headers['Content-Type'] = 'text/plain'
        self.response.headers['Content-Version'] = str(version)
        self.response.out.write(json.dumps(r, indent=2))





app = webapp2.WSGIApplication(
    [
        ('/write.*', WriteHandler),
    ],  debug=True )

