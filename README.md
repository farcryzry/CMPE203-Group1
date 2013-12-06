Tackaholic (a Pinterest-like web application)
==============
CMPE203 Project by Group1, based on <a href='https://github.com/pinry/pinry' target='_blank_'>Pinry</a><br>
Team members: <br>
<table>
<tbody><tr class="user" id="user_3892357">
<td style="vertical-align: top;">
<div class="avatar"><a href="/groups/92997/users/3892357" class="avatar img-circle" style="z-index: 2; position: relative;"><img alt="Pouya Jafarian" class="" src="https://secure.gravatar.com/avatar/493da37d6d171f30c52d3ab34065c381?s=50&amp;d=https%3A%2F%2Fsjsu.instructure.com%2Fimages%2Fmessages%2Favatar-50.png" style="width: 30px; min-height: 18px; max-height: 48px"></a></div>
</td>
<td>
<div><a href="/groups/92997/users/3892357" class="user_name">Pouya Jafarian</a></div>
<div style="clear: left;"></div>
</td>
</tr>
<tr class="user" id="user_3601854">
<td style="vertical-align: top;">
<div class="avatar"><a href="/groups/92997/users/3601854" class="avatar img-circle" style="z-index: 2; position: relative;"><img alt="Jing Ma" class="" src="https://sjsu.instructure.com/images/thumbnails/29135211/KtK43akRHngjpCBhHgUxRWI0txJpAszXdYyMzLqO" style="width: 30px; min-height: 18px; max-height: 48px"></a></div>
</td>
<td>
<div><a href="/groups/92997/users/3601854" class="user_name">Jing Ma</a></div>
<div style="clear: left;"></div>
</td>
</tr>
<tr class="user" id="user_3755314">
<td style="vertical-align: top;">
<div class="avatar"><a href="/groups/92997/users/3755314" class="avatar img-circle" style="z-index: 2; position: relative;"><img alt="Nishant Mehta" class="" src="https://sjsu.instructure.com/images/thumbnails/29609649/PH90JzSDSNhfrgSpVEnfFIT6FUB5NS5yOG7g1ezz" style="width: 30px; min-height: 18px; max-height: 48px"></a></div>
</td>
<td>
<div><a href="/groups/92997/users/3755314" class="user_name">Nishant Mehta</a></div>
<div style="clear: left;"></div>
</td>
</tr>
<tr class="user" id="user_3750946">
<td style="vertical-align: top;">
<div class="avatar"><a href="/groups/92997/users/3750946" class="avatar img-circle" style="z-index: 2; position: relative;"><img alt="Yang Song" class="" src="https://sjsu.instructure.com/images/thumbnails/29059551/BI4HjZK4PieWwznDakhqhWqI8f6z1lfazITVBV4D" style="width: 30px; min-height: 18px; max-height: 48px"></a></div>
</td>
<td>
<div><a href="/groups/92997/users/3750946" class="user_name">Yang Song</a></div>
<div style="clear: left;"></div>
</td>
</tr>
<tr class="user" id="user_3748810">
<td style="vertical-align: top;">
<div class="avatar"><a href="/groups/92997/users/3748810" class="avatar img-circle" style="z-index: 2; position: relative;"><img alt="Lan Xu" class="" src="https://sjsu.instructure.com/images/thumbnails/29051036/R0zKbnKkwdjGX24bIBRBg11AekzMFuBNPPzhQWkE" style="width: 30px; min-height: 18px; max-height: 48px"></a></div>
</td>
<td>
<div><a href="/groups/92997/users/3748810" class="user_name">Lan Xu</a></div>
<div style="clear: left;"></div>
</td>
</tr>
<tr class="user" id="user_3753513">
<td style="vertical-align: top;">
<div class="avatar"><a href="/groups/92997/users/3753513" class="avatar img-circle" style="z-index: 2; position: relative;"><img alt="Ruiyun Zhou" class="" src="https://sjsu.instructure.com/images/thumbnails/29080899/SGt1S0FBG5QHJ8jZwN2Kxy2VmyAg9BUg6JXL6hjA" style="width: 30px; min-height: 18px; max-height: 48px"></a></div>
</td>
<td>
<div><a href="/groups/92997/users/3753513" class="user_name">Ruiyun Zhou</a></div>
<div style="clear: left;"></div>
</td>
</tr>
<tr class="user" id="user_3750393">
<td style="vertical-align: top;">
<div class="avatar"><a href="/groups/92997/users/3750393" class="avatar img-circle" style="z-index: 2; position: relative;"><img alt="Junchen Zhu" class="" src="https://secure.gravatar.com/avatar/d23c8c9687f6cbe7d234dd59aacf1107?s=50&amp;d=https%3A%2F%2Fsjsu.instructure.com%2Fimages%2Fmessages%2Favatar-50.png" style="width: 30px; min-height: 18px; max-height: 48px"></a></div>
</td>
<td>
<div><a href="/groups/92997/users/3750393" class="user_name">Junchen Zhu</a></div>
<div style="clear: left;"></div>
</td>
</tr>
</tbody></table>

<a href='http://ec2-54-201-140-144.us-west-2.compute.amazonaws.com' target='_blank_'>Live Demo Here</a>


How to set up the enviroment of this web application?

1.  Install Python 2.7<br>
Python 2.* works better than 3.* for Pinry. <br>
Get Python at http://www.python.org.<br>
You can verify that Python is installed by typing python from your shell.

2.  Install Django<br>
Install an official release. https://docs.djangoproject.com/en/1.5/topics/install/#installing-official-release<br>
To verify that Django can be seen by Python, type python from your shell. Then at the Python prompt, try to import Django:<br>
\>\>\> import django<br>
\>\>\> print(django.get_version())<br>
1.5.5

3.  Download the source code and set it up.<br>
//Run in command line
$ python setup.py install

4.  Start web server and enjoy.<br>
//Run in command Line
$ python manage.py runserver

==============
How to show debug information in web pages like http requests and sql?

1. Install django debug toolbar(https://github.com/django-debug-toolbar/django-debug-toolbar) <br>
Follow the steps here http://django-debug-toolbar.readthedocs.org/en/latest/panels.html <br>


==============
How to start website on Amazon EC2? http://nickpolet.com/blog/1/<br>

1. Download key file from https://drive.google.com/file/d/0B1dcPcw9ZfXFYmQyTVd0VUpHTEk/edit?usp=sharing<br>
2. In Ubuntu Shell or Windows SSH client, run:<br>
   ssh -i [pem file directory]/203.pem ubuntu@ec2-54-201-140-144.us-west-2.compute.amazonaws.com<br>
3. After login, start web server by:<br>
   sudo python ~/srv/CMPE203-Group1/tackaholic/manage.py runserver 0.0.0.0:80
4. Then open your browser, enjoy: http://ec2-54-201-140-144.us-west-2.compute.amazonaws.com

