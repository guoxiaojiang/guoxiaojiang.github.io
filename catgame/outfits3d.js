import * as THREE from './vendor/three.module.js';
const TAU=Math.PI*2;
export function buildOutfit(e,id='scarf'){
 if(e.outfitParts)for(const obj of e.outfitParts){obj.parent?.remove(obj);obj.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});}
 e.outfitParts=[];e.outfitId=id;if(e.baseScarf)e.baseScarf.visible=id==='scarf';if(e.ribbon)e.ribbon.visible=id==='scarf';
 const add=o=>{e.outfitParts.push(o);return o;};
 const fabric=(color,gloss=false)=>{if(!e.fabricMap){const data=new Uint8Array(64*64*4);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const i=(y*64+x)*4,v=142+(x%2?23:0)+(y%2?18:0)+Math.floor(Math.sin(x*12.3+y*3.4)*9);data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;}const tex=new THREE.DataTexture(data,64,64);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(5,5);tex.needsUpdate=true;e.fabricMap=tex;}
 return new THREE.MeshPhysicalMaterial({color,roughness:gloss?.34:.86,metalness:0,sheen:gloss?.15:.65,sheenColor:new THREE.Color(color).lerp(new THREE.Color('#fff8e5'),.24),sheenRoughness:.8,bumpMap:e.fabricMap,bumpScale:gloss?.002:.007,clearcoat:gloss?.4:0,clearcoatRoughness:.25,side:THREE.DoubleSide});};
 const colors={sailor:'#6d99ae',hoodie:'#9cbda6',stars:'#7e72a5',raincoat:'#e6bf59',strawberry:'#d49d9e',astronaut:'#eee9da',aviator:'#967055',crystal:'#a9cede',prince:'#657bac',sakura:'#dda8be',aurora:'#8ebfc2',scarf:'#7fa69a'};
 const cloth=fabric(colors[id]||colors.scarf,id==='raincoat'),cream=fabric('#fff1d5'),navy=fabric('#426777'),gold=new THREE.MeshStandardMaterial({color:'#d9b56a',roughness:.38,metalness:.55}),stitch=fabric('#dce4c5'),dark=fabric('#536b67');
 const ball=(p,m,x,y,z,sx,sy,sz)=>add(e.ball(p,m,x,y,z,sx,sy,sz));
 const mesh=(p,g,m,x=0,y=0,z=0)=>add(e.mesh(g,m,p,x,y,z));
 const tube=(p,m,pts,r=.009)=>mesh(p,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(v=>new THREE.Vector3(...v))),Math.max(12,pts.length*4),r,6,false),m);
 const ring=(p,m,x,y,z,r,t=.025,squash=1)=>{const o=mesh(p,new THREE.TorusGeometry(r,t,8,36),m,x,y,z);o.rotation.x=Math.PI/2;o.scale.y=squash;return o;};
 const panel=(p,m,points,z,depth=.014)=>{const sh=new THREE.Shape();points.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();return mesh(p,new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:true,bevelSize:.009,bevelThickness:.009,bevelSegments:2}),m,0,0,z);};
 const button=(p,x,y,z,r=.035)=>ball(p,gold,x,y,z,r,r,.015);
 const torso=(m=cloth,short=false)=>{const pts=[[0,.64],[.35,.64],[.46,.70],[.52,.93],[.53,1.14],[.48,1.36],[.36,1.60],[.32,1.62],[0,1.62]].map(a=>new THREE.Vector2(...a));return mesh(e.rig,new THREE.LatheGeometry(pts,40),m,0,0,.035);};
 const sleeves=(m=cloth,long=false)=>{for(let i=0;i<2;i++){const arm=e.arms[i],side=i===0?-1:1;ball(arm,m,side*.07,long?-.23:-.13,0,.185,long?.32:.22,.19);for(let j=0;j<3;j++)ring(arm,id==='sailor'?cream:m,side*.08,(long?-.48:-.30)+j*.014,0,.171,.012,1);}};
 const star=(p,x,y,z,size=.10,m=gold)=>{const sh=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?size*.43:size;const xx=Math.cos(a)*r,yy=Math.sin(a)*r;i?sh.lineTo(xx,yy):sh.moveTo(xx,yy);}sh.closePath();const o=mesh(p,new THREE.ExtrudeGeometry(sh,{depth:.012,bevelEnabled:true,bevelSize:.005,bevelThickness:.003,bevelSegments:1}),m,x,y,z);return o;};
 const hood=(m=cloth)=>{ball(e.rig,m,0,1.60,-.19,.44,.23,.35);ball(e.rig,cream,0,1.735,-.15,.33,.055,.245);tube(e.rig,m,[[-.34,1.69,-.19],[-.22,1.76,-.36],[0,1.78,-.43],[.22,1.76,-.36],[.34,1.69,-.19]],.035);};
 const hem=(m=cloth)=>{for(let i=0;i<3;i++)ring(e.rig,m,0,.72+i*.019,.035,.449,.010,1.05);};
 const boots=(m)=>{for(const leg of e.legs){ball(leg,m,0,-.48,.10,.238,.18,.315);ring(leg,m,0,-.35,0,.18,.025,1.1);}};
 const crystal=new THREE.MeshPhysicalMaterial({color:'#c0e4ef',metalness:.22,roughness:.12,clearcoat:1,clearcoatRoughness:.1});
 const gem=(p,x,y,z,r=.06,m=crystal)=>mesh(p,new THREE.OctahedronGeometry(r,0),m,x,y,z);
 const crown=(color=gold)=>{const base=ring(e.head,color,0,.63,0,.36,.022);for(let i=0;i<5;i++){const a=(i/4-.5)*2.3,x=Math.sin(a)*.33,z=Math.cos(a)*.33;const tip=mesh(e.head,new THREE.ConeGeometry(.075,.19,4),color,x,.73,z);tip.rotation.z=-x*.2;gem(e.head,x,.85,z,.033);}};
 const flower=(p,x,y,z,m=cloth)=>{for(let i=0;i<5;i++){const a=i*TAU/5;const petal=ball(p,m,x+Math.cos(a)*.065,y+Math.sin(a)*.065,z,.057,.04,.02);petal.rotation.z=a;}ball(p,gold,x,y,z+.025,.025,.025,.017);};
 if(id==='scarf'){
  ring(e.rig,cloth,0,1.61,.02,.36,.07,.92);tube(e.rig,cream,[[-.30,1.61,.20],[0,1.56,.38],[.30,1.61,.20]],.012);ball(e.rig,gold,.08,1.51,.43,.04,.055,.02);e.refreshWardrobe?.();return;
 }
 if(id==='sailor'){
  torso();sleeves();hem(navy);ring(e.rig,cream,0,.80,.035,.47,.018,1.04);
  panel(e.rig,cream,[[-.38,1.56],[-.14,1.31],[0,1.44],[.14,1.31],[.38,1.56],[.22,1.62],[-.22,1.62]],.425);
  const collar=panel(e.rig,cream,[[-.36,1.59],[.36,1.59],[.34,1.34],[-.34,1.34]],-.465);collar.rotation.y=0;
  tube(e.rig,navy,[[-.31,1.55,-.48],[-.30,1.38,-.48],[.30,1.38,-.48],[.31,1.55,-.48]],.012);
  panel(e.rig,navy,[[-.02,1.39],[-.21,1.47],[-.18,1.29]],.55);panel(e.rig,navy,[[.02,1.39],[.21,1.47],[.18,1.29]],.55);ball(e.rig,gold,0,1.38,.58,.035,.045,.02);
  tube(e.rig,navy,[[0,1.37,.56],[-.05,1.18,.58],[-.11,1.09,.55]],.035);tube(e.rig,navy,[[.02,1.37,.56],[.09,1.22,.58],[.12,1.14,.56]],.028);
  const hat=mesh(e.head,new THREE.LatheGeometry([[0,.58],[.36,.58],[.40,.63],[.40,.75],[.35,.81],[0,.84]].map(a=>new THREE.Vector2(...a)),40),cream);hat.rotation.z=-.055;
  ring(e.head,navy,0,.625,0,.398,.027);ring(e.head,cream,0,.67,0,.401,.008);
  tube(e.head,gold,[[-.06,.71,.382],[0,.66,.414],[.06,.71,.382]],.009);tube(e.head,gold,[[0,.66,.414],[0,.77,.405]],.009);ring(e.head,gold,0,.785,.4,.018,.006);button(e.rig,-.30,1.05,.46,.024);
 }else if(id==='hoodie'){
  torso();sleeves(cloth,true);hood();hem();
  panel(e.rig,cloth,[[-.29,1.10],[-.19,1.18],[.19,1.18],[.29,1.10],[.25,.88],[-.25,.88]],.55);
  tube(e.rig,cream,[[-.24,.91,.58],[0,.89,.59],[.24,.91,.58]],.006);for(const side of [-1,1]){tube(e.rig,stitch,[[side*.12,1.59,.38],[side*.105,1.40,.53],[side*.145,1.26,.57]],.012);ball(e.rig,gold,side*.145,1.25,.58,.018,.038,.016);}
  const patch=mesh(e.rig,new THREE.CircleGeometry(.11,24),cream,0,1.22,-.514);patch.rotation.y=Math.PI;const emblem=star(e.rig,0,1.22,-.528,.07,gold);emblem.rotation.y=Math.PI;
  for(const x of [-.25,.25])tube(e.rig,stitch,[[x,1.04,.57],[x*.96,.96,.58],[x*.89,.91,.56]],.006);
 }else if(id==='stars'){
  const nx=28,ny=18,verts=[],uvs=[],indices=[];
  for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){const v=y/ny,u=x/nx,a=(u-.5)*2.1,r=.39+v*.35;verts.push(Math.sin(a)*r,1.64-v*.98+Math.sin(a*5)*v*.022,-Math.cos(a)*r-.06-Math.sin(a*8)*v*.018);uvs.push(u,v);if(x<nx&&y<ny){const i=y*(nx+1)+x;indices.push(i,i+1,i+nx+1,i+1,i+nx+2,i+nx+1);}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();mesh(e.rig,geo,cloth);
  const lower=[];for(let x=0;x<=nx;x++){const i=(ny*(nx+1)+x)*3;lower.push(verts.slice(i,i+3));}tube(e.rig,gold,lower,.017);
  for(const side of [-1,1]){const edge=[];for(let y=0;y<=ny;y++){const i=(y*(nx+1)+(side===-1?0:nx))*3;edge.push(verts.slice(i,i+3));}tube(e.rig,gold,edge,.012);}
  for(const [x,y,z,size] of [[0,1.19,-.635,.13],[-.28,.94,-.68,.07],[.29,1.40,-.47,.055],[.25,.80,-.74,.05]]){const badge=star(e.rig,x,y,z,size);badge.rotation.y=Math.PI;}
  tube(e.rig,gold,[[-.26,1.63,.1],[-.17,1.52,.38],[0,1.49,.48],[.17,1.52,.38],[.26,1.63,.1]],.015);ball(e.rig,gold,0,1.48,.50,.045,.06,.018);
  const hatGeo=new THREE.CylinderGeometry(.015,.39,.77,36,14);const pos=hatGeo.attributes.position;for(let i=0;i<pos.count;i++){const y=pos.getY(i)+.385;pos.setX(i,pos.getX(i)+Math.pow(y/.77,2)*.15);}hatGeo.computeVertexNormals();mesh(e.head,hatGeo,cloth,0,.94,0);
  mesh(e.head,new THREE.LatheGeometry([[0,.55],[.42,.55],[.49,.575],[.48,.615],[.35,.635],[0,.635]].map(a=>new THREE.Vector2(...a)),40),cloth);ring(e.head,gold,0,.66,0,.35,.018);star(e.head,.05,.86,.31,.065);ball(e.head,gold,.15,1.34,0,.035,.04,.035);
 }else if(id==='raincoat'){
  torso();sleeves(cloth,true);hood();hem();boots(cloth);
  tube(e.rig,cream,[[0,1.59,.40],[0,1.35,.55],[0,1.05,.575],[0,.73,.47]],.012);
  for(const y of [.91,1.11,1.31])button(e.rig,.075,y,.565,.026);
  for(const side of [-1,1]){panel(e.rig,cloth,[[side*.16,1.15],[side*.38,1.13],[side*.35,.96],[side*.15,.98]],.51);tube(e.rig,cream,[[side*.17,1.13,.54],[side*.37,1.11,.54]],.007);}
  mesh(e.head,new THREE.LatheGeometry([[0,.58],[.38,.58],[.48,.59],[.51,.62],[.38,.70],[.30,.89],[0,.97]].map(a=>new THREE.Vector2(...a)),40),cloth);ring(e.head,cream,0,.65,0,.4,.012);tube(e.head,cream,[[-.28,.62,.29],[0,.60,.48],[.28,.62,.29]],.009);
 }else if(id==='strawberry'){
  torso(cream);sleeves(cream);const skirt=mesh(e.rig,new THREE.LatheGeometry([[0,.66],[.60,.66],[.61,.71],[.49,.94],[.40,1.14],[0,1.14]].map(a=>new THREE.Vector2(...a)),40),cloth);skirt.scale.z=.91;
  for(const side of [-1,1]){tube(e.rig,cloth,[[side*.27,1.62,.24],[side*.25,1.43,.49],[side*.22,1.13,.54]],.055);button(e.rig,side*.22,1.14,.60,.037);tube(e.rig,cream,[[side*.27,1.61,.3],[side*.25,1.43,.55],[side*.22,1.20,.59]],.007);}
  ring(e.rig,cream,0,.71,.015,.59,.018,.91);for(const x of [-.34,-.17,0,.17,.34])ball(e.rig,cream,x,.84,.49-Math.abs(x)*.16,.012,.024,.008);
  const leaf=fabric('#8ba77d');for(let i=0;i<5;i++){const a=i*TAU/5;ball(e.head,cloth,.48+Math.cos(a)*.08,.45+Math.sin(a)*.08,.23,.07,.07,.025);}ball(e.head,gold,.48,.45,.255,.037,.037,.018);const l=ball(e.head,leaf,.58,.48,.20,.11,.035,.025);l.rotation.z=.45;
 }else if(id==='astronaut'){
  torso();sleeves(cloth,true);boots(dark);for(const arm of e.arms)ball(arm,cream,arm.position.x<0?-.09:.09,-.48,.02,.19,.17,.18);
  const cyan=fabric('#8eb7ba');ring(e.rig,cyan,0,1.62,0,.39,.055);hem(cyan);
  panel(e.rig,dark,[[-.22,1.37],[.22,1.37],[.22,1.09],[-.22,1.09]],.565);for(let i=0;i<3;i++)ball(e.rig,[gold,cyan,cream][i],-.12+i*.12,1.19,.60,.027,.027,.015);
  for(const side of [-1,1])tube(e.rig,cyan,[[side*.32,1.49,-.37],[side*.37,1.25,-.47],[side*.32,.91,-.46]],.025);
  mesh(e.rig,new THREE.BoxGeometry(.52,.57,.22),cloth,0,1.21,-.51);for(const x of [-.20,.20])ball(e.rig,cyan,x,1.18,-.61,.10,.28,.11);
  const glass=new THREE.MeshPhysicalMaterial({color:'#d3ecea',transparent:true,opacity:.17,metalness:.12,roughness:.08,side:THREE.FrontSide});ball(e.head,glass,0,0,0,.84,.75,.75);const seal=mesh(e.head,new THREE.TorusGeometry(.71,.033,10,48),cyan,0,0,.18);seal.scale.y=.94;
  star(e.rig,.34,1.28,.44,.07);for(const x of [-.09,.09])ball(e.rig,gold,x,1.29,-.638,.027,.027,.012);
 }else if(id==='aviator'){
  torso();sleeves(cloth,true);hem(dark);ring(e.rig,cream,0,1.60,.02,.37,.09,.95);
  tube(e.rig,gold,[[0,1.51,.49],[0,1.17,.58],[0,.76,.48]],.013);ball(e.rig,gold,0,1.38,.59,.025,.045,.014);
  for(const side of [-1,1]){panel(e.rig,cloth,[[side*.10,1.22],[side*.36,1.20],[side*.34,.98],[side*.12,1.0]],.54);tube(e.rig,cream,[[side*.12,1.17,.58],[side*.33,1.15,.58]],.006);ring(e.arms[side===-1?0:1],cream,side*.08,-.45,0,.18,.04);}
  mesh(e.head,new THREE.SphereGeometry(.70,32,18,0,TAU,0,Math.PI*.38),cloth,0,.01,-.01);ring(e.head,dark,0,.32,0,.60,.028,.83);
  const lens=new THREE.MeshPhysicalMaterial({color:'#9cc8cc',metalness:.30,roughness:.13,transparent:true,opacity:.78});for(const side of [-1,1]){ball(e.head,gold,side*.25,.34,.48,.205,.14,.045);ball(e.head,lens,side*.25,.34,.519,.17,.105,.018);}tube(e.head,gold,[[-.08,.34,.52],[0,.37,.53],[.08,.34,.52]],.014);
  const wing=star(e.rig,0,1.25,-.522,.095);wing.rotation.y=Math.PI;for(const side of [-1,1])tube(e.rig,gold,[[side*.08,1.25,-.54],[side*.25,1.32,-.50],[side*.35,1.30,-.46]],.016);
 }else if(id==='crystal'){
  torso();sleeves(cream);hem(gold);crown();
  for(const [y,r,h] of [[.88,.56,.30],[.73,.65,.25]]){const skirt=mesh(e.rig,new THREE.CylinderGeometry(r*.72,r,h,48,1,true),cloth,0,y,.03);skirt.scale.z=.88;ring(e.rig,cream,0,y-h/2,.03,r,.018,.88);}
  const pearl=new THREE.MeshPhysicalMaterial({color:'#ffeedb',roughness:.22,metalness:.15,clearcoat:.7});
  for(let i=0;i<11;i++){const a=-1.25+i*.25;ball(e.rig,pearl,Math.sin(a)*.35,1.58-Math.cos(a)*.07,.07+Math.cos(a)*.34,.027,.027,.027);}
  gem(e.rig,0,1.40,.55,.085);for(let i=0;i<7;i++){const a=(i-3)*.29;gem(e.rig,Math.sin(a)*.60,.66,.03+Math.cos(a)*.57,.033);}
  for(const side of [-1,1]){tube(e.rig,gold,[[side*.06,1.38,.55],[side*.23,1.16,.55],[side*.36,.95,.44]],.009);ball(e.rig,cream,side*.13,.98,-.53,.17,.11,.06);}gem(e.rig,0,.98,-.60,.06);
 }else if(id==='prince'){
  torso();sleeves(cloth,true);boots(navy);hem(gold);crown();
  for(const side of [-1,1]){panel(e.rig,cream,[[side*.04,1.54],[side*.34,1.57],[side*.20,1.31]],.47);ball(e.arms[side===-1?0:1],gold,side*.05,-.04,0,.21,.06,.22);for(let i=0;i<4;i++)tube(e.arms[side===-1?0:1],gold,[[side*.12,-.05,-.11+i*.07],[side*.19,-.14,-.11+i*.07]],.008);}
  for(const y of [.91,1.09,1.27])for(const x of [-.10,.10])button(e.rig,x,y,.58,.022);
  tube(e.rig,gold,[[-.33,1.53,.36],[-.16,1.29,.58],[.13,1.02,.56],[.33,.83,.34]],.026);gem(e.rig,.23,1.34,.53,.07);
  for(const side of [-1,1]){tube(e.rig,gold,[[side*.12,1.46,-.43],[side*.23,1.12,-.50],[side*.28,.77,-.44]],.012);star(e.rig,side*.16,1.16,-.54,.055).rotation.y=Math.PI;}
 }else if(id==='sakura'){
  torso();sleeves(cloth,true);hem(cream);
  panel(e.rig,cream,[[-.38,1.56],[-.23,1.62],[.27,1.15],[.18,1.04]],.48);panel(e.rig,cloth,[[.38,1.56],[.23,1.62],[-.25,1.13],[-.15,1.04]],.50);
  const belt=mesh(e.rig,new THREE.CylinderGeometry(.53,.48,.20,40,1,true),fabric('#9a7ca5'),0,.95,.03);belt.scale.z=1.05;ring(e.rig,gold,0,.97,.03,.535,.012);
  for(const side of [-1,1]){const bow=ball(e.rig,cloth,side*.19,1.01,-.56,.22,.15,.075);bow.rotation.z=side*.25;tube(e.rig,cream,[[side*.06,.98,-.62],[side*.15,.82,-.63],[side*.24,.74,-.59]],.04);}gem(e.rig,0,1.01,-.66,.06);
  for(const [x,y,z] of [[-.28,1.27,.48],[.31,.78,.42],[.23,1.30,-.48],[-.23,.77,-.45]])flower(e.rig,x,y,z,cream);
  flower(e.head,.49,.46,.28,cloth);flower(e.head,.39,.57,.26,cream);for(let i=0;i<3;i++)ball(e.head,gold,.53+i*.02,.31-i*.055,.29,.016,.018,.016);
 }else if(id==='aurora'){
  torso(navy);sleeves(navy,true);boots(cloth);hem(gold);
  const plate=mesh(e.rig,new THREE.SphereGeometry(.53,32,20,0,TAU,Math.PI*.22,Math.PI*.50),cloth,0,1.07,.04);plate.scale.set(1,1.0,1.02);
  tube(e.rig,gold,[[-.34,1.50,.34],[0,1.37,.59],[.34,1.50,.34]],.023);gem(e.rig,0,1.25,.61,.12);
  for(const side of [-1,1]){ball(e.arms[side===-1?0:1],cloth,side*.06,-.06,0,.23,.14,.23);ring(e.arms[side===-1?0:1],gold,side*.08,-.43,0,.19,.025);gem(e.arms[side===-1?0:1],side*.15,-.10,.17,.05);}
  const band=ring(e.head,gold,0,.57,0,.39,.026);gem(e.head,0,.65,.37,.09);for(const side of [-1,1]){const fin=mesh(e.head,new THREE.ConeGeometry(.10,.28,4),cloth,side*.36,.67,.05);fin.rotation.z=-side*.5;}
  for(const x of [-.23,0,.23]){const badge=gem(e.rig,x,1.12,-.54,.06);tube(e.rig,gold,[[x,.85,-.48],[x,1.03,-.55]],.01);}

 }
 e.refreshWardrobe?.();
}
