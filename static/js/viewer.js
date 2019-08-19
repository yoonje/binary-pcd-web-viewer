// polyfill for String.endsWith
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(searchString, position) {
		var subjectString = this.toString();
		if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}

function viewer(container, options) {

	var roll = options.roll || 0.0;
	var pitch = options.pitch || 0.0;
	var yaw = options.yaw || 0.0;
	var pointSize = options.pointSize || 0.45;
	var scene = null;
	var renderer = null;
	var camera = null;

	// Build a color from a scalar value
	function buildColor(v) {
		var pi = 3.141592;
		var r = Math.cos(v*2*pi + 0) * 0.5 + 0.5;
		var g = Math.cos(v*2*pi + 2) * 0.5 + 0.5;
		var b = Math.cos(v*2*pi + 4) * 0.5 + 0.5;

		return new THREE.Color(r, g, b);
	}

	// Draw the progressbar on the middle
	left = Math.round( (window.innerWidth - 400)/2 );
	$("#progressbar-container").css("left",left + "px");

	// Scene
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.0009);

	// Camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);

	// Detect webgl support
	if (!Detector.webgl) {
		$("#progressbar-container").hide();
		Detector.addGetWebGLMessage();
		return;
	}

	// The renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth,window.innerHeight -4);

	// Render the scene
	function render() {
		renderer.render(scene, camera);
	}

	// Setup controls
	var controls = new THREE.OrbitControls( camera );
	controls.rotateSpeed = 0.5;
	controls.zoomSpeed = 2.0;
	controls.panSpeed = 0.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.3;
	controls.addEventListener('change', render);

	var geometry = new THREE.SphereGeometry( 4, 32, 32 );
	var material = new THREE.MeshBasicMaterial({
		color: 0xffff00,
		transparent: true,
		opacity: 0.5
	});
	controls.visualizer = new THREE.Mesh( geometry, material );
	controls.visualizer.visible = false;
	scene.add( controls.visualizer );

	// Render loop
	function animate() {
		requestAnimationFrame(animate);
		controls.update();
	}

	// Init the geometry
	var geometry = new THREE.Geometry();
	var material = new THREE.PointsMaterial({size:pointSize, vertexColors:true});
	var pointcloud = new THREE.Points(geometry, material);

	scene.add(pointcloud);

	// Add the canvas, render and animate
	container.append(renderer.domElement);

	// Load the pointcloud
	var colors = {
		x: {
			data: [],
			valid: 0
		},
		y: {
			data: [],
			valid: 0
		},
		z: {
			data: [],
			valid: 0
		},
	};

	var cname = getUrlParameter('color');
	if(cname == undefined)
		cname = 'x';

	function recomputeColorChannel(name, stats, numPoints) {
		stats = stats[name];
		var data = colors[name].data;

		if(stats.min >= stats.max)
		{
			// Extend to vertices.length
			for(var i = data.length; i < geometry.vertices.length; ++i)
				data[i] = new THREE.Color(0.87, 0.87, 0.87);

			return;
		}

		var start = stats.dirty ? 0 : colors[name].valid;
		if(stats.dirty)
			console.log('color channel dirty');

		for (var i=start; i < numPoints; i++)
		{
			var z = geometry.vertices[i][name];
			t = (z-stats.min)/(stats.max-stats.min);
			if(isNaN(t))
			{
				data[i] = new THREE.Color(0);
				continue;
			}
			data[i] = buildColor(t);
		}

		// Extend to vertices.length
		for(var i = numPoints; i < geometry.vertices.length; ++i)
			data[i] = new THREE.Color(0.87, 0.87, 0.87);

		colors[name].valid = numPoints;
	};

	// Changes the color of the points
	function changeColor(color_mode)
	{
		console.log('Switching to color mode', color_mode);

		if(colors[color_mode].valid != geometry.vertices.length)
		{
			recomputeColorChannel(color_mode, finalStats, geometry.vertices.length);
		}

		pointcloud.geometry.colors = colors[color_mode].data;
		pointcloud.geometry.colorsNeedUpdate = true;
	}

	// Handle colors and pointsize
	function onKeyDown(evt) {
		// Increase/decrease point size
		if (evt.keyCode == 109)
		{
			pointcloud.material.size -= 0.01;
			pointcloud.material.needsUpdate = true;
		}

		if (evt.keyCode == 107)
		{
			pointcloud.material.size += 0.01;
			pointcloud.material.needsUpdate = true;
		}

		if (evt.keyCode == 49) changeColor('x');
		if (evt.keyCode == 50) changeColor('y');
		if (evt.keyCode == 51) changeColor('z');

		render();
	}

	var bufferSize = 0;
	var finalStats = null;

	var load = loadPCDFile;
	var filename = options.filename;

	var transform = new THREE.Matrix4();

	var euler = new THREE.Euler(roll, pitch, yaw, 'XYZ');
	transform.makeRotationFromEuler(euler);

	load(filename, transform, geometry.vertices, colors['x'].data,
		function(stats, numPoints) {
			colors['x'].valid = numPoints;
			finalStats = stats;

			recomputeColorChannel(cname, stats, numPoints);

			console.log('progress', numPoints);

			// If the geometry buffer size changed, we need to
			// recreate the geometry.
			if(geometry.vertices.length !== bufferSize) {
				scene.remove(pointcloud);
				pointcloud.geometry.dispose();
				pointcloud.material.dispose();

				var vertices = geometry.vertices;

				geometry = new THREE.Geometry();
				geometry.dynamic = true;
				geometry.vertices = vertices;
				geometry.colors = colors[cname].data;

				pointcloud = new THREE.Points(geometry, material);
				scene.add(pointcloud);
			}
			else
			{
				geometry.verticesNeedUpdate = true;
				geometry.colorsNeedUpdate = true;
			}

			bufferSize = geometry.vertices.length;

			// linear moving input proper value(x,y) <=> position`s x,y target`s x,y
			camera.position.x = -150
			camera.position.y = -100
			camera.position.z = 450
			controls.target.set(-150, -100, 0);

			render();
		},
		function() {
			// Remove the progressbar
			$("#progressbar-container").hide();
			$("#controls-browser").show();

			changeColor('y');
			render();

			document.addEventListener("keydown", onKeyDown, false);
		}
	);

	render();
	animate();
}
