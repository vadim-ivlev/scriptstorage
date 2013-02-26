
import urllib
import webapp2
import jinja2
import os

from google.appengine.ext import db
from google.appengine.api import users
from notebook import NoteBook


jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class MainPage(webapp2.RequestHandler):
    def get_notebook_list(self):
        s=""
        #get the user nick name
        nickname=""
        if users.get_current_user():
            nickname=users.get_current_user().nickname()

        keys=db.Query(NoteBook, keys_only=True)
        for key in keys:
            key_name=key.name()
            if not key_name: continue

            name_parts=key_name.split("/")
            if len(name_parts)<3: continue

            notebook_owner=name_parts[0]
            access=name_parts[1]
            notebook_name=name_parts[2]
            if access=="private" and notebook_owner!=nickname: continue


            s=s+("<a href='/read?%s'>%s</a><br>" %  (
                urllib.urlencode (
                         {
                                 'owner_nickname':notebook_owner,
                                 'notebook_name':notebook_name
                         }) ,
                       key_name
                    )
                )

        return s

    def get(self):

        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'

        template_values = {
            'notebook_list': self.get_notebook_list(),
            'url': url,
            'url_linktext': url_linktext,
            }

        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render(template_values))






app = webapp2.WSGIApplication(
    [
        ('/main', MainPage)
    ],  debug=True )

