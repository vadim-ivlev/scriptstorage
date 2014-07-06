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
    


def access_allowed(notebook_access,notebook_owner) :
    """
    check if the user can read the the page
    """
    if notebook_access == "public":          # if access is public
        return True
    # access is private 
    if users.get_current_user():                 # check if the user is logined.    
        return users.get_current_user().nickname() == notebook_owner   # make sure the user is the owner.
    else:
        return False # the user is not loginned




def get_notebook_content(owner_nickname, notebook_access, notebook_name, notebook_version):
    """
    Returns content of the notebook.
    """
    content = "" #content of the book

    # calculate the key to retrieve content from db
    key_name=owner_nickname+"/"+notebook_access+"/"+notebook_name
    
    #import pdb; pdb.set_trace()
    # if version is not specified return the latest one from NoteBook
    if notebook_version == "" or notebook_version is None:
        key = db.Key.from_path("NoteBook", key_name)
    else: # return the required version from NoteBookVersion
        # Add version to the key to retrieve a saved version
        key = db.Key.from_path("NoteBookVersion", key_name+"/"+str(notebook_version) )


    if not key:
        return (content, 0)
    
    notebook = NoteBook.get( key )          # get the notebook.
    if notebook:                            # if notebook is found
        return  (notebook.content, notebook.version)    # return its content. 

    return (content, 0)




def get_notebook_element(owner_nickname, notebook_access, notebook_name, element_id, notebook_version):
    """
    Returns part of the notebook by id.
    """
    #import pdb; pdb.set_trace()
    
    (content,version) = get_notebook_content( owner_nickname, notebook_access, notebook_name, notebook_version)
    
    # Extract the element
    root = ET.fromstring(content)
    e = root.find(".//*[@id='%s']" % element_id)
    s = ET.tostring(e, encoding="UTF-8", method="text") 
    
    return (s, version)




def get_mime_type(element_id):
    """
    calculates mime type by element_id.
    to return pege elements.
    """
    if not element_id: 
        return "text/html"
    
    head = element_id[:2] 
    if head == "ou": # output cell
        return "text/html"
    if head == "in": #input cell
        return "text/plain"
    if head == "js": # compiled javascript
        return "application/javascript"
    if head == "ce": # the whole cell 
        return "text/html"

    return "text/plain"



