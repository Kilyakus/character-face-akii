/** These are head-only skeletons, not humanoid body rigs. */
export const AKII_BONE_MAP=Object.freeze({head:'Head',jaw:'Jaw'});
export const AKII_BONES=Object.freeze({
  female:Object.freeze(['Head','Jaw','Eye_L','Eye_R','CheekL','CheekR','Nose','LeftEye','RightEye']),
  male:Object.freeze(['Head','R_Eye','L_Eye','Jaw']),
});
export function findAkiiBone(skeleton,name){return skeleton?.bones?.find(b=>b.isBone&&b.name===name)??null;}
export function buildAkiiBindings(skeleton){
  const bindings={},missing=[];
  for(const [id,boneName] of Object.entries(AKII_BONE_MAP)){
    const bone=findAkiiBone(skeleton,boneName);if(!bone)missing.push(id);
    bindings[id]={bone,boneName};
  }
  return {bindings,missing};
}
