Settings
------
Python 3.5.2 over<br>
Django 2.2.0 over 


Explanation
------
- Put your .pcd file in "static/data/" directory.

- You can choose web framework. I used django.

- Recommend running web browser private mode.(because cache data)

- This project is not perfect but pretty useful. If you have a courage develop it!

- You can set your screen through camera.position(x,y,z) and controls.target.set()


Install & Run & Address
------
Install: sudo pip3 install django

Run: python3 manage.py runserver or ./manage.py runserver

Address: url : https://\<IP:port_number\>/?load=/static/data/<\file_name\>.pcd


Result
------
<img src="kcity.png" width="600" height="350">
This image show Kcity(Korean Autonomous Vehicle Experiment City) pcd map.<br>

<img src="voxel.png" width="600" height="350">
This image show fragment pcd file in Kcity.
 
 
Original Project and Reference
------
[xqms/pcd_web_viewer](https://github.com/xqms/pcd_web_viewer)<br>
[Three.js/pcdloader](https://threejs.org/docs/#examples/en/loaders/PCDLoader)<br>
Add camera and subject setting code and remove not working component(rgb, vector value).