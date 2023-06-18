import { Vector3, DirectionalLightHelper, CameraHelper, SphereGeometry, MeshStandardMaterial, Mesh, BufferGeometry, BufferAttribute, Line, LineDashedMaterial, DoubleSide, AmbientLight, DirectionalLight } from 'three';
import SunCalc from 'suncalc3'

class Sun
{
	constructor(position)
	{
		this.DEBUG = false
		this._position = position
		this.sunLight = new DirectionalLight('white', 2);
		this.sunLight.position.set(this._position.x, this._position.y, this._position.z);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.mapSize.width = 4096;
		this.sunLight.shadow.mapSize.height = 4096;
		this.sunLight.shadow.bias = -0.0001; // Removes shadow artifacts
		this.sunLight.shadow.camera.left = -15
		this.sunLight.shadow.camera.right = 15
		this.sunLight.shadow.camera.top = 15
		this.sunLight.shadow.camera.bottom = -15

		this.sunLightHelper = new DirectionalLightHelper(this.sunLight, 1);
		this.sunShadowMapHelper = new CameraHelper(this.sunLight.shadow.camera);

		// Sun model
		let geometry = new SphereGeometry(.5, 200, 200);
		let material = new MeshStandardMaterial({ color: 'orange', side: DoubleSide });
		this.sunMesh = new Mesh(geometry, material);

		//
		this.ambientLight = new AmbientLight('white', .1);

		// Sun Path points
		this.MAX_POINTS = 800;

		// geometry
		this.sunPathGeometry = new BufferGeometry();

		// attributes
		this.sunMovementPositions = new Float32Array(this.MAX_POINTS * 3); // 3 vertices per point
		this.sunPathGeometry.setAttribute('position', new BufferAttribute(this.sunMovementPositions, 3));

		// drawcalls
		this.drawCount = -1; // draw the first 2 points, only
		this.sunPathGeometry.setDrawRange(0, this.drawCount);

		// material
		const sunPathMaterial = new LineDashedMaterial({ 
			color: 0xffffff,
			linewidth: 1,
			scale: 1,
			dashSize: 3,
			gapSize: 1, 
		});

		// line
		this.sunPath = new Line(this.sunPathGeometry, sunPathMaterial);
	}

	get position()
	{
		return this._position;
	}

	set position(position)
	{
		this._position = position;
		this.sunLight.position.set(position.x, position.y, position.z);
		this.sunMesh.position.set(position.x, position.y, position.z);

		const positionAttribute = this.sunPath.geometry.getAttribute('position');
		positionAttribute.setXYZ(this.drawCount, position.x, position.y, position.z);

		this.drawCount = Math.min((this.drawCount + 1), this.MAX_POINTS)
		this.sunPath.geometry.setDrawRange(0, this.drawCount);
		this.sunPath.geometry.attributes.position.needsUpdate = true;
	}

	update( date, lat, long ) {
		const sunPos = SunCalc.getPosition( date, lat, long);
		const RADIUS = 20;
		const x = RADIUS * Math.cos(sunPos.altitude) * Math.cos(sunPos.azimuth)
		const z = RADIUS * Math.cos(sunPos.altitude) * Math.sin(sunPos.azimuth)
		const y = RADIUS * Math.sin(sunPos.altitude)
		this.position = new Vector3(x,y,z);

		let times = SunCalc.getSunTimes(date, lat, long);
		let sunriseStart = times.sunriseStart.value;
		let sunsetEnd = times.sunsetEnd.value;

		// If sun has set or sunrise has not occured yet, close the light source
		if( date > sunsetEnd || date < sunriseStart ) {
			this.sunLight.intensity = 0
		}
		else {
			this.sunLight.intensity = 1
		}
	}

	attachTo(node)
	{
		node.add(this.sunMesh);
		node.add(this.sunLight);
		this.DEBUG && node.add(this.sunLightHelper);
		this.DEBUG && node.add(this.sunShadowMapHelper);
		node.add(this.sunPath);
		node.add(this.ambientLight);
	}

	resetPathDraw() {
		this.drawCount = -1;
	}
}

export default Sun;