import hashlib

from django.contrib.auth.models import User as BaseUser
from django_images.models import Image
from django.db.models.signals import post_save
from django.db import models


class User(BaseUser):

    @property
    def gravatar(self):
        return hashlib.md5(self.email).hexdigest()

    class Meta:
        proxy = True

class Profile(models.Model):
    user = models.OneToOneField(User)

    location = models.CharField(max_length=100, blank=True)
    #photo = models.ForeignKey(Image, related_name='profile')
    email_alternative = models.EmailField(blank=True)

User.profile = property(lambda u: Profile.objects.get_or_create(user=u)[0])
