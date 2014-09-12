import logging
import json
from notebook import NoteBook
from google.appengine.ext import db
from google.appengine.api import users
import xml.etree.ElementTree as ET
from urllib2 import unquote

def print_object(c):
    s=""
    for p in dir(c):
        if p.startswith('__'): continue
        val=getattr(c,p)
        if callable(val):
            s+="%s()->%s\n" % (p,val())
        else:
            s+="%s=%s\n" % (p,val)
    return s



def get_login_link():
    """
    returns html links to login/logout page
    """

    if users.get_current_user():
        #s="<span id='userName'>%s</span> <a class='toolButton00' href='/logout'>Logout</a>"  %  users.get_current_user().nickname()
        s="<a class='toolButton icon-google-before' href='/logout'>Logout</a>"
    else:
        s="Login with <a  style='text-decoration:none' href='/login'><span class='icon-google'></span></a>"
    return s



def get_list_of_notebooks(o):
    """
    returns list of notebooks
    """

    #get the user nick name
    #nickname=u''
    #if users.get_current_user():
    #    nickname=users.get_current_user().nickname()
    
    nickname=get_user_social_name(o)

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


def get_list_of_public_notebooks(offset_n, limit_n):
    """
    returns list of public notebooks, 
    starting with offset_n record, 
    returning max limit_n records 
    """
    u=users.get_current_user()
    s=print_object(u)
    logging.info(s)
    q=db.Query(NoteBook, projection=('user_nickname', 'access', 'notebook_name', 'version'))
    q.filter('access !=', 'private')

    #q=db.GqlQuery("""
    #SELECT user_nickname, access, notebook_name, version
    #FROM NoteBook
    #WHERE access != 'private'
    #""")
    
    recs=[]
    for r in q.run( offset=offset_n, limit=limit_n ):
        o={}
        o['key']=str(r.key())
        o['key_name']=r.key().name()
        o['user_nickname']=r.user_nickname
        o['notebook_name']=r.notebook_name
        o['access']=r.access
        o['version']=r.version
        recs.append(o)
        
    return json.dumps(recs, sort_keys=True, indent=2)





def access_allowed(o, notebook_access,notebook_owner) :
    """
    check if the user can read the the page
    """
    if notebook_access == "public":          # if access is public
        return True
    # access is private 
    
    #if users.get_current_user():                 # check if the user is logined.    
    #    return users.get_current_user().nickname() == notebook_owner   # make sure the user is the owner.
    #else:
    #    return False # the user is not loginned

    return (get_user_social_name_network_id(o) == notebook_owner)






def get_notebook_content(owner_nickname, notebook_access, notebook_name, notebook_version):
    """
    Returns content of the notebook.
    """
    content = "" #content of the book

    # calculate the key to retrieve content from db
    #import pdb; pdb.set_trace()
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



def unq(s):
    return unquote(s) #.decode('utf-8')


def get_user_name(o):
    return get_user(o)['name']


def get_user_network(o):
    return get_user(o)['network']


def get_user_id(o):
    return get_user(o)['id']


def get_user_name_network_id(o):
    return get_user(o)['name_network_id']


def get_user_nickname(o):
    return get_user(o)['name_network_id']





def get_user_social_name(o):
    return get_user(o)['name']



def get_user_social_name_network_id(o):
    return get_user(o)['name_network_id']



def get_user(o):
    r=  {
        #'name':None,
        #'network':None,
        #'id':None,
        #'name_network_id':None
        }
    u=users.get_current_user()
    if u:
        r['name']='' if u.nickname() is None else u.nickname()
        r['network']="gmail"
        r['id']='' if u.user_id() is None else u.user_id()
        r['name_network_id']= "%s|%s|%s" % (r['name'],r['network'],r['id']) if r['name'] else None
        return  r
     
    _c = o.request.cookies
    
    if _c == None:
        return r
    
    r['name']= '' if _c.get("name") is None else unq(_c.get("name"))
    r['network']= '' if _c.get("network") is None else unq(_c.get("network"))
    r['id']= '' if _c.get("id") is None else unq(_c.get("id"))
    #import pdb; pdb.set_trace()
    r['name_network_id']= "%s|%s|%s" % (r['name'],r['network'],r['id']) if r['name'] else None
    return  r

