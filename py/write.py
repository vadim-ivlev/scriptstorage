import webapp2
from google.appengine.api import users
import notebook as NB
import utils

class WriteHandler(webapp2.RequestHandler):
    """Writes to database"""
    def post(self):

        #get request params
        notebook_name=self.request.get('name')
        content=self.request.get('content')
        access=self.request.get('access')
        version=self.request.get('version')

        self.response.headers['Content-Type'] = 'text/plain'

        user = users.get_current_user()
        if not user:
            self.response.out.write("{'error':'Please login to save changes'}")
            return

        #get the user nick name
        nickname=""
        if user:
            nickname=user.nickname()


        # find the last version
        last_version=0
        (last_content, last_version)=utils.get_notebook_content(nickname, access, notebook_name, None)
        if not last_version:
             last_version= 0
        
        # if version is not specified in the  request     
        if version == '' or version is None:
            version =last_version+1


        
        version = int(version)
        
        key_name=nickname+"/"+access+"/"+notebook_name
       
        # if this is a new version save it in NoteBook
        if version >= last_version:
            #create a new NoteBook. key_name must go in constructor
            n=NB.NoteBook(key_name=key_name)
            n.notebook_name=notebook_name
            n.user_nickname=nickname
            n.access=access
            n.content=content
            n.version=version
            #save it
            #import pdb; pdb.set_trace()
            n.put()

        # No matter if it is a new or an old version save it in NoteBookVersion
        n=NB.NoteBookVersion(key_name=key_name+"/"+str(version))
        n.notebook_name=notebook_name
        n.user_nickname=nickname
        n.access=access
        n.content=content
        n.version=version
        #save it
        n.put()



        #output

        self.response.headers['Content-Version'] =str(version)

        self.response.out.write("{'key_name': '%s',\n" % key_name)
        self.response.out.write("'user_nickname': '%s',\n" % nickname)
        self.response.out.write("'notebook_name': '%s',\n" % notebook_name)
        self.response.out.write("'access': '%s',\n" % access)
        #self.response.out.write("'content': '%s',\n" % content)
        self.response.out.write("'version': '%s'}" % version)





app = webapp2.WSGIApplication(
    [
        ('/write.*', WriteHandler),
    ],  debug=True )

