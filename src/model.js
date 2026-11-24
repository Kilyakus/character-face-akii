import {AKII_VARIANTS,AKII_TEXTURES,AKII_DEFAULT_VARIANT} from './variants.js';

/** Host supplies Three.js and FBXLoader from the same Three.js version.
 * baseURL must point to the directory reference/models/akii/ and end in '/'.
 * In a browser, the host must expose those asset files as static URLs.
 */
export function createAkiiModelBuilder(THREE,FBXLoader){
  if(!THREE?.LoadingManager||typeof FBXLoader!=='function')throw new TypeError('Akii: provide THREE and FBXLoader from the same Three.js build');
  return async function build({variant=AKII_DEFAULT_VARIANT,baseURL=new URL('../reference/models/akii/',import.meta.url),signal,fetchAsset=globalThis.fetch}={}){
    const spec=AKII_VARIANTS.find(item=>item.id===variant);if(!spec)throw new Error(`Akii: unknown variant ${variant}`);
    if(typeof fetchAsset!=='function')throw new TypeError('Akii: fetch is unavailable');
    const base=new URL(String(baseURL),import.meta.url);if(!base.pathname.endsWith('/'))throw new Error('Akii: baseURL must end in /');
    const asset=path=>new URL(path.split('/').map(encodeURIComponent).join('/'),base).href;
    const abort=()=>{if(signal?.aborted)throw new DOMException('Akii loading aborted','AbortError')};abort();
    const response=await fetchAsset(asset(spec.model),{signal});if(!response.ok)throw new Error(`Akii: model request failed (${response.status})`);
    const bytes=await response.arrayBuffer();abort();if(bytes.byteLength<100||bytes.byteLength>16_000_000)throw new Error('Akii: invalid FBX size');
    const manager=new THREE.LoadingManager(),missingTextures=new Set();
    // The female FBX references Aki Female Head_NeckMerge.png, which is not in
    // the supplied repository. Only that optional texture gets a white fallback;
    // all other unknown texture names fail explicitly rather than loading an arbitrary path.
    const fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
    manager.setURLModifier(path=>{
      if(/^(blob:|data:)/i.test(path))return path;
      const name=decodeURIComponent(path.split(/[\\/]/).pop()).toLowerCase();
      const relative=AKII_TEXTURES[variant][name];
      if(relative)return asset(relative);
      if(variant==='female'&&name==='aki female head_neckmerge.png'){missingTextures.add(name);return fallback;}
      throw new Error(`Akii: unknown referenced texture ${name}`);
    });
    let started=false,failed=false,finish;const texturesReady=new Promise(resolve=>finish=resolve);
    manager.onStart=()=>{started=true};manager.onLoad=finish;manager.onError=()=>{failed=true};
    let group;
    const dispose=()=>{
      if(!group)return;group.removeFromParent();const geometry=new Set(),materials=new Set(),textures=new Set(),skeletons=new Set();
      group.traverse(n=>{if(n.geometry)geometry.add(n.geometry);if(n.skeleton)skeletons.add(n.skeleton);for(const m of Array.isArray(n.material)?n.material:n.material?[n.material]:[]){materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v)}});
      for(const t of textures)t.dispose();for(const m of materials)m.dispose();for(const g of geometry)g.dispose();for(const s of skeletons)s.dispose();group=null;
    };
    try{
      group=new FBXLoader(manager).parse(bytes,'');if(started)await texturesReady;abort();if(failed)throw new Error('Akii: failed to load texture');
      let mesh=null;group.traverse(node=>{if(!mesh&&node.isSkinnedMesh&&node.name===spec.mesh)mesh=node});
      const skeleton=mesh?.skeleton,head=skeleton?.bones.find(b=>b.isBone&&b.name==='Head');
      if(!mesh||!head)throw new Error('Akii: FBX does not contain the expected skinned head and Head bone');
      for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])if(material?.map)material.map.colorSpace=THREE.SRGBColorSpace;
      group.updateMatrixWorld(true);
      return {group,mesh,skeleton,bones:skeleton.bones,head,variant,missingTextures:[...missingTextures],dispose};
    }catch(error){dispose();throw error;}
  };
}
