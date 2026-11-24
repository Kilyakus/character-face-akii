import {createAkiiModelBuilder} from './model.js';
import {AKII_VARIANTS,AKII_DEFAULT_VARIANT,AKII_TEXTURES} from './variants.js';
import {AKII_BONE_MAP,AKII_BONES,findAkiiBone,buildAkiiBindings} from './bindings.js';
export {createAkiiModelBuilder,AKII_VARIANTS,AKII_DEFAULT_VARIANT,AKII_TEXTURES,AKII_BONE_MAP,AKII_BONES,findAkiiBone,buildAkiiBindings};
export const AKII_PLUGIN_ID='character-face-akii';
export const AKII_VERSION='1.0.0';
/** No engine, Three.js import, scene, or network access occurs on import. */
export function createAkii({THREE=null,FBXLoader=null}={}){
  return Object.freeze({id:AKII_PLUGIN_ID,version:AKII_VERSION,variants:AKII_VARIANTS,boneMap:AKII_BONE_MAP,
    build(options={}){return createAkiiModelBuilder(THREE,FBXLoader)(options)},
    bindings:buildAkiiBindings});
}
export function buildAkiiModel({THREE,FBXLoader,...options}={}){return createAkii({THREE,FBXLoader}).build(options)}
export default Object.freeze({id:AKII_PLUGIN_ID,version:AKII_VERSION,create:createAkii,build:buildAkiiModel});
