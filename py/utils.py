import logging
import json
from notebook import NoteBook
from notebook import NoteBookVersion
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
        s="<a class='toolButton iicon-google-before' href='/logout'>Logout</a>"
    else:
        s="Login with <a  style='text-decoration:none' href='/login'><span class='icon-google'></span></a>"
    return s



def get_list_of_notebooks(o):
    """
    returns list of notebooks
    """

    user_name_network=get_user_name_network(o)

#        notebooks = db.GqlQuery("SELECT * FROM NoteBook")
#        notebooks= NoteBook.all()

#        for notebook in notebooks:
#            self.response.out.write('notebook_name: %s\n' % notebook.notebook_name)



    s=""
    keys=db.Query(NoteBook, keys_only=True)
    for key in keys:
        key_name= key.name()
        if not key_name: continue

        key_name_parts=key_name.split("/")
        if len(key_name_parts)<2: continue

        access=key_name_parts[1]
        owner_name_network=extract_name_network(key_name_parts[0])
        if access=="private" and owner_name_network != user_name_network: continue
        s += key_name+"\n"
    return s


def get_notebooks( o, of_signed_user, is_public, offset_n, limit_n):
    """
    returns list of notebooks,
    starting with offset_n record,
    returning max limit_n records

    :param o:  self of caller
    :param of_signed_user: if True returns notebooks of signed in  user
    :param is_public: if True public notebooks only
    :param offset_n: offset
    :param limit_n: number of notebooks to return
    """


    q=db.Query(NoteBook, projection=('user_name', 'user_network', 'access', 'notebook_name', 'version'))

    if of_signed_user :
        user_name_network_id = get_user_name_network_id(o)
        q.filter ( 'user_name_network_id ==', user_name_network_id )

    if is_public :
        q.filter('access !=', 'private')

    #q=db.GqlQuery("""
    #SELECT user_nickname, access, notebook_name, version
    #FROM NoteBook
    #WHERE access != 'private'
    #""")

    recs=[]
    for r in q.run( offset=offset_n, limit=limit_n ):
        k=r.key()
        kn=k.name()
        o={}
        o['user_name']=r.user_name
        o['user_network']=r.user_network
        o['access']=r.access
        o['notebook_name']=r.notebook_name
        o['version']=r.version
        o['key_name']=kn
        o['key']=str(k)
        recs.append(o)

    return json.dumps(recs, sort_keys=True, indent=2)



def get_list_of_public_notebooks( o, offset_n, limit_n):
    """
    returns list of public notebooks, 
    starting with offset_n record, 
    returning max limit_n records 
    """
    return get_notebooks ( o, False, True , offset_n, limit_n)



def get_list_of_user_notebooks( o, offset_n, limit_n):
    """
    returns list of public notebooks,
    starting with offset_n record,
    returning max limit_n records
    """
    return get_notebooks ( o, True, False , offset_n, limit_n)


def access_allowed(o, notebook_access,notebook_owner) :
    """
    check if the user can read the the page
    """
    # ALLOW access to every one
    return True

    if notebook_access == "public":          # if access is public
        return True

    notebook_owner_name_network=extract_name_network(notebook_owner)

    return (get_user_name_network(o) == notebook_owner_name_network)

def parse_key(key_name):
    """ For the key 'UserName|NetworkName/public/fileName'
    returns a dictionary of fields: user_name 
    """
    r = {'user_name':'a', 'user_network':'', 'user_name_network':'', 'notebook_name':'', 'access':'' }
    
    if not key_name: return r

    # split into 3 parts    
    a = key_name.split("/",2) 
    
    # if not a valid key_name
    if len(a) < 3:  return r

    r['user_name_network'] = a[0]
    r['access'] = a[1]
    r['notebook_name'] = a[2]

    nn=a[0].split('|',1)
    r['user_name']=nn[0]
    if len(nn)>1 : r['user_network'] = nn[1]
    return r



def extract_name_network(s):
    a = s.split('|',2)
    return  '|'.join(a[:2])



def delete_notebook(key_name,o):
    """
    Deletes the notebook by it's key name
    """
    r={}
    if not key_name :
        r['error']='No key_name specified.'
        return r

    owner_name_network = parse_key(key_name)['user_name_network']
    user_name_network = get_user_name_network(o)

    if owner_name_network == user_name_network :
        db.delete(db.Key.from_path("NoteBook", key_name))
        r['result'] = 'Ok'
    else:
        r['error'] = 'The notebook can be deleted by its owner only.'

    return r



def get_notebook(owner_nickname, notebook_access, notebook_name, notebook_version):
    """
    Returns the notebook.
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
        return None
    
    notebook = NoteBook.get( key )          # get the notebook.
    if notebook:                            # if notebook is found
        return  notebook                    # return it. 
    else:
        return NoteBookVersion.get( key )


def get_notebook_content(owner_nickname, notebook_access, notebook_name, notebook_version):
    """
    Returns content of the notebook.
    """

    b = get_notebook(owner_nickname, notebook_access, notebook_name, notebook_version)
    r = (b.content, b.version) if b else ("",0)
    return r




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

def save_notebook(access, notebook_name, content, version, o):
    #user_nickname=get_user_nickname(o)
    user_nickname=get_user_name_network(o)
    if not user_nickname:
        return {'error':'Please login to save changes'}
    user_name=get_user_name(o)
    user_network=get_user_network(o)
    user_id=get_user_id(o)
    user_name_network_id=get_user_name_network_id(o)


    # TODO: check if the notebook exists and the user is the same as owner???
    #b=get_notebook(user_nickname, access, notebook_name, None)
    #if b and b.user_id != user_id:
    #    o.response.out.write("{'error':'Sorry, Only owners can save changes.'}")
    #    return


    # find the last version
    last_version=0
    (last_content, last_version)=get_notebook_content(user_nickname, access, notebook_name, None)
    if not last_version:
        last_version= 0

    # if version is not specified in the request make it more than last_version by 1
    version = int(version) if version != '' else last_version + 1

    key_name=user_nickname+"/"+access+"/"+notebook_name

    # if this is a new version save it in NoteBook
    if version >= last_version:
        #create a new NoteBook. key_name must go in constructor
        n=NoteBook(key_name=key_name)
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
    n=NoteBookVersion(key_name=key_name+"/"+str(version))
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
    r = {}
    r['key_name']=key_name
    r['notebook_name']=notebook_name
    r['user_nickname']=user_nickname
    r['user_name']=user_name
    r['user_network']=user_network
    r['user_id']=user_id
    r['user_name_network_id']=user_name_network_id
    r['access']=access
    #r['content']=content
    r['version']=version

    return r


def rename_notebook(key_name, access, notebook_name, content, version, o):
    r = save_notebook(access, notebook_name, content, version, o)
    user_name_network = get_user_name_network(o)

    # if the new key_name is different from the old one
    # delete the old notebook
    if r['key_name'] != key_name :
        delete_notebook(key_name,o)
    return r


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


def get_user_name_network(o):
    name= get_user_name(o)
    if not name: return ''
    netw= get_user_network(o)
    if not netw: return ''
    return name+"|"+netw


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

