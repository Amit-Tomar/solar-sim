import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Home
{
	constructor(onLoadComplete)
	{
		const loader = new GLTFLoader();
		loader.load(
			"house.gltf",
			function (gltf)
			{
				gltf.scene.traverse((model) =>
				{
					if (model.isMesh)
					{
						model.receiveShadow = true;
						model.castShadow = true;
					}
				});
				onLoadComplete(gltf.scene)
			}
		);
	}
}

export default Home;