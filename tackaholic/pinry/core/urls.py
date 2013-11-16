from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from tastypie.api import Api

from .api import ImageResource, ThumbnailResource, TackResource, UserResource, BoardResource
from .feeds import LatestTacks, LatestUserTacks, LatestTagTacks
from .views import CreateImage, CreateBoard


v1_api = Api(api_name='v1')
v1_api.register(ImageResource())
v1_api.register(ThumbnailResource())
v1_api.register(TackResource())
v1_api.register(UserResource())
v1_api.register(BoardResource())


urlpatterns = patterns('',
    url(r'^api/', include(v1_api.urls, namespace='api')),

    url(r'feeds/latest-tacks/tag/(?P<tag>(\w|-)+)/', LatestTagTacks()),
    url(r'feeds/latest-tacks/user/(?P<user>(\w|-)+)/', LatestUserTacks()),
    url(r'feeds/latest-tacks/', LatestTacks()),

    url(r'^tacks/tack-form/$', TemplateView.as_view(template_name='core/tack_form.html'),
        name='tack-form'),
    url(r'^tacks/create-image/$', CreateImage.as_view(), name='create-image'),

    url(r'^tacks/tag/(?P<tag>(\w|-)+)/$', TemplateView.as_view(template_name='core/tacks.html'),
        name='tag-tacks'),
    url(r'^tacks/user/(?P<user>(\w|-)+)/$', TemplateView.as_view(template_name='core/tacks.html'),
        name='user-tacks'),
    url(r'^tacks/board/(?P<board>(\w|-)+)/$', TemplateView.as_view(template_name='core/tacks.html'),
        name='board-tacks'),
    url(r'^(?P<tack>\d+)/$', TemplateView.as_view(template_name='core/tacks.html'),
        name='recent-tacks'),
    url(r'^$', TemplateView.as_view(template_name='core/tacks.html'),
        name='recent-tacks'),
    url(r'^board/$', TemplateView.as_view(template_name='core/boards.html'), name='board'),
    url(r'^board/create-board/$', CreateBoard.as_view(), name='create-board'),

)
