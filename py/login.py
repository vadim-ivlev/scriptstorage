import webapp2

from google.appengine.api import users
import logging








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

    def get_login_link(self):
#        if users.get_current_user():
#            url = "/logout" #users.create_logout_url(self.request.uri)
#            url_linktext = 'Logout'
#            user_info=("Hello <span id='userName'>%s</span>" %  users.get_current_user().nickname())
#        else:
#            url = "/login" #users.create_login_url(self.request.uri)
#            url_linktext = 'Login'
#            user_info=""
#
#        template_values = {
#            'url': url,
#            'url_linktext': url_linktext,
#            'user_info': user_info
#            }
#        s=("%(user_info)s <a class='toolButton' href='%(url)s'>%(url_linktext)s</a>" % template_values )

        if users.get_current_user():
            s="<span id='userName'>%s</span> <a class='toolButton00' href='/logout'>Logout</a>"  %  users.get_current_user().nickname()
        else:
            s="<a class='toolButton00' href='/login'>Login</a>"

        return s


    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        s=self.get_login_link()
        self.response.out.write(s)


app = webapp2.WSGIApplication([('/login', LoginPage),('/logout', LogoutPage),('/getusername', GetUserNamePage), ('/getloginlink', GetLoginLink)],
    debug=True)
