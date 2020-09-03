# Binary PCD Web Viewer
.pcd file(pointcloud data format) web viwer.

### Explanation
- Put your .pcd file in "static/data/" directory.
- You can choose web framework. I used Django.
- Recommend running web browser private mode.(because cache data)
- You can set your screen through `camera.position(x,y,z)` and `controls.target.set()`

### Run
`url : https://<IP:port_number>/?load=/static/data/<file_name>.pcd`

### Result
<img width="2100" alt="kcity" src="https://user-images.githubusercontent.com/38535571/92152587-e46ded00-ee5d-11ea-8646-fa594696fad8.png">
This image show Kcity(South Korea Autonomous Vehicle Experiment City) pcd map.<br><br>

<img width="2045" alt="voxel" src="https://user-images.githubusercontent.com/38535571/92152641-f9e31700-ee5d-11ea-85ce-0c26c29efe8f.png">
This image show fragment pcd file in Kcity.
 
