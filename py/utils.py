from notebook import NoteBook
from google.appengine.ext import db
from google.appengine.api import users

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
    
    

def get_notebook_content(owner_nickname, notebook_name):
    """
    Returns content of the notebook.
    owner_nickname usually is creater email.
    notebook_name - notebook name.
    """

    #get the user nick name
    nickname=u''
    if users.get_current_user():
        nickname=users.get_current_user().nickname()

    # calculate possible keys to retrieve content from db
    public_key = db.Key.from_path("NoteBook", owner_nickname+"/public/"+notebook_name)
    private_key = db.Key.from_path("NoteBook", owner_nickname+"/private/"+notebook_name)

    #try to find public notebook
    notebook=NoteBook.get(public_key)
    
    # if notebook is found return its content
    if notebook:
        return notebook.content

    # otherwise if request comes from the creator
    elif nickname==owner_nickname:
        # try to find a private notebook
        notebook=NoteBook.get(private_key)
        # if a notebook is found then return its content
        if notebook:
            return notebook.content

    return ""

