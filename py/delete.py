import webapp2
import json
import utils


class DeleteHandler(webapp2.RequestHandler):
    def get(self):

        key_name = self.request.get('key_name')
        r = utils.delete_notebook(key_name, self)

        self.response.headers['Content-Type'] = 'text/plain'
        self.response.out.write(json.dumps(r, indent=2))



app = webapp2.WSGIApplication(
    [
        ('/delete.*', DeleteHandler),
    ], debug=True)

