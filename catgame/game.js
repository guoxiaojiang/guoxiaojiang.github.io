import { Runner3D } from './runner3d.js';
const $=id=>document.getElementById(id);
const LEVELS=[
 {name:'月光起跑',length:400,speed:8.0,interval:2.4,subtitle:'跳跃 · 换道',seed:3401,types:['log','crate','log'],pairChance:0,palette:'#9bb6b3'},
 {name:'浪花长廊',length:600,speed:9.5,interval:2.1,subtitle:'低杆 · 滑铲',seed:8659,types:['log','arch','crate','arch'],pairChance:.45,palette:'#b3a3bd'},
 {name:'星光冲刺',length:800,speed:11.0,interval:1.8,subtitle:'挡墙 · 组合',seed:1709,types:['wall','arch','crate','log'],pairChance:.45,palette:'#879eaf'},
 {name:'贝壳浅湾',length:650,speed:10.2,interval:1.9,subtitle:'金币 · 连跳',seed:4017,types:['log','log','crate'],pairChance:.32,palette:'#a5bcb0'},
 {name:'灯塔栈桥',length:750,speed:11.2,interval:1.8,subtitle:'横杆 · 节奏',seed:5189,types:['arch','arch','log','crate'],pairChance:.40,palette:'#baaab8'},
 {name:'珊瑚回廊',length:850,speed:11.7,interval:1.75,subtitle:'挡墙 · 换道',seed:6301,types:['wall','wall','crate','arch'],pairChance:.55,palette:'#a8acae'},
 {name:'流星海岬',length:950,speed:12.3,interval:1.7,subtitle:'连跳 · 滑铲',seed:7403,types:['log','crate','arch','arch'],pairChance:.55,palette:'#979fb6'},
 {name:'月光终点',length:1100,speed:13.0,interval:1.65,subtitle:'月光 · 挑战',seed:8219,types:['wall','arch','crate','log'],pairChance:.62,palette:'#9fa8bf'}
];
// Ten chapters share the painted coast; each stage has a stable route and rhythm.
const CHAPTERS=[
 {name:'月光海岸',palette:'#9bb6b3',water:'#83b7b4'},
 {name:'薄荷浅湾',palette:'#a5bcb0',water:'#85c1ad'},
 {name:'珊瑚秘境',palette:'#b7a6af',water:'#b2a3b5'},
 {name:'灯塔夜航',palette:'#9aa9b8',water:'#87aebc'},
 {name:'珍珠群岛',palette:'#b9bdb0',water:'#a4c9bf'},
 {name:'极光长廊',palette:'#a0b8ba',water:'#81b6bc'},
 {name:'流星海岬',palette:'#a7a5be',water:'#969fc6'},
 {name:'云上栈桥',palette:'#b3b9c4',water:'#9fbac9'},
 {name:'银河潮汐',palette:'#a2a9bf',water:'#8a96c4'},
 {name:'月之彼岸',palette:'#b2b8b0',water:'#a4c4b9'}
];
const ROUTES=[
 {name:'拾金小径',types:['log','crate','log'],subtitle:'金币 · 轻快',pair:.30,pace:-.7,coins:8},
 {name:'跃浪木桥',types:['log','log','crate'],subtitle:'连续 · 跳跃',pair:.38,pace:-.3,coins:6},
 {name:'低语长廊',types:['arch','arch','log'],subtitle:'横杆 · 滑铲',pair:.42,pace:0,coins:5},
 {name:'曲折海堤',types:['wall','wall','crate'],subtitle:'左右 · 换道',pair:.52,pace:-.1,coins:6},
 {name:'寻星航线',types:['crate','arch','log'],subtitle:'道具 · 寻宝',pair:.38,pace:.2,coins:8},
 {name:'潮声回旋',types:['arch','crate','arch','log'],subtitle:'跳跃 · 滑铲',pair:.46,pace:0,coins:6},
 {name:'珊瑚迷踪',types:['wall','log','wall','arch'],subtitle:'组合 · 换道',pair:.56,pace:.3,coins:5},
 {name:'追风栈道',types:['log','crate','arch'],subtitle:'节奏 · 冲刺',pair:.48,pace:.5,coins:6},
 {name:'星屑宝藏',types:['crate','log','wall'],subtitle:'金币 · 挑战',pair:.54,pace:.1,coins:9},
 {name:'月门试炼',types:['wall','arch','crate','log'],subtitle:'章节 · 试炼',pair:.64,pace:.6,coins:7}
];
for(let i=LEVELS.length;i<100;i++){
 const chapter=Math.floor(i/10),step=i%10,theme=CHAPTERS[chapter],route=ROUTES[step];
 LEVELS.push({name:i===99?'月光大团圆':theme.name.slice(0,2)+route.name,length:650+chapter*55+step*25,
  speed:Math.min(13.8,10.6+chapter*.28+route.pace),interval:Math.max(1.55,2.12-chapter*.042-step*.025),
  subtitle:route.subtitle,seed:104729+(i+1)*7919,types:route.types,pairChance:Math.min(.70,route.pair+chapter*.007),
  palette:theme.palette,waterTint:theme.water,coinCount:route.coins,coinPeriod:step===8?3:4,
  powerEvery:step===4?4:6,pairTypes:step===2?['arch','crate']:step===6?['wall','log']:['wall','crate']});
}
const PAGE_SIZE=10;
const levelNumber=i=>String(i+1).padStart(2,'0');
const SKINS=[{id:'ginger',name:'奶油小橘',price:0,color:'#e6b976',note:'最初的勇气，暖暖的橘色'},{id:'mint',name:'薄荷海风',price:80,color:'#a6c6b4',note:'像海风一样清爽的小猫'},{id:'moon',name:'月光奶白',price:160,color:'#efebdf',note:'把月亮的颜色穿在身上'}];
const OUTFITS=[{id:'scarf',name:'轻风围巾',price:0,color:'#7fa9a0',icon:'🧣',note:'最初的装扮，轻装上阵'},{id:'sailor',name:'月光水手服',price:40,color:'#789eae',icon:'⚓',note:'双线海军领、领结与金锚水手帽'},{id:'hoodie',name:'薄荷小卫衣',price:80,color:'#9ebba5',icon:'🧥',note:'针织袖口、抽绳与袋鼠大口袋'},{id:'stars',name:'星星魔法斗篷',price:120,color:'#9789b2',icon:'✦',note:'金边星纹、胸针与弯尖魔法帽'},{id:'raincoat',name:'柠檬小雨衣',price:100,color:'#e6bf59',icon:'☂',note:'防水雨帽、搭扣与配套小雨靴'},{id:'strawberry',name:'草莓背带裙',price:160,color:'#d49d9e',icon:'✿',note:'花朵发饰、背带纽扣与绣点裙摆'},{id:'astronaut',name:'云朵宇航服',price:200,color:'#deded5',icon:'☾',note:'透明头盔、控制面板与小背包'},{id:'aviator',name:'海风飞行夹克',price:240,color:'#967055',icon:'✈',note:'绒领皮夹克、护目镜与金色翼徽'}];
OUTFITS.push(...[
 {id:'crystal',name:'月辉水晶礼服',price:20,currency:'diamonds',color:'#abcddc',icon:'♢',note:'钻石珍藏 · 珍珠领、层叠裙摆与水晶小冠'},
 {id:'prince',name:'星海小王子',price:24,currency:'diamonds',color:'#667caa',icon:'♔',note:'钻石珍藏 · 金线礼服、肩章与宝石王冠'},
 {id:'sakura',name:'樱花和风衣',price:28,currency:'diamonds',color:'#dda8be',icon:'❀',note:'钻石珍藏 · 交叠衣领、樱花刺绣与蝴蝶结'},
 {id:'aurora',name:'极光小骑士',price:36,currency:'diamonds',color:'#8cbfc2',icon:'✧',note:'钻石珍藏 · 珠光铠甲、菱形晶石与护腕'}
]);
const BACKS=[{id:'none',name:'不戴背饰',price:0,color:'#c9d2bc',icon:'○',note:'轻装上阵，随时重新搭配'},{id:'shellpack',name:'贝壳小背包',price:0,color:'#d8aba4',icon:'🐚',note:'免费赠送 · 珍珠色贝壳与小金扣'},{id:'moonwings',name:'月光小翅膀',price:100,color:'#bfd7cb',icon:'ʚɞ',note:'层叠羽毛、金线与星星徽章'},{id:'butterfly',name:'琉光蝴蝶翼',price:16,currency:'diamonds',color:'#c1b0df',icon:'ʚɞ',note:'钻石珍藏 · 透亮双层蝶翼与金色脉络'},{id:'harp',name:'月弦水晶琴',price:20,currency:'diamonds',color:'#a8d3d1',icon:'♫',note:'钻石珍藏 · 弯月琴框、七根金弦与晶石'},{id:'planet',name:'银河星环包',price:24,currency:'diamonds',color:'#9aaed4',icon:'♄',note:'钻石珍藏 · 珠光星球、倾斜金环与小卫星'},{id:'rocket',name:'迷你火箭包',price:160,color:'#93bcb6',icon:'🚀',note:'圆圆舷窗、尾焰与小小侧翼'}].sort((a,b)=>Number(a.id==='none')-Number(b.id==='none'));
const WAISTS=[{id:'none',name:'不戴腰饰',price:0,color:'#c9d2bc',icon:'○',note:'取下腰间挂饰，衣服仍然保留'},{id:'starcharm',name:'星星腰链',price:0,color:'#d8bd7c',icon:'✦',note:'免费赠送 · 细金链与薄荷小宝石'},{id:'fishpouch',name:'小鱼腰包',price:70,color:'#8fbab2',icon:'🐟',note:'小鱼造型、金色拉链与扣环'},{id:'gemchain',name:'极光宝石腰链',price:10,currency:'diamonds',color:'#a0cbd1',icon:'♢',note:'钻石珍藏 · 垂坠金链与五颗切面晶石'},{id:'moonbottle',name:'月光许愿瓶',price:12,currency:'diamonds',color:'#acc8e4',icon:'☾',note:'钻石珍藏 · 水晶瓶身、金色瓶塞与小月亮'},{id:'rosecharm',name:'玫瑰珍珠挂饰',price:16,currency:'diamonds',color:'#ddaabb',icon:'❀',note:'钻石珍藏 · 层叠玫瑰、珍珠串与蝴蝶结'},{id:'bellcharm',name:'铃铛挂饰',price:90,color:'#d7aaa4',icon:'♧',note:'粉色细带、三颗金铃铛'}].sort((a,b)=>Number(a.id==='none')-Number(b.id==='none'));
let previewOutfit='scarf',previewBack='shellpack',previewWaist='starcharm',wardrobeTab='back';
const KEY='moonlight-cat-runner-v1';
let profile={diamonds:0,selectedBack:'shellpack',selectedWaist:'starcharm',ownedBack:['none','shellpack'],ownedWaist:['none','starcharm'],selectedOutfit:'scarf',ownedOutfits:['scarf'],wallet:0,unlocked:0,selectedSkin:'ginger',owned:['ginger'],records:LEVELS.map(()=>({best:0,stars:0}))};
try{let p=JSON.parse(localStorage.getItem(KEY));if(p&&Array.isArray(p.records)&&p.records.length>0){profile={...profile,...p};profile.wallet=Math.max(0,Math.floor(Number(profile.wallet)||0));profile.unlocked=Math.max(0,Math.min(LEVELS.length-1,Math.floor(Number(profile.unlocked)||0)));profile.owned=Array.isArray(profile.owned)?profile.owned.filter(s=>SKINS.some(k=>k.id===s)):['ginger'];if(!profile.owned.includes('ginger'))profile.owned.push('ginger');if(!profile.owned.includes(profile.selectedSkin))profile.selectedSkin='ginger';profile.records=LEVELS.map((_,i)=>{const r=p.records[i]||{};return {best:Math.max(0,Number(r.best)||0),stars:Math.max(0,Math.min(3,Math.floor(Number(r.stars)||0)))};});for(let i=0;i<LEVELS.length-1;i++)if(profile.records[i].stars>0)profile.unlocked=Math.max(profile.unlocked,i+1);}}catch{}
profile.diamonds=Number.isFinite(Number(profile.diamonds))?Math.max(0,Math.floor(Number(profile.diamonds))):0;
profile.ownedOutfits=Array.isArray(profile.ownedOutfits)?profile.ownedOutfits.filter(id=>OUTFITS.some(o=>o.id===id)):['scarf'];if(!profile.ownedOutfits.includes('scarf'))profile.ownedOutfits.unshift('scarf');if(!profile.ownedOutfits.includes(profile.selectedOutfit))profile.selectedOutfit='scarf';
for(const [catalog,ownedKey,selectedKey,free] of [[BACKS,'ownedBack','selectedBack','shellpack'],[WAISTS,'ownedWaist','selectedWaist','starcharm']]){profile[ownedKey]=Array.isArray(profile[ownedKey])?profile[ownedKey].filter(id=>catalog.some(c=>c.id===id)):[];for(const id of ['none',free])if(!profile[ownedKey].includes(id))profile[ownedKey].push(id);if(!profile[ownedKey].includes(profile[selectedKey]))profile[selectedKey]=free;}
let engine,phase='menu',selectedLevel=profile.unlocked,lane=1,jump=0,jumpVelocity=0,slideTimer=0,distance=0,coins=0,lives=3,hits=0,shield=0,magnet=0,invincible=0,spawnTimer=0,lastTime=0,worldTime=0,countdownTimer=0,lastCountdown='',row=0,rngSeed=1,toastTimer,helpPaused=false,sound=false,audioCtx,lastCoinTone=0,bestAtStart=0;
let rewarded=false,finalWon=false,levelPage=Math.floor(selectedLevel/PAGE_SIZE);
const boostSources=new Set();let speedFactor=1,hudClock=0,lastCoinPop=-1;
function setBoost(source,on){if(on&&(phase==='running'||phase==='countdown'))boostSources.add(source);else boostSources.delete(source);hud();}
function clearBoost(){boostSources.clear();speedFactor=1;}
function boostKey(code){return code==='ArrowUp'||code==='KeyW';}
function handleKeyDown(e){
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();
 if(boostKey(e.code)){setBoost('keyboard',true);return;}
 if(e.repeat)return;
 if(e.code==='KeyP'||e.code==='Escape'){if(phase==='running'||phase==='countdown')pause();else if(phase==='paused'||phase==='paused-countdown')resume();return;}
 if(e.code==='ArrowLeft'||e.code==='KeyA')move(-1);if(e.code==='ArrowRight'||e.code==='KeyD')move(1);if(e.code==='Space')doJump();if(['ArrowDown','KeyS'].includes(e.code))doSlide();
}
function handleKeyUp(e){if(boostKey(e.code)){e.preventDefault();setBoost('keyboard',false);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(profile));$('saveStatus').textContent='关卡与金币已保存';}catch{$('saveStatus').textContent='无法保存进度，请保持本页打开';}}
const currencyKey=item=>item.currency==='diamonds'?'diamonds':'wallet';
const currencyName=item=>item.currency==='diamonds'?'钻石':'金币';
const canAfford=item=>profile[currencyKey(item)]>=item.price;
const priceLabel=item=>canAfford(item)?item.price+' '+currencyName(item)+'购买':'还差 '+(item.price-profile[currencyKey(item)])+' '+currencyName(item);
function payFor(item){if(!canAfford(item))return false;profile[currencyKey(item)]-=item.price;return true;}
function renderExchange(){
 $('shopWallet').textContent=profile.wallet;$('shopDiamonds').textContent=profile.diamonds;
 const max=Math.floor(profile.wallet/10);$('exchangeOne').disabled=max<1;$('exchangeTen').disabled=max<10;$('exchangeMax').disabled=max<1;
 $('exchangeMax').textContent=max>0?'最多换 '+max+' 颗':'金币不足';
 $('exchangeHint').textContent=max>0?'现有金币最多可换 '+max+' 颗钻石，剩余 '+profile.wallet%10+' 枚金币。':'跑酷攒到 10 枚金币，就能兑换第一颗钻石。';
}
function exchangeDiamonds(amount){
 const count=amount==='max'?Math.floor(profile.wallet/10):Number(amount);
 if(!Number.isSafeInteger(count)||count<1||count>Math.floor(profile.wallet/10))return false;
 profile.wallet-=count*10;profile.diamonds+=count;save();renderShop();renderMenu();
 $('wardrobeMessage').textContent='兑换成功！'+count*10+' 枚金币 → '+count+' 颗钻石。';chime(1100,.2);return true;
}
function random(){rngSeed=(Math.imul(1664525,rngSeed)+1013904223)>>>0;return rngSeed/4294967296;}
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3100);}
function chime(f=780,duration=.13){if(!sound||!audioCtx)return;try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.03,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}catch{}}
function hud(){const boosting=phase==='running'&&boostSources.size>0;$('boostButton').classList.toggle('active',boosting);$('boostButton').setAttribute('aria-pressed',String(boosting));$('speedStatus').textContent=(boosting?'加速中 ':'速度 ')+speedFactor.toFixed(1)+'×';$('speedStatus').classList.toggle('active',boosting);const cfg=LEVELS[selectedLevel];$('distance').textContent=Math.min(cfg.length,Math.floor(distance));$('targetDistance').textContent=cfg.length;$('distanceBar').style.width=Math.min(100,distance/cfg.length*100)+'%';$('coins').textContent=coins;$('hearts').textContent=Array.from({length:3},(_,i)=>i<lives?'♥':'♡').join(' ');$('hearts').setAttribute('aria-label','剩余 '+lives+' 条生命');$('levelLabel').textContent=levelNumber(selectedLevel)+' · '+cfg.name;for(const [id,value] of [['shieldStatus',shield],['magnetStatus',magnet]]){$(id).hidden=value<=0;$(id).querySelector('b').textContent=Math.ceil(value);}$('pauseButton').disabled=!['running','countdown','paused'].includes(phase);}
function selectLevel(i){if(i<0||i>profile.unlocked||i>=LEVELS.length)return;selectedLevel=i;levelPage=Math.floor(i/PAGE_SIZE);engine?.reset(i);engine?.setStage?.(LEVELS[i]);applySkin();hud();renderMenu();}
function changeLevelPage(delta){levelPage=Math.max(0,Math.min(CHAPTERS.length-1,levelPage+delta));renderMenu();}
function renderMenu(){
 $('wallet').textContent=profile.wallet;$('menuDiamonds').textContent=profile.diamonds;
 $('levelProgress').textContent='已通关 '+profile.records.filter(r=>r.stars>0).length+' / '+LEVELS.length+' 关';
 const first=levelPage*PAGE_SIZE,last=Math.min(first+PAGE_SIZE,LEVELS.length);
 $('chapterSelect').replaceChildren();CHAPTERS.forEach((chapter,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=`${i+1}. ${chapter.name} · ${i*PAGE_SIZE+1}–${Math.min((i+1)*PAGE_SIZE,LEVELS.length)} 关`;$('chapterSelect').append(option);});
 $('chapterSelect').value=String(levelPage);$('previousPage').disabled=levelPage===0;$('nextPage').disabled=last===LEVELS.length;
 $('pageStatus').textContent=`第 ${levelPage+1} / ${CHAPTERS.length} 页 · 共 ${LEVELS.length} 关`;
 $('currentLevel').textContent='回到当前关 · 第 '+(profile.unlocked+1)+' 关 ↗';
 $('levelCards').replaceChildren();
 LEVELS.slice(first,last).forEach((cfg,offset)=>{const i=first+offset,b=document.createElement('button'),locked=i>profile.unlocked;
  b.className='level-card'+(selectedLevel===i?' active':'');b.disabled=locked;b.setAttribute('aria-pressed',String(selectedLevel===i));b.setAttribute('aria-label',`第 ${i+1} 关 ${cfg.name}，${locked?'尚未解锁':cfg.length+' 米'}`);
  const num=document.createElement('strong');num.textContent=levelNumber(i);
  const name=document.createElement('b');name.textContent=cfg.name;
  const sub=document.createElement('small');sub.textContent=cfg.length+'m · '+cfg.subtitle;
  const stars=document.createElement('div');stars.className='stars';stars.textContent=locked?'⌑ 待解锁':'✦'.repeat(profile.records[i].stars)+'·'.repeat(3-profile.records[i].stars);
  b.append(num,name,sub,stars);b.onclick=()=>selectLevel(i);$('levelCards').append(b);
 });
 $('startButton').firstChild.textContent='开始第 '+(selectedLevel+1)+' 关 ';
}
function closeAll(){document.querySelectorAll('dialog[open]').forEach(d=>d.close());}
function applySkin(){if(!engine)return;const c=SKINS.find(s=>s.id===profile.selectedSkin)?.color||SKINS[0].color;engine.pet.traverse(o=>{if(o.isMesh&&o.material.color&&o.material.color.getHexString()==='e6b976')o.material.color.set(c);});engine.setOutfit?.(profile.selectedOutfit);engine.setAccessories?.(profile.selectedBack,profile.selectedWaist,profile.selectedOutfit);}
function startLevel(index=selectedLevel){if(!engine)return;selectedLevel=Math.max(0,Math.min(profile.unlocked,Math.floor(index)));levelPage=Math.floor(selectedLevel/PAGE_SIZE);closeAll();clearBoost();phase='countdown';lane=1;jump=0;jumpVelocity=0;slideTimer=0;distance=0;coins=0;lives=3;hits=0;shield=0;magnet=0;invincible=0;spawnTimer=.7;row=0;rngSeed=LEVELS[selectedLevel].seed;rewarded=false;bestAtStart=profile.records[selectedLevel].best;engine.reset(selectedLevel);engine.setStage?.(LEVELS[selectedLevel]);countdownTimer=3.25;lastCountdown='';$('countdown').hidden=false;$('toast').classList.remove('visible');engine.pet.visible=true;hud();}
function move(dir){if(phase!=='running')return;const next=Math.max(0,Math.min(2,lane+dir));if(next!==lane){lane=next;chime(300+lane*65,.06);}}
function doJump(){if(phase!=='running'||jump>.01||slideTimer>0)return;jumpVelocity=6.6;chime(460,.15);}
function doSlide(){if(phase!=='running'||jump>.01)return;slideTimer=.8;chime(230,.1);}
function pause(){if(!['running','countdown'].includes(phase))return;clearBoost();phase=phase==='countdown'?'paused-countdown':'paused';$('pauseDialog').showModal();hud();}
function resume(){if(!phase.startsWith('paused'))return;phase=phase==='paused-countdown'?'countdown':'running';$('pauseDialog').close();hud();}
function home(){closeAll();clearBoost();if((phase==='running'||phase.startsWith('paused'))&&!rewarded){profile.wallet+=coins;profile.records[selectedLevel].best=Math.max(profile.records[selectedLevel].best,Math.floor(distance));rewarded=true;save();}phase='menu';levelPage=Math.floor(selectedLevel/PAGE_SIZE);engine?.reset(selectedLevel);engine?.setStage?.(LEVELS[selectedLevel]);renderMenu();hud();$('menuDialog').showModal();}
function finish(won){if(phase!=='running')return;phase='result';clearBoost();finalWon=won;const cfg=LEVELS[selectedLevel],record=profile.records[selectedLevel];record.best=Math.max(record.best,Math.min(cfg.length,Math.floor(distance)));let stars=won?1+(coins>=20?1:0)+(hits===0?1:0):0;if(won){record.stars=Math.max(record.stars,stars);profile.unlocked=Math.max(profile.unlocked,Math.min(LEVELS.length-1,selectedLevel+1));}if(!rewarded){profile.wallet+=coins;rewarded=true;}save();$('resultKicker').textContent=won?'COAST CLEAR!':'ONE MORE LITTLE TRY';$('resultStars').textContent=won?'✦'.repeat(stars)+'✧'.repeat(3-stars):'♡';$('resultTitle').textContent=won?(selectedLevel===LEVELS.length-1?'百关通关，月光为你喝彩！':'海风为你喝彩！'):'拍拍灰尘，再来一次。';$('resultMessage').textContent=won?cfg.name+'已完成！小猫成功跑到了终点。':'这次跑了 '+Math.floor(distance)+' 米。试着跟随金币路线绕开障碍吧。';$('resultDistance').textContent=Math.min(cfg.length,Math.floor(distance));$('resultCoins').textContent=coins;$('resultBest').textContent=record.best;$('unlockMessage').textContent=won?(selectedLevel<LEVELS.length-1?'下一关「'+LEVELS[selectedLevel+1].name+'」已解锁。':'100 关全部完成！你是月光海岸的跑酷小英雄。还可以回来收集三星！'):'本次收集的金币已存入钱包，随时可去衣橱换装。';$('nextButton').hidden=!won;$('nextButton').textContent=selectedLevel<LEVELS.length-1?'前往下一关 ↗':'回到海岸地图 ↗';$('resultDialog').showModal();hud();chime(won?880:240,.4);}
function spawnRow(){const cfg=LEVELS[selectedLevel];let blocked=Math.floor(random()*3),clear=(blocked+1+Math.floor(random()*2))%3;const types=cfg.types;let type=types[Math.floor(random()*types.length)];engine.spawn(type,blocked,-64);if(row>3&&selectedLevel>0&&random()<cfg.pairChance){const other=3-blocked-clear;const pairs=cfg.pairTypes;engine.spawn(pairs?pairs[Math.floor(random()*pairs.length)]:selectedLevel>=2&&random()<.45?'wall':'crate',other,-64);}
  const coinLane=row%(cfg.coinPeriod||4)===0&&type!=='wall'&&type!=='arch'?blocked:clear;for(let i=0;i<(cfg.coinCount||(selectedLevel===3?7:5));i++){const e=engine.spawn('coin',coinLane,-57-i*1.2);e.height=coinLane===blocked&&type!=='wall'&&type!=='arch'?2.0:.95;}
  const powerEvery=cfg.powerEvery||6;if(row%powerEvery===2)engine.spawn(Math.floor(row/powerEvery)%2===0?'shield':'magnet',clear,-70);
  row++;spawnTimer=cfg.interval+random()*.2;
}
function collide(){const px=engine.pet.position.x;
 for(const e of engine.entities){const dz=e.mesh.position.z-3,dx=Math.abs(e.mesh.position.x-px);if(e.collected)continue;
  if(e.type==='coin'){
   if(magnet>0&&Math.abs(dz)<6){e.mesh.position.x+=(px-e.mesh.position.x)*.22;}
   const close=(magnet>0?Math.abs(dz)<1.7:Math.abs(dz)<.85&&dx<.58&&Math.abs((e.height||.95)-(jump+.95))<1.1);
   if(close){e.collected=true;coins++;if(worldTime-lastCoinPop>.12){lastCoinPop=worldTime;$('coinPop').textContent='+1';$('coinPop').classList.remove('pop');void $('coinPop').offsetWidth;$('coinPop').classList.add('pop');}if(worldTime-lastCoinTone>.07){lastCoinTone=worldTime;chime(820+(coins%5)*65,.09);}}
  }else if(e.type==='shield'||e.type==='magnet'){if(Math.abs(dz)<.85&&dx<.65){e.collected=true;if(e.type==='shield'){shield=10;toast('◇ 月光护盾！可挡住一次碰撞');}else{magnet=8;toast('∩ 金币磁铁！附近金币会自动飞来');}chime(1080,.25);}}
  else if(!e.passed&&Math.abs(dz)<.62&&dx<.68){e.passed=true;const safe=e.type==='arch'?slideTimer>0:e.type==='wall'?false:jump>(e.type==='crate'?.95:.65);if(!safe&&invincible<=0){if(shield>0){shield=0;invincible=1.2;toast('护盾挡住了碰撞！继续向前！');chime(510,.2);}else{lives--;hits++;invincible=2;$('flash').classList.add('hit');setTimeout(()=>$('flash').classList.remove('hit'),250);toast(e.type==='arch'?'横杆要滑铲通过：按 ↓ 或点「滑铲」':e.type==='wall'?'挡墙不能跳过：按 ← → 换道':'木头和木箱要跳过去：按空格或点「跳跃」');chime(160,.25);if(lives<=0){finish(false);break;}}}}
 }
}
function renderOutfits(){
 $('outfitCards').replaceChildren();
 for(const o of OUTFITS){const card=document.createElement('div');card.className='outfit-card'+(o.currency==='diamonds'?' premium':'')+(previewOutfit===o.id?' trying':'');
  const icon=document.createElement('span');icon.className='outfit-icon';icon.textContent=o.icon;icon.style.background=o.color;
  const info=document.createElement('div'),name=document.createElement('strong'),note=document.createElement('small');name.textContent=o.name;note.textContent=o.note;info.append(name,note);
  const actions=document.createElement('div');actions.className='outfit-actions';const tryButton=document.createElement('button');tryButton.textContent=previewOutfit===o.id?'试穿中':'试穿';tryButton.setAttribute('aria-label','试穿'+o.name);tryButton.onclick=()=>{previewOutfit=o.id;renderOutfits();$('wardrobeCanvas').scrollIntoView?.({behavior:'smooth',block:'center'});};
  const buy=document.createElement('button');buy.className='buy-outfit';const owned=profile.ownedOutfits.includes(o.id);buy.textContent=profile.selectedOutfit===o.id?'已穿上':owned?'穿上':priceLabel(o);buy.disabled=profile.selectedOutfit===o.id||(!owned&&!canAfford(o));buy.setAttribute('aria-label',(owned?'穿上':'购买并穿上')+o.name);
  buy.onclick=()=>{if(!profile.ownedOutfits.includes(o.id)){if(!payFor(o))return;profile.ownedOutfits.push(o.id);}profile.selectedOutfit=o.id;previewOutfit=o.id;applySkin();save();renderShop();renderMenu();$('wardrobeMessage').textContent='已穿上「'+o.name+'」！下次跑酷就穿这套。';};actions.append(tryButton,buy);card.append(icon,info,actions);$('outfitCards').append(card);
 }
 applyPreview();
}
function applyPreview(){engine?.setOutfit?.(previewOutfit);engine?.setAccessories?.(previewBack,previewWaist,previewOutfit);$('previewName').textContent=OUTFITS.find(o=>o.id===previewOutfit)?.name||'';$('accessorySummary').textContent='背饰 · '+(BACKS.find(o=>o.id===previewBack)?.name||'无')+'　 /　 腰饰 · '+(WAISTS.find(o=>o.id===previewWaist)?.name||'无');}
function accessorySlot(slot){return slot==='back'?{items:BACKS,owned:'ownedBack',selected:'selectedBack',target:'backCards'}:{items:WAISTS,owned:'ownedWaist',selected:'selectedWaist',target:'waistCards'};}
function tryAccessory(slot,id){const cfg=accessorySlot(slot);if(!cfg.items.some(o=>o.id===id))return;if(slot==='back')previewBack=id;else previewWaist=id;renderAccessorySlot(slot);applyPreview();$('wardrobeCanvas').scrollIntoView?.({behavior:'smooth',block:'center'});}
function equipAccessory(slot,id){const cfg=accessorySlot(slot),item=cfg.items.find(o=>o.id===id);if(!item)return false;if(!profile[cfg.owned].includes(id)){if(!payFor(item))return false;profile[cfg.owned].push(id);}profile[cfg.selected]=id;if(slot==='back')previewBack=id;else previewWaist=id;applySkin();save();renderShop();renderMenu();$('wardrobeMessage').textContent=id==='none'?'已取下'+(slot==='back'?'背饰':'腰饰')+'。':'已戴上「'+item.name+'」，可以穿着去跑酷啦！';return true;}
function renderAccessorySlot(slot){const cfg=accessorySlot(slot),current=slot==='back'?previewBack:previewWaist;$(cfg.target).replaceChildren();for(const o of cfg.items){const card=document.createElement('div');card.className='outfit-card'+(o.currency==='diamonds'?' premium':'')+(current===o.id?' trying':'');const icon=document.createElement('span');icon.className='outfit-icon';icon.style.background=o.color;icon.textContent=o.icon;const info=document.createElement('div'),name=document.createElement('strong'),note=document.createElement('small');name.textContent=o.name;note.textContent=o.note;info.append(name,note);const actions=document.createElement('div');actions.className='outfit-actions';const trial=document.createElement('button');trial.textContent=current===o.id?'试戴中':'试戴';trial.setAttribute('aria-label',o.id==='none'?'预览取下'+(slot==='back'?'背饰':'腰饰'):'试戴'+o.name);trial.onclick=()=>tryAccessory(slot,o.id);const buy=document.createElement('button');buy.className='buy-outfit';const owned=profile[cfg.owned].includes(o.id),selected=profile[cfg.selected]===o.id;buy.textContent=selected?(o.id==='none'?'已取下':'已戴上'):owned?(o.id==='none'?'取下':'戴上'):priceLabel(o);buy.disabled=selected||(!owned&&!canAfford(o));buy.setAttribute('aria-label',o.id==='none'?'取下'+(slot==='back'?'背饰':'腰饰'):(owned?'佩戴':'购买并佩戴')+o.name);buy.onclick=()=>equipAccessory(slot,o.id);actions.append(trial,buy);card.append(icon,info,actions);$(cfg.target).append(card);}}
function setWardrobeTab(tab){wardrobeTab=tab;for(const name of ['outfit','back','waist','skin']){$(name+'Section').hidden=name!==tab;$(name+'Tab').classList.toggle('active',name===tab);$(name+'Tab').setAttribute('aria-pressed',String(name===tab));}}
function closeShop(){applySkin();$('shopDialog').close();}
function renderShop(){renderExchange();renderOutfits();renderAccessorySlot('back');renderAccessorySlot('waist');setWardrobeTab(wardrobeTab);$('shopWallet').textContent=profile.wallet;$('skinCards').replaceChildren();for(const s of SKINS){const card=document.createElement('div');card.className='skin-card';const color=document.createElement('div');color.className='skin-color';color.style.background=s.color;const info=document.createElement('div'),title=document.createElement('strong'),sub=document.createElement('small');title.textContent=s.name;sub.textContent=s.note;info.append(title,sub);const btn=document.createElement('button');const owned=profile.owned.includes(s.id);btn.textContent=profile.selectedSkin===s.id?'已穿上':owned?'穿上':s.price+' 金币';btn.disabled=profile.selectedSkin===s.id||(!owned&&profile.wallet<s.price);btn.onclick=()=>{if(!profile.owned.includes(s.id)){if(profile.wallet<s.price)return;profile.wallet-=s.price;profile.owned.push(s.id);}profile.selectedSkin=s.id;engine.setPet();applySkin();save();renderShop();renderMenu();};card.append(color,info,btn);$('skinCards').append(card);}}
$('exchangeOne').onclick=()=>exchangeDiamonds(1);$('exchangeTen').onclick=()=>exchangeDiamonds(10);$('exchangeMax').onclick=()=>exchangeDiamonds('max');
$('previousPage').onclick=()=>changeLevelPage(-1);$('nextPage').onclick=()=>changeLevelPage(1);$('chapterSelect').onchange=()=>{const next=Number($('chapterSelect').value);if(Number.isInteger(next)&&next>=0&&next<CHAPTERS.length){levelPage=next;renderMenu();}};$('currentLevel').onclick=()=>selectLevel(profile.unlocked);
$('startButton').onclick=()=>startLevel();$('leftButton').onclick=()=>move(-1);$('rightButton').onclick=()=>move(1);$('jumpButton').onclick=doJump;$('slideButton').onclick=doSlide;$('pauseButton').onclick=pause;$('resumeButton').onclick=resume;$('restartButton').onclick=()=>startLevel();$('homeButton').onclick=home;$('retryButton').onclick=()=>startLevel();$('resultHome').onclick=home;$('nextButton').onclick=()=>{if(selectedLevel<LEVELS.length-1)startLevel(selectedLevel+1);else home();};
$('helpButton').onclick=()=>{helpPaused=['running','countdown'].includes(phase);if(helpPaused){clearBoost();phase=phase==='countdown'?'paused-help-countdown':'paused-help';}$('helpDialog').showModal();};
function closeHelp(){$('helpDialog').close();if(helpPaused){clearBoost();phase=phase==='paused-help-countdown'?'countdown':'running';helpPaused=false;}hud();}
$('closeHelp').onclick=closeHelp;$('helpDialog').querySelector('.close').onclick=closeHelp;$('helpDialog').addEventListener('cancel',e=>{e.preventDefault();closeHelp();});
$('shopButton').onclick=()=>{previewOutfit=profile.selectedOutfit;previewBack=profile.selectedBack;previewWaist=profile.selectedWaist;renderShop();$('shopDialog').showModal();engine?.mountWardrobe?.($('wardrobeCanvas'));};$('shopDialog').querySelector('.close').onclick=closeShop;$('shopDialog').addEventListener('cancel',e=>{e.preventDefault();closeShop();});$('wearAndRun').onclick=closeShop;
for(const tab of ['outfit','back','waist','skin'])$(tab+'Tab').onclick=()=>setWardrobeTab(tab);
$('menuDialog').addEventListener('cancel',e=>e.preventDefault());$('resultDialog').addEventListener('cancel',e=>e.preventDefault());$('pauseDialog').addEventListener('cancel',e=>{e.preventDefault();resume();});
$('soundButton').onclick=async()=>{try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();sound=!sound;$('soundButton').textContent=sound?'♪':'♫';$('soundButton').setAttribute('aria-label',sound?'关闭音效':'开启音效');$('soundButton').classList.toggle('active',sound);if(sound)chime();}catch{toast('当前浏览器暂时无法播放音效。');}};
document.addEventListener('keydown',handleKeyDown);
document.addEventListener('keyup',handleKeyUp);
window.addEventListener('blur',()=>{clearBoost();pause();});
const boostButton=$('boostButton');
boostButton.addEventListener('pointerdown',e=>{e.preventDefault();boostButton.setPointerCapture?.(e.pointerId);setBoost('pointer',true);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])boostButton.addEventListener(name,()=>setBoost('pointer',false));
boostButton.addEventListener('keydown',e=>{if(e.code==='Enter'){e.preventDefault();e.stopPropagation();setBoost('button-key',true);}});
boostButton.addEventListener('keyup',e=>{if(e.code==='Enter'){e.preventDefault();e.stopPropagation();setBoost('button-key',false);}});
let touchStart=null;$('world').addEventListener('pointerdown',e=>{touchStart={x:e.clientX,y:e.clientY};});$('world').addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;if(Math.max(Math.abs(dx),Math.abs(dy))<22){doJump();return;}if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);else if(dy<0)doJump();else doSlide();});$('world').addEventListener('pointercancel',()=>touchStart=null);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('pagehide',()=>{if(!rewarded&&(phase==='running'||phase.startsWith('paused'))){profile.wallet+=coins;profile.records[selectedLevel].best=Math.max(profile.records[selectedLevel].best,Math.floor(distance));rewarded=true;}save();});
function frame(now){const dt=lastTime?Math.min((now-lastTime)/1000,.04):0;lastTime=now;const active=phase==='running';if(!phase.startsWith('paused'))worldTime+=dt;
 if(phase==='countdown'){countdownTimer-=dt;const text=countdownTimer>.5?String(Math.ceil(countdownTimer-.5)):'出发！';if(text!==lastCountdown){lastCountdown=text;$('countdown').textContent=text;chime(text==='出发！'?880:440,.18);}if(countdownTimer<=0){$('countdown').hidden=true;phase='running';toast('跟着金币走，遇到障碍记得跳跃或换道！');for(let i=0;i<9;i++)engine.spawn('coin',1,-3-i*1.4);}}
 if(active){speedFactor+=( (boostSources.size?1.65:1)-speedFactor)*(1-Math.exp(-dt*6));distance+=dt*LEVELS[selectedLevel].speed*speedFactor;spawnTimer-=dt*speedFactor;if(spawnTimer<=0&&distance<LEVELS[selectedLevel].length-55)spawnRow();shield=Math.max(0,shield-dt);magnet=Math.max(0,magnet-dt);invincible=Math.max(0,invincible-dt);slideTimer=Math.max(0,slideTimer-dt);if(jumpVelocity!==0||jump>0){jump+=jumpVelocity*dt;jumpVelocity-=15*dt;if(jump<=0){jump=0;jumpVelocity=0;}}}
 engine?.update(dt,worldTime,{running:active,speed:LEVELS[selectedLevel].speed*speedFactor,boost:speedFactor-1,lane,jump,slide:slideTimer>0,shield,invincible,wardrobe:$('shopDialog').open});if(active){collide();if(distance>=LEVELS[selectedLevel].length&&phase==='running')finish(true);}hudClock+=dt;if(hudClock>.08){hudClock=0;hud();}requestAnimationFrame(frame);
}
try{engine=new Runner3D($('world'));engine.reset(selectedLevel);engine.setStage?.(LEVELS[selectedLevel]);applySkin();renderMenu();hud();$('menuDialog').showModal();requestAnimationFrame(frame);}catch(error){console.error('Unable to start the 3D runner',error);$('errorPanel').hidden=false;}
