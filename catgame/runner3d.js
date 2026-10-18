import * as THREE from './vendor/three.module.js';
import { Coast3D } from './scene3d.js';
import { buildOutfit } from './outfits3d.js';
import { buildAccessories } from './accessories3d.js';
const LEVEL_COLORS=['#9bb6b3','#b3a3bd','#879eaf'];
export class Runner3D extends Coast3D {
 makeHouse(){}
 makeDecor(){}
 setPet(){
  if(this.pet){this.scene.remove(this.pet);this.pet.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});}this.shieldBubble=null;this.accessoryParts=[];this.waistSwing=null;this.pet=new THREE.Group();this.scene.add(this.pet);this.rig=new THREE.Group();this.pet.add(this.rig);
  const fur=this.material('#e6b976',.7),cream=this.material('#fff0ce',.8),pink=this.material('#d6a5a2'),dark=this.material('#354640',.3),stripe=this.material('#b98b57');
  this.ball(this.rig,fur,0,1.10,0,.48,.66,.40);this.ball(this.rig,cream,0,1.13,.32,.32,.43,.13);
  this.head=new THREE.Group();this.head.position.set(0,2.0,.03);this.rig.add(this.head);this.ball(this.head,fur,0,0,0,.67,.57,.54);this.ball(this.head,cream,0,-.18,.44,.33,.21,.12);
  this.eyes=[];for(const side of [-1,1]){const ear=this.mesh(new THREE.ConeGeometry(.28,.57,3),fur,this.head,side*.44,.52,-.02);ear.rotation.z=-side*.14;const inner=this.mesh(new THREE.ConeGeometry(.17,.34,3),pink,this.head,side*.44,.54,.15);inner.rotation.z=-side*.14;this.eyes.push(this.ball(this.head,dark,side*.25,.02,.49,.068,.094,.047));this.ball(this.head,cream,side*.25-.013,.043,.535,.018,.022,.01);this.ball(this.head,pink,side*.40,-.12,.44,.09,.045,.02);}
  this.ball(this.head,pink,0,-.09,.57,.07,.05,.04);const mouth=this.mesh(new THREE.TorusGeometry(.075,.009,6,16,Math.PI),stripe,this.head,0,-.22,.54);mouth.rotation.z=Math.PI;for(let i=-1;i<=1;i++)this.ball(this.head,stripe,i*.15,.43,.33,.024,.10,.018);
  this.legs=[];for(const side of [-1,1]){const g=new THREE.Group();g.position.set(side*.24,.65,0);this.rig.add(g);this.ball(g,fur,0,-.23,0,.19,.38,.20);this.ball(g,cream,0,-.52,.11,.22,.13,.30);this.legs.push(g);}
  this.arms=[];for(const side of [-1,1]){const g=new THREE.Group();g.position.set(side*.43,1.55,0);this.rig.add(g);this.ball(g,fur,side*.08,-.24,0,.15,.31,.16);this.ball(g,cream,side*.09,-.48,.02,.17,.16,.17);this.arms.push(g);}
  this.tail=new THREE.Group();this.tail.position.set(0,.85,-.30);this.rig.add(this.tail);const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.33,.1,-.45),new THREE.Vector3(.55,.45,-.55),new THREE.Vector3(.50,.68,-.4)]);this.mesh(new THREE.TubeGeometry(curve,18,.10,8,false),fur,this.tail);
  const scarf=this.material('#6d9e9a',.7);const neck=this.baseScarf=this.mesh(new THREE.TorusGeometry(.35,.06,10,24),scarf,this.rig,0,1.62,0);neck.rotation.x=Math.PI/2;const ribbon=this.ribbon=this.mesh(new THREE.BoxGeometry(.16,.5,.045),scarf,this.rig,.18,1.25,-.33);ribbon.rotation.z=.2;
  this.pet.scale.setScalar(.50);
 }
 setOutfit(id='scarf'){buildOutfit(this,id);}
 setAccessories(back='shellpack',waist='starcharm',outfit=this.outfitId){buildAccessories(this,back,waist,outfit);}
 mountWardrobe(canvas){
  if(!this.wardrobe){const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight('#fff6df','#849581',3));const light=new THREE.DirectionalLight('#fff3d3',3);light.position.set(-3,5,5);scene.add(light);const camera=new THREE.PerspectiveCamera(36,1,.1,30);camera.position.set(3,2.65,5.8);camera.lookAt(0,1.55,0);this.wardrobe={renderer,scene,camera,canvas,model:null};}
  this.refreshWardrobe();
 }
 refreshWardrobe(){const w=this.wardrobe;if(!w)return;if(w.model)w.scene.remove(w.model);w.model=this.pet.clone(true);w.model.position.set(0,0,0);w.model.scale.setScalar(1);w.model.rotation.set(0,-.25,0);w.model.visible=true;const rig=w.model.children[0];rig.rotation.set(0,0,0);rig.scale.set(1,1,1);rig.position.y=0;w.model.traverse(o=>{if(o.name==='shieldBubble')o.visible=false;});w.scene.add(w.model);}
 renderWardrobe(time){const w=this.wardrobe;if(!w||!w.model)return;const width=w.canvas.clientWidth,height=w.canvas.clientHeight;if(w.renderer.domElement.width!==Math.round(width*w.renderer.getPixelRatio())||w.renderer.domElement.height!==Math.round(height*w.renderer.getPixelRatio())){w.renderer.setSize(width,height,false);w.camera.aspect=width/height;w.camera.updateProjectionMatrix();}w.model.rotation.y=time*.30;w.renderer.render(w.scene,w.camera);}
 constructor(canvas){super(canvas);this.sand.rotation.y=Math.PI/2;this.ocean.rotation.y=Math.PI/2;this.scene.fog=new THREE.FogExp2('#a9b5b1',.009);this.camera.fov=52;this.camera.updateProjectionMatrix();this.camera.position.set(3.8,4.6,10);this.camera.lookAt(3.8,1,-15);this.camera.updateMatrixWorld();this.entities=[];this.scenery=[];this.elapsed=0;this.running=false;this.coinGeo=new THREE.CylinderGeometry(.25,.25,.075,24);this.coinGeo.rotateX(Math.PI/2);this.coinMat=new THREE.MeshStandardMaterial({color:'#f3cf65',metalness:.72,roughness:.24,emissive:'#9a6710',emissiveIntensity:.12});this.track=new THREE.Group();this.scene.add(this.track);const wood=this.material('#c8b996',.85),side=this.material('#7b9386');
  this.batchDummy=new THREE.Object3D();this.plankBatch=new THREE.InstancedMesh(new THREE.BoxGeometry(5.2,.16,1.12),wood,74);this.plankBatch.receiveShadow=true;this.plankBatch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.plankBatch.frustumCulled=false;this.track.add(this.plankBatch);
  for(let i=0;i<74;i++){const p=new THREE.Object3D();p.position.set(3.8,.05,-i*1.17+12);this.scenery.push(p);p.updateMatrix();this.plankBatch.setMatrixAt(i,p.matrix);}
  for(const x of [1.05,6.55]){const curb=this.mesh(new THREE.BoxGeometry(.16,.25,105),side,this.track,x,.10,-39);curb.castShadow=false;}
  this.railPosts=[];this.postBatch=new THREE.InstancedMesh(new THREE.CylinderGeometry(.045,.06,.6,8),side,56);this.postBatch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.postBatch.frustumCulled=false;this.track.add(this.postBatch);
  for(let i=0;i<28;i++)for(const x of [.85,6.75]){const p=new THREE.Object3D();p.position.set(x,.32,-i*3.5+10);p.updateMatrix();this.postBatch.setMatrixAt(this.railPosts.length,p.matrix);this.railPosts.push(p);}
  const lineMat=this.material('#eee2bf');this.lineBatch=new THREE.InstancedMesh(new THREE.BoxGeometry(.035,.015,.55),lineMat,72);this.lineBatch.frustumCulled=false;this.track.add(this.lineBatch);let li=0;for(let i=0;i<36;i++)for(const x of [3.,4.6]){this.batchDummy.position.set(x,.15,10-i*2.8);this.batchDummy.updateMatrix();this.lineBatch.setMatrixAt(li++,this.batchDummy.matrix);}
  this.lineOffset=0;this.gait=0;this.slideBlend=0;this.qualityFrames=0;this.frameAverage=1/60;this.pixelRatio=Math.min(devicePixelRatio||1,2);this.renderer.setPixelRatio(this.pixelRatio);this.woodTexture=makeWoodTexture(this.renderer);wood.map=this.woodTexture;wood.needsUpdate=true;
  this.makeCoastScenery();this.reset(0);this.resize();
 }
 resize(){if(!this.renderer)return;const w=this.canvas.clientWidth,h=this.canvas.clientHeight;this.width=w;this.height=h;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();if(this.track){this.camera.position.set(3.8,this.width<650?5.2:4.6,this.width<650?14:12);this.camera.lookAt(3.8,1,-15);this.camera.updateMatrixWorld();}else this.updateCamera();}
 makeCoastScenery(){const poleMat=this.material('#7d9284'),lampMat=new THREE.MeshStandardMaterial({color:'#fbe7a5',emissive:'#f0cf80',emissiveIntensity:1.2});this.coastProps=[];for(let i=0;i<14;i++){const g=new THREE.Group();g.position.set(8.5,0,8-i*8);this.scene.add(g);this.mesh(new THREE.CylinderGeometry(.045,.06,2,8),poleMat,g,0,1,0);this.mesh(new THREE.BoxGeometry(.55,.07,.07),poleMat,g,-.22,2,0);this.ball(g,lampMat,-.46,1.82,0,.12,.18,.12);this.coastProps.push(g);}
  const shellMat=this.material('#f0ddad');for(let i=0;i<24;i++){const g=new THREE.Group();g.position.set(10+(i%5)*.6,.1,10-i*4.8);this.scene.add(g);this.ball(g,shellMat,0,.10,0,.24,.10,.30);g.rotation.y=i*.9;this.coastProps.push(g);}
 }
 setStage(cfg){this.scene.fog.color.set(cfg.palette);const colors=['#83b7b4','#87aebc','#7888b4','#85c1ad','#b2a3b5','#8db9bd','#969fc6','#8a96c4'];if(this.waterMat.uniforms.uCoastTint)this.waterMat.uniforms.uCoastTint.value.set(cfg.waterTint||colors[this.level]||colors[0]);}
 reset(level){this.entities?.forEach(e=>this.disposeEntity(e));this.entities=[];this.level=level;this.scene.fog.color.set(LEVEL_COLORS[level]||LEVEL_COLORS[0]);this.pet.position.set(3.8,.18,3);this.pet.rotation.y=0;this.pet.visible=true;}
 disposeEntity(e){this.scene.remove(e.mesh);e.mesh.traverse(o=>{if(o.isMesh){if(o.geometry!==this.coinGeo)o.geometry.dispose();if(o.material!==this.coinMat)o.material.dispose();}});}
 spawn(type,lane,z=-66){const x=3.8+(lane-1)*1.6;let mesh=new THREE.Group();const mat=(c)=>this.material(c);
  if(type==='coin'){const c=this.mesh(this.coinGeo,this.coinMat,mesh,0,0,0);const stamp=this.mesh(new THREE.TorusGeometry(.16,.018,6,18),this.coinMat,mesh,0,0,.049);mesh.position.set(x,.95,z);}
  else if(type==='log'){const wood=mat('#9a8264');const log=this.mesh(new THREE.CylinderGeometry(.32,.32,1.18,12),wood,mesh,0,.46,0);log.rotation.z=Math.PI/2;const end=mat('#cfb991');for(const side of [-1,1]){const ring=this.mesh(new THREE.CircleGeometry(.29,14),end,mesh,side*.60,.46,0);ring.rotation.y=side*Math.PI/2;}mesh.position.set(x,0,z);}
  else if(type==='crate'){const wood=mat('#b99269');this.mesh(new THREE.BoxGeometry(1.05,1.0,.9),wood,mesh,0,.65,0);const beam=mat('#d3b88b');for(const y of [.25,1.05])this.mesh(new THREE.BoxGeometry(1.12,.1,.97),beam,mesh,0,y,0);for(const side of [-1,1]){const brace=this.mesh(new THREE.BoxGeometry(.1,1,.07),beam,mesh,side*.32,.65,.49);brace.rotation.z=side*.5;}mesh.position.set(x,0,z);}
  else if(type==='arch'){const color=mat('#718e8c'),stripe=mat('#ead4a0');for(const side of [-1,1])this.mesh(new THREE.BoxGeometry(.14,1.55,.20),color,mesh,side*.67,.90,0);this.mesh(new THREE.BoxGeometry(1.45,.55,.40),color,mesh,0,1.25,0);for(let i=-2;i<=2;i++){const bar=this.mesh(new THREE.BoxGeometry(.08,.54,.025),stripe,mesh,i*.23,1.25,.22);bar.rotation.z=-.35;}mesh.position.set(x,0,z);}
  else if(type==='wall'){const coral=mat('#a999a0'),stripe=mat('#f1deaf');this.mesh(new THREE.BoxGeometry(1.24,2.7,.7),coral,mesh,0,1.48,0);for(let i=0;i<3;i++){const bar=this.mesh(new THREE.BoxGeometry(1.27,.15,.73),stripe,mesh,0,.6+i*.8,0);bar.rotation.z=-.08;}mesh.position.set(x,0,z);}
  else{const c=type==='magnet'?'#cfaaa3':'#90c6bd';const core=this.mesh(new THREE.IcosahedronGeometry(.34,1),new THREE.MeshStandardMaterial({color:c,metalness:.3,roughness:.15,emissive:c,emissiveIntensity:.4}),mesh);const halo=this.mesh(new THREE.TorusGeometry(.45,.025,8,30),mat('#e9edca'),mesh);mesh.position.set(x,1.2,z);}
  mesh.userData.type=type;this.scene.add(mesh);const e={type,lane,mesh,collected:false,passed:false};this.entities.push(e);return e;
 }
 update(dt,time,data){this.elapsed=time;this.waterMat.uniforms.uTime.value=time;const speed=data.running?data.speed:0;for(const p of this.scenery){p.position.z+=speed*dt;if(p.position.z>13)p.position.z-=74*1.17;}for(const p of this.railPosts){p.position.z+=speed*dt;if(p.position.z>13)p.position.z-=28*3.5;}for(const p of this.coastProps){p.position.z+=speed*dt;if(p.position.z>15)p.position.z-=114;}
  for(let i=0;i<this.scenery.length;i++){const p=this.scenery[i];p.updateMatrix();this.plankBatch.setMatrixAt(i,p.matrix);}this.plankBatch.instanceMatrix.needsUpdate=true;
  for(let i=0;i<this.railPosts.length;i++){const p=this.railPosts[i];p.updateMatrix();this.postBatch.setMatrixAt(i,p.matrix);}this.postBatch.instanceMatrix.needsUpdate=true;
  this.lineOffset=(this.lineOffset+speed*dt)%2.8;let li=0;for(let i=0;i<36;i++)for(const x of [3.,4.6]){this.batchDummy.position.set(x,.15,10-i*2.8+this.lineOffset);this.batchDummy.updateMatrix();this.lineBatch.setMatrixAt(li++,this.batchDummy.matrix);}this.lineBatch.instanceMatrix.needsUpdate=true;
  for(const e of this.entities){e.mesh.position.z+=speed*dt;if(e.type==='coin'){e.mesh.rotation.y=time*2.4;e.mesh.position.y=(e.height||.95)+Math.sin(time*2+e.mesh.position.z*.12)*.06;}else if(e.type==='shield'||e.type==='magnet'){e.mesh.rotation.y=time*1.5;e.mesh.position.y=1.2+Math.sin(time*3)*.12;}}
  this.entities=this.entities.filter(e=>{if(e.collected||e.mesh.position.z>12){this.disposeEntity(e);return false;}return true;});
  const target=3.8+(data.lane-1)*1.6,blend=1-Math.exp(-dt*14),lateral=target-this.pet.position.x;
  this.pet.position.x+=lateral*blend;this.pet.position.y=.18+data.jump;this.pet.position.z=3;
  const angle=data.running?Math.PI:0;this.pet.rotation.y+=Math.atan2(Math.sin(angle-this.pet.rotation.y),Math.cos(angle-this.pet.rotation.y))*(1-Math.exp(-dt*7));
  this.slideBlend+=((data.slide?1:0)-this.slideBlend)*(1-Math.exp(-dt*20));this.rig.rotation.x=-.8*this.slideBlend-(data.boost||0)*.16;this.rig.rotation.z+=(Math.max(-.12,Math.min(.12,lateral*.10))-this.rig.rotation.z)*blend;this.rig.scale.y=1-this.slideBlend*.52;
  if(data.running)this.gait+=dt*(data.speed/8)*13;const stride=this.gait;
  this.rig.position.y=data.running&&data.jump===0&&!data.slide?Math.abs(Math.sin(stride))*.035:0;
  for(let i=0;i<2;i++){const legTarget=data.running?(data.jump>0?-.35:Math.sin(stride+i*Math.PI)*.8):0;this.legs[i].rotation.x+=(legTarget-this.legs[i].rotation.x)*blend;const armTarget=data.running?Math.sin(stride+(1-i)*Math.PI)*.65:0;this.arms[i].rotation.x+=(armTarget-this.arms[i].rotation.x)*blend;}
  this.tail.rotation.z=Math.sin(time*4)*.2;this.head.rotation.z=data.running?0:Math.sin(time)*.03;if(this.ribbon)this.ribbon.rotation.x=Math.sin(stride*.7)*.13;
  this.pet.visible=!(data.invincible>0&&Math.floor(time*12)%2===0);
  const targetFov=52+(data.running?(data.boost||0)*4:0);this.camera.fov+=(targetFov-this.camera.fov)*(1-Math.exp(-dt*3));this.camera.updateProjectionMatrix();this.camera.position.x+=(3.8+(this.pet.position.x-3.8)*.06-this.camera.position.x)*(1-Math.exp(-dt*3));this.camera.lookAt(3.8,1,-15);
  this.frameAverage+=(dt-this.frameAverage)*.025;this.qualityFrames++;
  if(this.qualityFrames>180&&this.frameAverage>.024&&this.pixelRatio>1){this.pixelRatio=Math.max(1,this.pixelRatio-.15);this.renderer.setPixelRatio(this.pixelRatio);this.qualityFrames=0;}
  if(!this.shieldBubble){this.shieldBubble=new THREE.Mesh(new THREE.SphereGeometry(1.1,24,16),new THREE.MeshPhysicalMaterial({color:'#c4ffe9',transparent:true,opacity:.19,roughness:.05,metalness:.15,side:THREE.DoubleSide}));this.shieldBubble.name='shieldBubble';this.pet.add(this.shieldBubble);this.shieldBubble.position.y=1.3;this.shieldBubble.scale.y=1.4;}this.shieldBubble.visible=data.shield>0;
  if(this.waistSwing)this.waistSwing.rotation.z=Math.sin(time*4.5)*.065;
  this.renderer.render(this.scene,this.camera);if(data.wardrobe)this.renderWardrobe(time);
 }
}

function makeWoodTexture(renderer){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#d6c7a3';ctx.fillRect(0,0,512,128);for(let i=0;i<170;i++){const y=(i*17.31)%128;ctx.strokeStyle=i%3===0?'rgba(108,87,58,.055)':'rgba(255,248,216,.09)';ctx.lineWidth=.4+(i%4)*.25;ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<=512;x+=16)ctx.lineTo(x,y+Math.sin(x*.018+i)*1.8);ctx.stroke();}const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return tex;}
