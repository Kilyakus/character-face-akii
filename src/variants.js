/** Paths are relative to reference/models/akii/. Keep the original FBX and texture names. */
export const AKII_VARIANTS = Object.freeze([
  Object.freeze({id:'female', label:'Женское лицо', model:'Female/Aki Female Head.fbx', mesh:'Akii_Head_Female'}),
  Object.freeze({id:'male', label:'Мужское лицо', model:'Male/Akii Male Head.fbx', mesh:'Akii_Head'}),
]);
export const AKII_DEFAULT_VARIANT = 'female';
export const AKII_TEXTURES = Object.freeze({
  female:Object.freeze({
    'aki female head.png':'Female/Textures/Aki Female Head.png',
    'akihead expressions.png':'Female/Textures/AkiHead Expressions.png',
    'a16.png':'Female/Textures/Eyes/a16.png',
    'lashes2.png':'Female/Textures/Maps/Lashes2.png',
    'head_lipnormal.png':'Female/Textures/Maps/Head_LipNormal.png',
  }),
  male:Object.freeze({
    'akiihead_male base color.png':'Male/Textures/AkiiHead_Male Base Color.png',
    'akiihead_lipskinnorma.png':'Male/Textures/AkiiHead_LipskinNorma.png',
    'eyebrowlash.png':'Male/Textures/eyebrowlash.png',
    'akihead expressions.png':'Male/Textures/AkiHead Expressions.png',
    'a1.png':'Male/Textures/Eyes/a1.png',
  }),
});
