import webapp2
import json
import utils

class RenameHandler(webapp2.RequestHandler):
    """Renames the to book"""
    def post(self):

        key_name = self.request.get('key_name')
        access = self.request.get('access')
        notebook_name = self.request.get('name')
        content = self.request.get('content')
        version = self.request.get('version')

        r = utils.rename_notebook(key_name, access, notebook_name, content, version, self)

        self.response.headers['Content-Type'] = 'text/plain'
        self.response.headers['Content-Version'] = str(version)
        self.response.out.write(json.dumps(r, indent=2))





app = webapp2.WSGIApplication(
    [
        ('/rename.*', RenameHandler),
    ],  debug=True )

