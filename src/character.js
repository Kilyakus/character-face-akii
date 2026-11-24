import {AKII_VARIANTS,AKII_BONE_MAP,buildAkiiModel} from './index.js';
/** Head-only profile: hosts must attach it to a compatible body explicitly. */
export default Object.freeze({
  id:'character-face-akii',name:'Akii',subtitle:'Akii Head · женское и мужское лицо',
  kind:'head',default:false,playable:false,variants:AKII_VARIANTS,
  model:Object.freeze({source:'fbx:akii',build:buildAkiiModel}),
  rig:Object.freeze({boneMap:AKII_BONE_MAP,preserveFineBones:true}),
});
