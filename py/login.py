import webapp2
from google.appengine.api import users
import logging
import utils







class LoginPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            self.redirect(self.request.referer)
        else:
            self.redirect(users.create_login_url(self.request.referer))




class LogoutPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            self.redirect(users.create_logout_url(self.request.referer))
        else:
            self.redirect(self.request.referer)




class GetUserNamePage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        self.response.headers['Content-Type'] = 'text/plain'
        if user:
            self.response.out.write(user.nickname())





class GetLoginLink(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        s=utils.get_login_link()
        self.response.out.write(s)


class Test(webapp2.RequestHandler):
    def get(self):
        
        #import pdb; pdb.set_trace() 
        
        self.response.headers['Content-Type'] = 'text/plain'
        s='=======================\n'
        s+="[%s]\n" % utils.get_user_social_id(self)
        s+='=======================\n'
        self.response.out.write(s)

app = webapp2.WSGIApplication([
    ('/login', LoginPage),
    ('/logout', LogoutPage),
    ('/getusername', GetUserNamePage), 
    ('/getloginlink', GetLoginLink),
    ('/test', Test)
    ],
    debug=True)
