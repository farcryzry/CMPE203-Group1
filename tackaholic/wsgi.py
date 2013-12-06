import os
import sys

sys.path.append('/home/ubuntu/srv/CMPE203-Group1/tackaholic')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pinry.settings.development")


from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
