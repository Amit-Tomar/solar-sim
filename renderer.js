import { PCFSoftShadowMap, WebGLRenderer } from 'three';

class Renderer
{
	constructor()
	{
		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0xD3D3D3);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = PCFSoftShadowMap;
		return this.renderer;
	}
}

export default Renderer;