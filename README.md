Tackaholic (a Pinterest-like web application)
==============
CMPE203 Project by Group1, based on <a href='https://github.com/pinry/pinry' target='_blank_'>Pinry</a><br>

<h3><a href='http://54.69.30.34/' target='_blank_'>Live Demo Here</a></h3>

Team members: <br>

<table><tbody>
   <tr>
      <td>Pouya Jafarian</td>
      <td>Jing Ma</td>
      <td>Nishant Mehta</td>
      <td>Yang Song</td>
      <td>Lan Xu</td>
      <td>Ruiyun Zhou</td>
      <td>Junchen Zhu</td>
   </tr>
</tbody></table><br/>


<h3>How to set up the enviroment of this web application?</h3>

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
<h3>How to show debug information in web pages like http requests and sql?</h3>

1. Install django debug toolbar(https://github.com/django-debug-toolbar/django-debug-toolbar) <br>
Follow the steps here http://django-debug-toolbar.readthedocs.org/en/latest/panels.html <br>


==============
<h3>How to start website on Amazon EC2? (http://nickpolet.com/blog/1/)</h3>

1. Download key file from https://drive.google.com/file/d/0B1dcPcw9ZfXFYmQyTVd0VUpHTEk/edit?usp=sharing<br>
2. In Ubuntu Shell or Windows SSH client, run:<br>
   ssh -i [pem file directory]/203.pem ubuntu@ec2-54-201-140-144.us-west-2.compute.amazonaws.com<br>
3. After login, start web server by:<br>
   sudo python ~/srv/CMPE203-Group1/tackaholic/manage.py runserver 0.0.0.0:80
4. Then open your browser, enjoy: http://ec2-54-201-140-144.us-west-2.compute.amazonaws.com

