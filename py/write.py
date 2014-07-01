import webapp2
from google.appengine.api import users
from notebook import NoteBook


class WriteHandler(webapp2.RequestHandler):
    """Writes to database"""
    def post(self):

        #get request params
        notebook_name=self.request.get('notebook_name')
        content=self.request.get('content')
        access=self.request.get('access')

        self.response.headers['Content-Type'] = 'text/plain'

        user = users.get_current_user()
        if not user:
            self.response.out.write("Err:\nPlease login to save changes")
            return

        #get the user nick name
        nickname=""
        if user:
            nickname=user.nickname()

        key_name=nickname+"/"+access+"/"+notebook_name

        #create a new NoteBook. key_name must go in constructor
        n=NoteBook(key_name=key_name)
        n.notebook_name=notebook_name
        n.user_nickname=nickname
        n.access=access
        n.content=content

        #save it
        n.put()


        #output something
        self.response.out.write("Saved. \n")
        self.response.out.write("key_name: "+key_name+"\n")
        self.response.out.write("user_nickname: "+nickname+"\n")
        self.response.out.write("notebook_name: "+notebook_name+"\n")
        self.response.out.write("access: "+access+"\n")
        self.response.out.write("content: "+content)





app = webapp2.WSGIApplication(
    [
        ('/write.*', WriteHandler),
    ],  debug=True )

