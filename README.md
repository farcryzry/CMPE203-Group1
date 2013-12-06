Tackaholic (a Pinterest-like web application)
==============
CMPE203 Project by Group1, based on <a href='https://github.com/pinry/pinry' target='_blank_'>Pinry</a><br>
Team members: <br>

<table><tbody>
<tr>
<td>
<div><img alt="Pouya Jafarian" src="https://secure.gravatar.com/avatar/493da37d6d171f30c52d3ab34065c381?s=50&amp;d=https%3A%2F%2Fsjsu.instructure.com%2Fimages%2Fmessages%2Favatar-50.png" style="max-width:100%;"></div>
</td>
<td>
<div>Pouya Jafarian</div>

</td>
</tr>
<tr>
<td>
<div><img alt="Jing Ma" src="https://sjsu.instructure.com/images/thumbnails/29135211/KtK43akRHngjpCBhHgUxRWI0txJpAszXdYyMzLqO" style="max-width:100%;"></div>
</td>
<td>
<div>Jing Ma</div>
<div></div>
</td>
</tr>
<tr>
<td>
<div><img alt="Nishant Mehta" src="https://sjsu.instructure.com/images/thumbnails/29609649/PH90JzSDSNhfrgSpVEnfFIT6FUB5NS5yOG7g1ezz" style="max-width:100%;"></div>
</td>
<td>
<div>Nishant Mehta</div>
<div></div>
</td>
</tr>
<tr>
<td>
<div><img alt="Yang Song" src="https://sjsu.instructure.com/images/thumbnails/29059551/BI4HjZK4PieWwznDakhqhWqI8f6z1lfazITVBV4D" style="max-width:100%;"></div>
</td>
<td>
<div>Yang Song</div>
<div></div>
</td>
</tr>
<tr>
<td>
<div><img alt="Lan Xu" src="https://sjsu.instructure.com/images/thumbnails/29051036/R0zKbnKkwdjGX24bIBRBg11AekzMFuBNPPzhQWkE" style="max-width:100%;"></div>
</td>
<td>
<div>Lan Xu</div>
<div></div>
</td>
</tr>
<tr>
<td>
<div><img alt="Ruiyun Zhou" src="https://sjsu.instructure.com/images/thumbnails/29080899/SGt1S0FBG5QHJ8jZwN2Kxy2VmyAg9BUg6JXL6hjA" style="max-width:100%;"></div>
</td>
<td>
<div>Ruiyun Zhou</div>
<div></div>
</td>
</tr>
<tr>
<td>
<div><img alt="Junchen Zhu" src="https://secure.gravatar.com/avatar/d23c8c9687f6cbe7d234dd59aacf1107?s=50&amp;d=https%3A%2F%2Fsjsu.instructure.com%2Fimages%2Fmessages%2Favatar-50.png" style="max-width:100%;"></div>
</td>
<td>
<div>Junchen Zhu</div>
<div></div>
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

