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


        user_nickname=utils.get_user_nickname(self)
        if not user_nickname:
            self.response.out.write("{'error':'Please login to save changes'}")
            return
        user_name=utils.get_user_name(self)
        user_network=utils.get_user_network(self)
        user_id=utils.get_user_id(self)
        user_name_network_id=utils.get_user_name_network_id(self)



        # find the last version
        last_version=0
        (last_content, last_version)=utils.get_notebook_content(user_nickname, access, notebook_name, None)
        if not last_version:
             last_version= 0
        
        # if version is not specified in the  request     
        if version == '' or version is None:
            version =last_version+1


        
        version = int(version)
        
        key_name=user_nickname+"/"+access+"/"+notebook_name
       
        # if this is a new version save it in NoteBook
        if version >= last_version:
            #create a new NoteBook. key_name must go in constructor
            n=NB.NoteBook(key_name=key_name)
            n.notebook_name=notebook_name
            n.user_nickname=user_nickname
            n.user_name=user_name
            n.user_network=user_network
            n.user_id=user_id
            n.user_name_network_id=user_name_network_id
            n.access=access
            n.content=content
            n.version=version
            #save it
            #import pdb; pdb.set_trace()
            n.put()

        # No matter if it is a new or an old version save it in NoteBookVersion
        n=NB.NoteBookVersion(key_name=key_name+"/"+str(version))
        n.notebook_name=notebook_name
        n.user_nickname=user_nickname
        n.user_name=user_name
        n.user_network=user_network
        n.user_id=user_id
        n.user_name_network_id=user_name_network_id
        n.access=access
        n.content=content
        n.version=version
        #save it
        n.put()



        #output

        self.response.headers['Content-Version'] =str(version)

        self.response.out.write("{'key_name': '%s',\n" % key_name)
        self.response.out.write("'notebook_name': '%s',\n" % notebook_name)
        self.response.out.write("'user_name': '%s',\n" % user_name)
        self.response.out.write("'user_network': '%s',\n" % user_network)
        self.response.out.write("'user_id': '%s',\n" % user_id)
        self.response.out.write("'user_name_network_id': '%s',\n" % user_name_network_id)
        self.response.out.write("'user_nickname': '%s',\n" % user_nickname)
        self.response.out.write("'access': '%s',\n" % access)
        #self.response.out.write("'content': '%s',\n" % content)
        self.response.out.write("'version': '%s'}" % version)





app = webapp2.WSGIApplication(
    [
        ('/write.*', WriteHandler),
    ],  debug=True )

