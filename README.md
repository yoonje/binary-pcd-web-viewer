Binary pcd viewer
------
.pdf file(pointcloud data format) web viwer.

Explanation
------
- Put your .pcd file in "static/data/" directory.
- You can choose web framework. I used Django.
- Recommend running web browser private mode.(because cache data)
- You can set your screen through `camera.position(x,y,z)` and `controls.target.set()`

Run
------
`url : https://\<IP:port_number\>/?load=/static/data/<\file_name\>.pcd`


Action
------
<img src="kcity.png" width="100%" height="55%">
This image show Kcity(South Korea Autonomous Vehicle Experiment City) pcd map.<br><br>

<img src="voxel.png" width="100%" height="55%">
This image show fragment pcd file in Kcity.
 
