from google.appengine.ext import db

class NoteBook(db.Model):
    """
    Entity for Notebook
    """
    user_nickname=db.StringProperty()
    user_name=db.StringProperty()
    user_network=db.StringProperty()
    user_id=db.StringProperty()
    user_name_network_id=db.StringProperty()
    notebook_name=db.StringProperty()
    access=db.StringProperty()
    content=db.TextProperty()
    version=db.IntegerProperty()
    date=db.DateTimeProperty(auto_now_add=True)
    user=db.UserProperty(auto_current_user_add=True)

class NoteBookVersion(NoteBook):
    """
    Holds NoteBook versions
    """
