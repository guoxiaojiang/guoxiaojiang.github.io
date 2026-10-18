import * as THREE from './vendor/three.module.js';
const TAU=Math.PI*2;
export function buildAccessories(e,back='shellpack',waist='starcharm',outfit=e.outfitId){
 if(e.accessoryParts)for(const obj of e.accessoryParts){obj.parent?.remove(obj);obj.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});}
 e.accessoryParts=[];e.accessoryBackId=back;e.accessoryWaistId=waist;e.waistSwing=null;
 const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness:metalness?.35:.72,metalness});
 const gold=mat('#dcb66c',.55),cream=mat('#f7e7c5'),teal=mat('#8fbab2'),rose=mat('#d8aba4'),dark=mat('#617b72');
 const root=new THREE.Group();root.name='accessoryRoot';e.rig.add(root);e.accessoryParts.push(root);
 const mesh=(p,g,m,x=0,y=0,z=0)=>e.mesh(g,m,p,x,y,z);
 const ball=(p,m,x,y,z,sx,sy,sz)=>e.ball(p,m,x,y,z,sx,sy,sz);
 const tube=(p,m,points,r=.012)=>mesh(p,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(a=>new THREE.Vector3(...a))),Math.max(12,points.length*4),r,7,false),m);
 const torus=(p,m,x,y,z,r=.10,t=.012)=>mesh(p,new THREE.TorusGeometry(r,t,8,30),m,x,y,z);
 const star=(p,m,x,y,z,r=.12)=>{const sh=new THREE.Shape();for(let i=0;i<10;i++){let a=i*Math.PI/5+Math.PI/2,s=i%2?r*.44:r;const xx=Math.cos(a)*s,yy=Math.sin(a)*s;i?sh.lineTo(xx,yy):sh.moveTo(xx,yy);}sh.closePath();const o=mesh(p,new THREE.ExtrudeGeometry(sh,{depth:.025,bevelEnabled:true,bevelSize:.006,bevelThickness:.004,bevelSegments:2}),m,x,y,z);o.rotation.y=Math.PI;return o;};
 const crystal=new THREE.MeshPhysicalMaterial({color:'#b8dce6',metalness:.2,roughness:.13,clearcoat:1});
 const gem=(p,m,x,y,z,r=.06)=>mesh(p,new THREE.OctahedronGeometry(r,0),m,x,y,z);
 const backZ=['stars','astronaut','crystal','sakura'].includes(outfit)?-.94:-.62;
 if(back!=='none'){
  const pack=new THREE.Group();pack.name='backAccessory';pack.position.set(0,1.23,backZ);root.add(pack);
  if(back==='shellpack'){
   ball(pack,cream,0,0,0,.36,.39,.17);ball(pack,rose,0,.015,-.08,.33,.35,.13);
   for(let i=0;i<9;i++){const a=-1.28+i*.32,x=Math.sin(a)*.30,y=.015+Math.cos(a)*.31;tube(pack,cream,[[0,-.28,-.15],[x*.52,y*.25-.10,-.23],[x,y,-.155]],.009);}
   tube(pack,gold,[[-.32,-.06,-.07],[-.27,.24,-.10],[0,.36,-.08],[.27,.24,-.10],[.32,-.06,-.07]],.012);
   ball(pack,gold,0,-.275,-.15,.055,.04,.02);const handle=torus(pack,gold,0,.35,0,.085,.016);handle.scale.y=.65;
  }else if(back==='moonwings'){
   const feathers=mat('#e5eee1'),tips=mat('#c0d6ca');
   for(const side of [-1,1]){const wing=new THREE.Group();wing.position.x=side*.14;wing.rotation.z=-side*.14;pack.add(wing);for(let i=0;i<5;i++){const f=ball(wing,i%2?tips:feathers,side*(.18+i*.13),.04+i*.055,-.05,.15,.30-i*.022,.07);f.rotation.z=-side*(.35+i*.13);}tube(wing,gold,[[0,-.15,-.1],[side*.32,-.05,-.15],[side*.70,.18,-.08]],.009);}
   star(pack,gold,0,.02,-.13,.13);
  }else if(back==='rocket'){
   mesh(pack,new THREE.CylinderGeometry(.18,.18,.54,28),cream,0,0,0);mesh(pack,new THREE.ConeGeometry(.18,.23,28),teal,0,.385,0);
   const band=torus(pack,gold,0,-.22,0,.182,.022);band.rotation.x=Math.PI/2;
   const window=torus(pack,gold,0,.04,-.184,.075,.014);ball(pack,mat('#8bb8c3',.2),0,.04,-.184,.065,.065,.025);
   for(const side of [-1,1]){const shape=new THREE.Shape();shape.moveTo(0,.02);shape.lineTo(side*.29,-.27);shape.lineTo(side*.13,-.31);shape.closePath();mesh(pack,new THREE.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelSize:.015,bevelThickness:.01,bevelSegments:2}),teal,0,-.03,-.04);}
   const flame=ball(pack,mat('#e4ba73'),0,-.39,0,.07,.17,.07);flame.name='rocketCharmFlame';star(pack,gold,0,.16,-.195,.04);
  }else if(back==='butterfly'){
   const lilac=new THREE.MeshPhysicalMaterial({color:'#b6a1df',metalness:.14,roughness:.25,clearcoat:.85,side:THREE.DoubleSide});
   const inner=mat('#e5c6da',.18);
   for(const side of [-1,1]){for(const [y,sx,sy,x] of [[.18,.38,.37,.38],[-.24,.25,.27,.29]]){const wing=ball(pack,lilac,side*x,y,-.02,sx,sy,.055);wing.rotation.z=-side*.27;const inset=ball(pack,inner,side*x,y,-.075,sx*.72,sy*.72,.02);inset.rotation.z=-side*.27;tube(pack,gold,[[0,0,-.11],[side*x*.7,y*.65,-.13],[side*(x+sx*.7),y+sy*.27,-.075]],.009);gem(pack,crystal,side*(x+.08),y-.05,-.11,.045);}}
   ball(pack,gold,0,0,-.06,.05,.22,.045);for(const side of [-1,1])tube(pack,gold,[[0,.17,-.07],[side*.07,.29,-.09],[side*.14,.31,-.06]],.009);
  }else if(back==='harp'){
   tube(pack,gold,[[-.29,-.31,-.03],[-.36,.12,-.03],[-.13,.43,-.03],[.27,.29,-.03],[.33,-.31,-.03],[-.29,-.31,-.03]],.032);
   for(let i=0;i<7;i++){const x=-.21+i*.072;tube(pack,cream,[[x,-.28,-.035],[x,.31-Math.abs(x)*.45,-.035]],.005);}
   for(const side of [-1,1])gem(pack,crystal,side*.29,-.29,-.06,.07);gem(pack,crystal,-.06,.40,-.06,.08);star(pack,gold,.16,.22,-.07,.06);
  }else if(back==='planet'){
   const blue=mat('#9eafd8',.25);ball(pack,blue,0,0,0,.30,.30,.25);ball(pack,cream,-.10,.11,-.22,.08,.04,.017);
   const orbit=torus(pack,gold,0,0,-.035,.43,.025);orbit.rotation.set(.45,-.35,.32);ball(pack,crystal,.36,.22,-.10,.065,.065,.065);
   star(pack,gold,-.12,-.09,-.24,.065);for(const side of [-1,1])tube(pack,gold,[[side*.13,.33,0],[side*.08,.42,0],[side*.04,.40,0]],.012);

  }
  if(back==='shellpack'||back==='rocket')for(const side of [-1,1])tube(root,teal,[[side*.19,1.49,backZ],[side*.31,1.58,-.29],[side*.34,1.46,.35],[side*.36,1.18,.50]],.026);
 }
 if(waist!=='none'){
  const belt=torus(root,dark,0,.89,.03,.535,.022);belt.rotation.x=Math.PI/2;belt.scale.y=1.04;
  const buckle=mesh(root,new THREE.BoxGeometry(.12,.07,.025),gold,0,.89,.59);
  const swing=new THREE.Group();swing.name='waistAccessory';swing.position.set(outfit==='stars'?.66:.49,.88,outfit==='stars'?-.43:-.23);root.add(swing);e.waistSwing=swing;
  if(waist==='starcharm'){
   tube(root,gold,[[-.25,.91,-.49],[0,.79,-.56],[.28,.80,-.48],[.48,.88,-.28]],.009);
   for(let i=0;i<5;i++){const ring=torus(swing,gold,0,-i*.035,-.015,.025,.006);ring.rotation.y=i%2?Math.PI/2:0;}
   star(swing,gold,0,-.24,-.035,.105);ball(swing,teal,0,-.24,-.068,.022,.022,.01);
  }else if(waist==='fishpouch'){
   const body=ball(swing,teal,.015,-.16,-.015,.17,.11,.065);
   const sh=new THREE.Shape();sh.moveTo(.14,-.16);sh.lineTo(.25,-.07);sh.lineTo(.25,-.25);sh.closePath();mesh(swing,new THREE.ExtrudeGeometry(sh,{depth:.05,bevelEnabled:true,bevelSize:.008,bevelThickness:.004,bevelSegments:1}),teal,0,0,-.025);
   ball(swing,dark,-.07,-.14,-.075,.015,.015,.01);tube(swing,gold,[[-.10,-.09,-.04],[0,-.06,-.065],[.11,-.09,-.04]],.008);torus(swing,gold,0,-.015,0,.025,.007);
  }else if(waist==='bellcharm'){
   torus(swing,gold,0,0,0,.045,.010);
   for(let i=-1;i<=1;i++){tube(swing,rose,[[0,-.04,0],[i*.075,-.12,0],[i*.09,-.18+Math.abs(i)*.025,-.01]],.014);ball(swing,gold,i*.09,-.21+Math.abs(i)*.025,-.01,.052,.055,.048);tube(swing,dark,[[i*.09-.021,-.23+Math.abs(i)*.025,-.052],[i*.09+.021,-.23+Math.abs(i)*.025,-.052]],.004);}
  }else if(waist==='gemchain'){
   tube(root,gold,[[-.37,.90,-.38],[-.18,.75,-.54],[.12,.72,-.57],[.43,.84,-.36]],.009);
   for(let i=0;i<5;i++){const x=-.26+i*.13,y=.75+Math.abs(x)*.25;gem(root,crystal,x,y-.055,-.55,.038);}
   tube(swing,gold,[[0,0,0],[0,-.18,-.03]],.01);gem(swing,crystal,0,-.24,-.03,.085);
  }else if(waist==='moonbottle'){
   const glass=new THREE.MeshPhysicalMaterial({color:'#b5d5e9',metalness:.12,roughness:.16,clearcoat:1,transparent:true,opacity:.72});
   ball(swing,glass,0,-.20,0,.12,.16,.09);mesh(swing,new THREE.CylinderGeometry(.045,.05,.08,16),gold,0,-.035,0);torus(swing,gold,0,-.005,0,.035,.008);
   const moon=mesh(swing,new THREE.TorusGeometry(.045,.014,8,20,Math.PI*1.5),cream,0,-.18,-.095);moon.rotation.z=-.5;star(swing,gold,.025,-.27,-.09,.026);tube(swing,rose,[[-.055,-.08,-.03],[0,-.11,-.07],[.06,-.08,-.03]],.012);
  }else if(waist==='rosecharm'){
   for(let i=0;i<5;i++)ball(swing,cream,0,-i*.033,0,.021,.021,.021);
   for(let layer=0;layer<3;layer++)for(let i=0;i<5;i++){const a=i*TAU/5+layer*.5,r=.06-layer*.018;const petal=ball(swing,rose,Math.cos(a)*r,-.24+Math.sin(a)*r,-.03-layer*.018,.05-layer*.008,.033,-.015+layer*.003+.04);petal.rotation.z=a;}
   for(const side of [-1,1]){const leaf=ball(swing,teal,side*.08,-.29,.0,.07,.025,.02);leaf.rotation.z=side*.5;tube(swing,gold,[[0,-.06,0],[side*.08,-.10,0],[side*.11,-.04,0]],.013);}

  }
 }
 e.refreshWardrobe?.();
}
