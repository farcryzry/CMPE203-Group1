import requests
from cStringIO import StringIO

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models, transaction

from django_images.models import Image as BaseImage, Thumbnail
from taggit.managers import TaggableManager

from ..users.models import User


class ImageManager(models.Manager):
    # FIXME: Move this into an asynchronous task
    def create_for_url(self, url):
        file_name = url.split("/")[-1]
        buf = StringIO()
        response = requests.get(url)
        buf.write(response.content)
        obj = InMemoryUploadedFile(buf, 'image', file_name,
                                   None, buf.tell(), None)
        # create the image and its thumbnails in one transaction, removing
        # a chance of getting Database into a inconsistent state when we
        # try to create thumbnails one by one later
        image = self.create(image=obj)
        for size in settings.IMAGE_SIZES.keys():
            Thumbnail.objects.get_or_create_at_size(image.pk, size)
        return image


class Image(BaseImage):
    objects = ImageManager()

    class Meta:
        proxy = True

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

class Board(models.Model):
    owner = models.ForeignKey(User)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100)
    cover = models.ForeignKey('Tack', blank=True, null=True, related_name='cover')
    is_public = models.BooleanField(default=True)

    def __unicode__(self):
        return self.name

class Tack(models.Model):
    submitter = models.ForeignKey(User)
    url = models.URLField(null=True)
    origin = models.URLField(null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ForeignKey(Image, related_name='tack')
    published = models.DateTimeField(auto_now_add=True)
    tags = TaggableManager()
    board = models.ForeignKey(Board)

    def __unicode__(self):
        return self.url

class Following(models.Model):
    user = models.ForeignKey(User)
    board = models.ForeignKey(Board)


