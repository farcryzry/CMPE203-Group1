from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Permission
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils.functional import lazy
from django.views.generic import CreateView
from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.template import RequestContext

from .forms import UserCreationForm, ProfileForm
from pinry.users.models import User


reverse_lazy = lambda name=None, *args: lazy(reverse, str)(name, args=args)


class CreateUser(CreateView):
    template_name = 'users/register.html'
    model = User
    form_class = UserCreationForm
    success_url = reverse_lazy('core:recent-tacks')

    def get(self, request, *args, **kwargs):
        if not settings.ALLOW_NEW_REGISTRATIONS:
            messages.error(request, "The admin of this service is not allowing new registrations.")
            return HttpResponseRedirect(reverse('core:recent-tacks'))
        return super(CreateUser, self).get(request, *args, **kwargs)

    def form_valid(self, form):
        redirect = super(CreateUser, self).form_valid(form)
        permissions = Permission.objects.filter(codename__in=['add_tack', 'add_image'])
        user = authenticate(username=form.cleaned_data['username'],
                            password=form.cleaned_data['password'])
        user.user_permissions = permissions
        login(self.request, user)
        return redirect


@login_required
def logout_user(request):
    logout(request)
    messages.success(request, 'You have successfully logged out.')
    return HttpResponseRedirect(reverse('core:recent-tacks'))


def private(request):
    return TemplateResponse(request, 'users/private.html', None)

@login_required
def account_settings(request):
    if request.method == "POST":
        form = ProfileForm(request.POST, instance=request.user.profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'You have successfully saved your settings.')
            return HttpResponseRedirect('/settings')

    else:
        form = ProfileForm(instance=request.user.profile)

    args = {}
    args.update(csrf(request))
    args['form'] = form

    return render_to_response('users/settings.html', args, context_instance=RequestContext(request))