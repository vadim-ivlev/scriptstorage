import webapp2
from google.appengine.ext import db
from google.appengine.api import users
from notebook import NoteBook


class ReadHandler(webapp2.RequestHandler):
    """
    Read content of the notebook
    """
    def get(self):
        #get request params
        owner_nickname=self.request.get('owner_nickname')
        notebook_name=self.request.get('notebook_name')

        #get the user nick name
        nickname=u''
        if users.get_current_user():
            nickname=users.get_current_user().nickname()


        public_key = db.Key.from_path("NoteBook", owner_nickname+"/public/"+notebook_name)
        private_key = db.Key.from_path("NoteBook", owner_nickname+"/private/"+notebook_name)

        self.response.headers['Content-Type'] = 'text/plain'

        #try to find public notebook
        notebook=NoteBook.get(public_key)

        if notebook:
            self.response.out.write(notebook.content)
        elif nickname==owner_nickname:
            #then try to find a private notebook
            notebook=NoteBook.get(private_key)
            if notebook:
                self.response.out.write(notebook.content)
            else:
#                self.response.out.write("%s does not exist." % notebook_name)
                self.response.out.write("")













app = webapp2.WSGIApplication(
    [
        ('/read.*', ReadHandler)
    ],  debug=True )

