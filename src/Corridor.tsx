import { useId } from 'react';
import './corridor.css';

type Props = { variant?: 'clean' | 'haunted'; approach?: number };
type RackProps = { nearX:number; farX:number; topNear:number; topFar:number; bottomNear:number; bottomFar:number; index:number; haunted:boolean };

function Rack({nearX,farX,topNear,topFar,bottomNear,bottomFar,index,haunted}:RackProps) {
  const interpolate=(near:number,far:number,at:number)=>near+(far-near)*at;
  const inset=(at:number)=>interpolate(nearX,farX,at);
  const rowPolygon=(t:number,height:number,start=.055,end=.95)=>{
    const n1=interpolate(topNear,bottomNear,t),f1=interpolate(topFar,bottomFar,t);
    const n2=interpolate(topNear,bottomNear,t+height),f2=interpolate(topFar,bottomFar,t+height);
    return `${inset(start)},${interpolate(n1,f1,start)} ${inset(end)},${interpolate(n1,f1,end)} ${inset(end)},${interpolate(n2,f2,end)} ${inset(start)},${interpolate(n2,f2,start)}`;
  };
  return <g className="corridor-rack">
    <polygon points={`${nearX},${topNear} ${farX},${topFar} ${farX},${bottomFar} ${nearX},${bottomNear}`} fill={index%2?'#172722':'#13231f'} stroke="#718078" strokeOpacity=".46" strokeWidth="1.1"/>
    <polygon points={rowPolygon(.018,.055,.025,.975)} fill="#35453e" stroke="#7a8e80" strokeOpacity=".3" strokeWidth=".7"/>
    <path d={`M${inset(.07)} ${interpolate(topNear,topFar,.07)+14}L${inset(.8)} ${interpolate(topNear,topFar,.8)+11}`} stroke="#a4b3a3" strokeOpacity=".25" strokeWidth="1"/>
    {Array.from({length:22},(_,i)=>{
      const t=.105+i*.037;
      const ledAt=.16;
      const ty=interpolate(interpolate(topNear,bottomNear,t+.013),interpolate(topFar,bottomFar,t+.013),ledAt);
      const ledX=inset(ledAt);
      return <g key={i}>
        <polygon points={rowPolygon(t,.026)} fill={i%5===0?'#263b31':'#1c2d25'} stroke="#8d9b8d" strokeOpacity=".2" strokeWidth=".65"/>
        <polygon points={rowPolygon(t+.006,.012,.32,.89)} fill="#091711" opacity=".8"/>
        <circle cx={ledX} cy={ty} r={Math.max(.8,Math.abs(farX-nearX)/100)} fill={haunted?(i%8===0?'#dd5941':'#23362b'):(i%7===0?'#deb783':'#b7dbad')} opacity={haunted?.75:.85}/>
        <circle cx={inset(.23)} cy={interpolate(interpolate(topNear,bottomNear,t+.013),interpolate(topFar,bottomFar,t+.013),.23)} r={Math.max(.5,Math.abs(farX-nearX)/150)} fill={haunted?'#283c30':'#70a488'} opacity=".7"/>
      </g>;
    })}
    <polygon points={rowPolygon(.945,.033)} fill="#081610" stroke="#97a68f" strokeOpacity=".25"/>
    <path d={`M${inset(.025)},${interpolate(topNear,topFar,.025)}L${inset(.025)},${interpolate(bottomNear,bottomFar,.025)}`} stroke="#b2bdad" strokeOpacity=".2" strokeWidth="3"/>
    <path d={`M${inset(.98)},${interpolate(topNear,topFar,.98)}L${inset(.98)},${interpolate(bottomNear,bottomFar,.98)}`} stroke="#020b07" strokeWidth="5" opacity=".65"/>
  </g>;
}

export default function Corridor({variant='clean',approach=0}:Props) {
  const uid=useId().replace(/:/g,'');
  const key=(name:string)=>`${uid}-${name}`;
  const fill=(name:string)=>`url(#${key(name)})`;
  const haunted=variant==='haunted';
  const distance=Math.max(0,Math.min(1,approach));
  const racks=[
    {nearX:-32,farX:154,topNear:78,topFar:207,bottomNear:1035,bottomFar:852},
    {nearX:165,farX:265,topNear:216,topFar:286,bottomNear:834,bottomFar:709},
    {nearX:273,farX:330,topNear:291,topFar:331,bottomNear:696,bottomFar:621},
    {nearX:336,farX:369,topNear:335,topFar:359,bottomNear:611,bottomFar:565},
  ];
  const figureScale=.42+distance*1.95;
  const figureY=518+distance*210;
  return <div className={`corridor-art corridor-art--${variant}`} aria-hidden="true">
    <svg className="corridor-scene" viewBox="0 0 900 1100" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <linearGradient id={key('room')} x1="0" y1="0" x2="0" y2="1"><stop stopColor={haunted?'#070a09':'#253d32'}/><stop offset=".5" stopColor={haunted?'#131815':'#718674'}/><stop offset="1" stopColor="#091912"/></linearGradient>
        <linearGradient id={key('ceiling')} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0b1c14"/><stop offset="1" stopColor="#536858"/></linearGradient>
        <linearGradient id={key('floor')} x1="0" y1="0" x2="0" y2="1"><stop stopColor={haunted?'#20241f':'#83927d'}/><stop offset=".36" stopColor={haunted?'#151a16':'#465c4c'}/><stop offset="1" stopColor="#152c20"/></linearGradient>
        <linearGradient id={key('door')} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#101e17"/><stop offset=".5" stopColor={haunted?'#171c17':'#637765'}/><stop offset="1" stopColor="#0d1d13"/></linearGradient>
        <radialGradient id={key('light')}><stop stopColor={haunted?'#aa9270':'#f4f2d1'} stopOpacity={haunted?'.16':'.54'}/><stop offset="1" stopColor="#d9e1bd" stopOpacity="0"/></radialGradient>
        <radialGradient id={key('vignette')}><stop offset=".35" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity={haunted?'.93':'.62'}/></radialGradient>
        <radialGradient id={key('figure')} cx=".5" cy=".2" r=".7"><stop stopColor="#1a1e19"/><stop offset=".5" stopColor="#070b08"/><stop offset="1" stopColor="#010402"/></radialGradient>
        <linearGradient id={key('reflection')} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dedfc2" stopOpacity=".17"/><stop offset="1" stopColor="#c2d2ae" stopOpacity="0"/></linearGradient>
        <filter id={key('haze')}><feGaussianBlur stdDeviation="22"/></filter>
        <filter id={key('soft')}><feGaussianBlur stdDeviation="2.4"/></filter>
        <filter id={key('texture')} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".67" numOctaves="3" seed="14" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".12"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter>
      </defs>
      <rect width="900" height="1100" fill={fill('room')}/>
      <path d="M0 0H900L551 368H349Z" fill={fill('ceiling')}/>
      <path d="M0 1100H900L551 491H349Z" fill={fill('floor')}/>
      <path d="M0 0L349 368V491L0 1100Z" fill="#12271c"/>
      <path d="M900 0L551 368V491L900 1100Z" fill="#11271b"/>
      <rect x="368" y="360" width="164" height="204" fill="#253c2b"/>
      <rect x="388" y="379" width="124" height="183" fill={fill('door')} stroke="#829179" strokeWidth="2" strokeOpacity=".33"/>
      <path d="M445 382V563M391 415H509" stroke="#aec0a2" strokeOpacity=".23"/>
      <rect x="448" y="450" width="5" height="16" rx="2" fill="#adb19a" opacity=".45"/>
      {Array.from({length:6},(_,i)=>{const top=17+i*58;const half=213-i*30;return <g key={i}><path d={`M${450-half} ${top}H${450+half}L${450+half-13} ${top+12}H${450-half+13}Z`} fill={haunted?(i%2?'#6c6b56':'#0c140e'):'#d4d7bb'} opacity={haunted?'.34':'.72'}/><path d={`M${450-half-42} ${top-8}H${450+half+42}`} stroke="#15291d" strokeWidth="7" opacity=".65"/></g>;})}
      <path d="M315 0L399 370M585 0L501 370" stroke="#0a1a11" strokeWidth="8"/>
      <path d="M309 0L396 370M591 0L504 370" stroke="#8b9c82" strokeWidth="1" opacity=".35"/>
      {racks.map((rack,index)=><Rack key={`left-${index}`} {...rack} index={index} haunted={haunted}/>)}
      <g transform="translate(900 0) scale(-1 1)">{racks.map((rack,index)=><Rack key={`right-${index}`} {...rack} index={index+1} haunted={haunted}/>)}</g>
      <path d="M122 1100L410 543M778 1100L490 543M281 1100L431 543M619 1100L469 543M450 1100V553" stroke="#adc0a2" strokeOpacity=".13" strokeWidth="1.4"/>
      {[597,655,737,852,1015].map((y,i)=><path key={y} d={`M${Math.max(0,349-(y-491)*.575)} ${y}H${Math.min(900,551+(y-491)*.575)}`} stroke="#0a2114" strokeWidth={1+i*.3} opacity=".7"/>)}
      <path d="M419 565L362 1100H538L481 565Z" fill={fill('reflection')} opacity={haunted?'.2':'1'}/>
      <ellipse cx="451" cy="330" rx="205" ry="375" fill={fill('light')} filter={fill('haze')} opacity={haunted?'.32':'.9'}/>
      <ellipse cx="448" cy="625" rx="96" ry="130" fill={fill('light')} filter={fill('haze')} opacity={haunted?'.13':'.35'}/>
      {haunted&&<g className="corridor-entity" transform={`translate(450 ${figureY}) scale(${figureScale})`}>
        <ellipse cx="0" cy="98" rx="88" ry="13" fill="#000" opacity=".83" filter={fill('soft')}/>
        <path d="M-19-35C-40-40-57-14-59 18L-61 68-82 115-73 119-49 82-32 45-28 115-34 155-17 157-9 110 2 63 13 110 16 157 32 157 31 102 27 42 41 80 62 120 71 116 55 67 51 22C50-1 35-23 20-24Z" fill={fill('figure')}/>
        <g className="corridor-face" transform="rotate(-7 0 -63)">
          <path d="M-12-26C-24-32-30-49-30-66-32-81-25-96-13-101-2-107 12-102 19-92 27-82 26-65 22-54 20-40 15-28 6-23-1-19-7-22-12-26Z" fill="#060a07"/>
          <path d="M-24-77C-29-65-25-46-17-38L-12-31-17-48-21-57Z" fill="#626852" opacity=".2"/>
          <path d="M18-74C23-64 20-46 11-33L9-29 13-46 17-54Z" fill="#686c58" opacity=".12"/>
          <path d="M-15-89Q-6-98 9-91L17-80 8-85-2-87Z" fill="#59614d" opacity=".11"/>
          <path d="M-20-73Q-14-77-8-72M5-72Q11-75 16-69" stroke="#010502" strokeWidth="4" fill="none" opacity=".9"/>
          <path d="M-17-70.5Q-14-72-10.5-70.7" stroke="#b9b49a" strokeWidth=".75" fill="none" opacity={.34+distance*.17}/>
          <circle cx="-13.7" cy="-70.9" r=".55" fill="#d5ccb0" opacity={.42+distance*.18}/>
          <path d="M8-68.2L11-68.7" stroke="#a6aa8c" strokeWidth=".6" opacity=".2"/>
          <circle cx="9.5" cy="-68.4" r=".35" fill="#c9c3a5" opacity=".26"/>
          <path d="M-1-69Q-5-58-2-54L2-55" stroke="#6d735a" strokeWidth=".65" fill="none" opacity=".28"/>
          <path d="M-9-46Q-2-42 9-48" stroke="#010402" strokeWidth="2.8" fill="none"/>
          <path d="M-6-42Q0-40 6-44M-15-60L-13-49M13-57L10-48" stroke="#575f49" strokeWidth=".65" fill="none" opacity=".25"/>
          <path d="M7-101C22-93 26-79 23-63L14-60 10-75 1-85Z" fill="#030704" opacity=".8"/>
        </g>
        <path d="M-79 111L-89 135M-76 115L-81 140M-71 115L-72 138M64 115L68 140M68 113L78 138M71 111L85 130" stroke="#050906" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M-20-13L-8 19-15 65M18-12L7 20 20 71" fill="none" stroke="#34402f" strokeWidth="1" opacity=".32"/>
      </g>}
      {haunted&&<path d="M32 0C73 98 18 162 56 233S39 360 65 457M871 0C820 161 884 252 849 382" stroke="#010603" strokeWidth="8" fill="none" opacity=".86"/>}
      <rect width="900" height="1100" fill={fill('vignette')}/>
      <rect width="900" height="1100" fill="#597458" opacity={haunted?'.025':'.065'} filter={fill('texture')}/>
      {haunted&&<rect width="900" height="1100" fill="#070504" opacity={.15+distance*.08}/>}
    </svg>
    <div className="corridor-grain"/>
    {!haunted&&<div className="corridor-camera-label"><span className="corridor-camera-dot"/> INFRASTRUCTURE, IN FOCUS <span>01 / 01</span></div>}
  </div>;
}
