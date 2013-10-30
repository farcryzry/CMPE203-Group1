CMPE203-Group1
==============

How to set up the enviroment of this web application?

1. Install Python 2.7
Python 2.* works better than 3.* for Pinry. Get Python at http://www.python.org.
You can verify that Python is installed by typing python from your shell; you should see something like:
Python 2.6.6 (r266:84292, Dec 26 2010, 22:31:48)
[GCC 4.4.5] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>>

2. Install Django
Install an official release. https://docs.djangoproject.com/en/1.5/topics/install/#installing-official-release
To verify that Django can be seen by Python, type python from your shell. Then at the Python prompt, try to import Django:
>>> import django
>>> print(django.get_version())
1.5.5
You may have another version of Django installed.
That’s it!

3. Download the source code and set it up.
python setup.py install

4. Start web server and enjoy.
python manage.py runserver.
