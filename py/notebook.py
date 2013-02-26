from google.appengine.ext import db

class NoteBook(db.Model):
    """
    Entity for Notebook
    """
    user_nickname=db.StringProperty()
    notebook_name=db.StringProperty()
    public=db.StringProperty()
    content=db.TextProperty()

    date=db.DateTimeProperty(auto_now_add=True)
    user=db.UserProperty(auto_current_user_add=True)
