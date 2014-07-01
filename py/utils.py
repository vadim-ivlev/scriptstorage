from notebook import NoteBook
from google.appengine.ext import db
from google.appengine.api import users
import xml.etree.ElementTree as ET

def get_login_link():
    """
    returns html links to login/logout page
    """

    if users.get_current_user():
        s="<span id='userName'>%s</span> <a class='toolButton00' href='/logout'>Logout</a>"  %  users.get_current_user().nickname()
    else:
        s="<a class='toolButton00' href='/login'>Login</a>"
    return s



def get_list_of_notebooks():
    """
    returns list of notebooks
    """

    #get the user nick name
    nickname=u''
    if users.get_current_user():
        nickname=users.get_current_user().nickname()

#        notebooks = db.GqlQuery("SELECT * FROM NoteBook")
#        notebooks= NoteBook.all()

#        for notebook in notebooks:
#            self.response.out.write('notebook_name: %s\n' % notebook.notebook_name)



    s=""
    keys=db.Query(NoteBook, keys_only=True)
    for key in keys:
        key_name=key.name()
        if not key_name: continue

        key_name_parts=key_name.split("/")
        if len(key_name_parts)<2: continue

        access=key_name_parts[1]
        notebook_owner=key_name_parts[0]
        if access=="private" and notebook_owner!=nickname: continue
        s=s+key_name+"\n"
        
        #self.response.out.write("%s\n" % key_name)
    return s
    




def get_notebook_content(owner_nickname, notebook_access, notebook_name):
    """
    Returns content of the notebook.
    """
    content = "" #content of the book

    # calculate the key to retrieve content from db
    key = db.Key.from_path("NoteBook", owner_nickname+"/"+notebook_access+"/"+notebook_name)

    if not key:
        return content
    
    if notebook_access == "public":          # if access is public
        notebook = NoteBook.get( key )          # get the notebook.
        if notebook:                            # if notebook is found
            return  notebook.content               # return its content. 
    else:                                        # else (access is private) 
        if users.get_current_user():                 # check if the user is logined.    
            nickname = users.get_current_user().nickname() # get the user nick name.
            if nickname == owner_nickname:                 # make sure the user is the owner.
                notebook = NoteBook.get( key )             # get the notebook.
                if notebook:                               # if a notebook is found 
                    return notebook.content                    # return its content.

    return content





def get_notebook_element(owner_nickname, notebook_access, notebook_name, element_id):
    """
    Returns part of the notebook by id.
    """
    #import pdb; pdb.set_trace()
    
    content = get_notebook_content( owner_nickname, notebook_access, notebook_name)
    root = ET.fromstring(content)
    e = root.find(".//*[@id='%s']" % element_id)
    s = ET.tostring(e, encoding="UTF-8", method="text") 
    return s
