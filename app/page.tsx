"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Role = "Director" | "Actor" | "Writer" | "Producer" | "Craft";
type Kind = "Film" | "Television" | "Streaming";
type Person = { id:string; name:string; role:Role; x:number; y:number; about:string };
type Project = { id:string; title:string; wiki?:string; year:number; kind:Kind; people:string[] };
type Hover = { type:"person"|"project"|"relationship"; id:string; x:number; y:number } | null;

const colors:Record<Role,string>={Director:"#2457e6",Actor:"#ff6b5e",Writer:"#8d4ed8",Producer:"#2f9f94",Craft:"#c89024"};
const people:Person[]=[
 {id:"nolan",name:"Christopher Nolan",role:"Director",x:585,y:390,about:"Writer-director known for large-scale stories about time, memory, and moral choices."},
 {id:"murphy",name:"Cillian Murphy",role:"Actor",x:850,y:420,about:"Actor known for precise, immersive work across independent film, television, and blockbusters."},
 {id:"stone",name:"Emma Stone",role:"Actor",x:900,y:145,about:"Actor and producer whose work spans comedy, musicals, television, and experimental film."},
 {id:"gosling",name:"Ryan Gosling",role:"Actor",x:1120,y:300,about:"Actor whose collaborations range from intimate drama to musicals and studio releases."},
 {id:"gerwig",name:"Greta Gerwig",role:"Director",x:1110,y:115,about:"Writer-director known for character-led stories with sharp humor and emotional detail."},
 {id:"robbie",name:"Margot Robbie",role:"Producer",x:1240,y:210,about:"Actor and producer working across independent projects, franchises, and filmmaker-led films."},
 {id:"dicaprio",name:"Leonardo DiCaprio",role:"Actor",x:400,y:590,about:"Actor and producer with recurring collaborations across ambitious historical dramas."},
 {id:"scorsese",name:"Martin Scorsese",role:"Director",x:210,y:540,about:"Director and film historian whose recurring creative teams span more than five decades."},
 {id:"deniro",name:"Robert De Niro",role:"Actor",x:95,y:670,about:"Actor at the center of one of American cinema’s most durable creative partnerships."},
 {id:"chazelle",name:"Damien Chazelle",role:"Director",x:785,y:70,about:"Director drawn to stories about performance, ambition, and creative obsession."},
 {id:"baumbach",name:"Noah Baumbach",role:"Writer",x:1290,y:78,about:"Writer-director of dialogue-driven comedy and drama built with recurring collaborators."},
 {id:"jonathan",name:"Jonathan Nolan",role:"Writer",x:590,y:610,about:"Writer and producer working across feature films and ambitious science-fiction television."},
 {id:"hoyte",name:"Hoyte van Hoytema",role:"Craft",x:395,y:185,about:"Cinematographer recognized for large-format imagery and a tactile approach to natural light."},
 {id:"pfister",name:"Wally Pfister",role:"Craft",x:505,y:235,about:"Cinematographer whose practical style shaped a run of influential studio films."},
 {id:"schoonmaker",name:"Thelma Schoonmaker",role:"Craft",x:130,y:390,about:"Editor whose rhythm and structure define a decades-long filmmaking partnership."},
 {id:"ronan",name:"Saoirse Ronan",role:"Actor",x:1240,y:385,about:"Actor known for expressive performances across literary adaptations and independent drama."},
 {id:"pugh",name:"Florence Pugh",role:"Actor",x:820,y:650,about:"Actor connecting intimate dramas, major ensembles, and filmmaker-led franchises."},
 {id:"bale",name:"Christian Bale",role:"Actor",x:470,y:745,about:"Actor known for committed performances and recurring work with major directors."},
 {id:"hathaway",name:"Anne Hathaway",role:"Actor",x:650,y:755,about:"Actor whose filmography spans comedy, musical performance, drama, and science fiction."},
 {id:"damon",name:"Matt Damon",role:"Actor",x:790,y:775,about:"Actor, writer, and producer with collaborations across drama, comedy, and science fiction."}
];
const projects:Project[]=[
 {id:"oppenheimer",title:"Oppenheimer",wiki:"Oppenheimer_(film)",year:2023,kind:"Film",people:["nolan","murphy","hoyte","pugh","damon"]},
 {id:"inception",title:"Inception",year:2010,kind:"Film",people:["nolan","murphy","dicaprio","pfister"]},
 {id:"tdkr",title:"The Dark Knight Rises",year:2012,kind:"Film",people:["nolan","murphy","bale","hathaway","pfister","jonathan"]},
 {id:"tdk",title:"The Dark Knight",wiki:"The_Dark_Knight",year:2008,kind:"Film",people:["nolan","murphy","bale","pfister","jonathan"]},
 {id:"begins",title:"Batman Begins",year:2005,kind:"Film",people:["nolan","murphy","bale","pfister","jonathan"]},
 {id:"interstellar",title:"Interstellar",year:2014,kind:"Film",people:["nolan","hathaway","damon","hoyte","jonathan"]},
 {id:"dunkirk",title:"Dunkirk",wiki:"Dunkirk_(2017_film)",year:2017,kind:"Film",people:["nolan","murphy","hoyte"]},
 {id:"barbie",title:"Barbie",wiki:"Barbie_(film)",year:2023,kind:"Film",people:["gerwig","robbie","gosling","baumbach"]},
 {id:"little-women",title:"Little Women",wiki:"Little_Women_(2019_film)",year:2019,kind:"Film",people:["gerwig","ronan","pugh"]},
 {id:"lady-bird",title:"Lady Bird",wiki:"Lady_Bird_(film)",year:2017,kind:"Film",people:["gerwig","ronan"]},
 {id:"la-la-land",title:"La La Land",year:2016,kind:"Film",people:["chazelle","stone","gosling"]},
 {id:"first-man",title:"First Man",wiki:"First_Man_(film)",year:2018,kind:"Film",people:["chazelle","gosling"]},
 {id:"crazy-stupid-love",title:"Crazy, Stupid, Love.",year:2011,kind:"Film",people:["stone","gosling"]},
 {id:"gangster-squad",title:"Gangster Squad",year:2013,kind:"Film",people:["stone","gosling"]},
 {id:"wolf-wall-street",title:"The Wolf of Wall Street",wiki:"The_Wolf_of_Wall_Street_(2013_film)",year:2013,kind:"Film",people:["scorsese","dicaprio","robbie","schoonmaker"]},
 {id:"aviator",title:"The Aviator",wiki:"The_Aviator_(2004_film)",year:2004,kind:"Film",people:["scorsese","dicaprio","schoonmaker"]},
 {id:"shutter-island",title:"Shutter Island",wiki:"Shutter_Island_(film)",year:2010,kind:"Film",people:["scorsese","dicaprio","schoonmaker"]},
 {id:"killers",title:"Killers of the Flower Moon",wiki:"Killers_of_the_Flower_Moon_(film)",year:2023,kind:"Film",people:["scorsese","dicaprio","deniro","schoonmaker"]},
 {id:"gangs-new-york",title:"Gangs of New York",year:2002,kind:"Film",people:["scorsese","dicaprio","schoonmaker"]},
 {id:"goodfellas",title:"Goodfellas",year:1990,kind:"Film",people:["scorsese","deniro","schoonmaker"]},
 {id:"casino",title:"Casino",wiki:"Casino_(1995_film)",year:1995,kind:"Film",people:["scorsese","deniro","schoonmaker"]},
 {id:"irishman",title:"The Irishman",year:2019,kind:"Streaming",people:["scorsese","deniro","schoonmaker"]},
 {id:"taxi-driver",title:"Taxi Driver",year:1976,kind:"Film",people:["scorsese","deniro","schoonmaker"]},
 {id:"peaky",title:"Peaky Blinders",wiki:"Peaky_Blinders_(TV_series)",year:2013,kind:"Television",people:["murphy"]},
 {id:"maniac",title:"Maniac",wiki:"Maniac_(miniseries)",year:2018,kind:"Television",people:["stone"]}
];

const byId=new Map(people.map(p=>[p.id,p]));
function pairEdges(){const map=new Map<string,{a:string;b:string;projects:Project[]}>();projects.forEach(project=>project.people.forEach((a,i)=>project.people.slice(i+1).forEach(b=>{const [x,y]=[a,b].sort(),key=x+"|"+y,current=map.get(key)||{a:x,b:y,projects:[]};current.projects.push(project);map.set(key,current)})));return [...map.values()]}
const edges=pairEdges();
const projectNodes=projects.map((project,index)=>{const members=project.people.map(id=>byId.get(id)!).filter(Boolean);const x=members.reduce((s,p)=>s+p.x,0)/members.length+Math.sin(index*2.7)*42;const y=members.reduce((s,p)=>s+p.y,0)/members.length+Math.cos(index*2.2)*35;return {...project,x:Math.max(42,Math.min(1350,x)),y:Math.max(42,Math.min(805,y))}});

function WikiMedia({title,fallback,portrait}:{title:string;fallback:string;portrait?:boolean}){
 const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[title]);
 return failed?<div className={portrait?"portrait fallback":"poster fallback"}>{fallback}</div>:<img src={`/api/media?title=${encodeURIComponent(title)}`} alt="" className={portrait?"portrait":"poster"} onError={()=>setFailed(true)}/>;
}

export default function Home(){
 const [hover,setHover]=useState<Hover>(null);const [pinned,setPinned]=useState<Hover>(null);const [query,setQuery]=useState("");
 const defaultView={x:0,y:0,w:1400,h:850};const [view,setView]=useState(defaultView);const [dragging,setDragging]=useState(false);const svgRef=useRef<SVGSVGElement>(null);const dragRef=useRef<{clientX:number;clientY:number;view:typeof defaultView}|null>(null);const pointersRef=useRef(new Map<number,{x:number;y:number}>());const pinchRef=useRef<{distance:number;midX:number;midY:number;view:typeof defaultView}|null>(null);
 const active=pinned||hover;const activePerson=active?.type==="person"?byId.get(active.id):null;const activeProject=active?.type==="project"?projects.find(p=>p.id===active.id):null;const activeEdge=active?.type==="relationship"?edges.find(edge=>`${edge.a}|${edge.b}`===active.id):null;
 const focusPeople=new Set<string>();if(activePerson){focusPeople.add(activePerson.id);edges.filter(e=>e.a===activePerson.id||e.b===activePerson.id).forEach(e=>{focusPeople.add(e.a);focusPeople.add(e.b)})}if(activeProject)activeProject.people.forEach(id=>focusPeople.add(id));if(activeEdge){focusPeople.add(activeEdge.a);focusPeople.add(activeEdge.b)}
 const matches=useMemo(()=>new Set(people.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())).map(p=>p.id)),[query]);
 const show=(type:"person"|"project"|"relationship",id:string,e:React.MouseEvent)=>setHover({type,id,x:e.clientX,y:e.clientY});
 const zoomAt=(factor:number,cx=view.x+view.w/2,cy=view.y+view.h/2)=>setView(current=>{const nextW=Math.max(430,Math.min(2400,current.w*factor));const nextH=nextW*(850/1400);const scale=nextW/current.w;return{x:cx-(cx-current.x)*scale,y:cy-(cy-current.y)*scale,w:nextW,h:nextH}});
 const mapPoint=(clientX:number,clientY:number)=>{const rect=svgRef.current!.getBoundingClientRect();return{x:view.x+(clientX-rect.left)/rect.width*view.w,y:view.y+(clientY-rect.top)/rect.height*view.h}};
 const wheel=(e:React.WheelEvent<SVGSVGElement>)=>{e.preventDefault();const point=mapPoint(e.clientX,e.clientY);zoomAt(e.deltaY>0?1.14:.86,point.x,point.y)};
 const startPan=(e:React.PointerEvent<SVGSVGElement>)=>{if(e.target!==e.currentTarget)return;e.currentTarget.setPointerCapture(e.pointerId);pointersRef.current.set(e.pointerId,{x:e.clientX,y:e.clientY});const points=[...pointersRef.current.values()];if(points.length===1)dragRef.current={clientX:e.clientX,clientY:e.clientY,view};if(points.length===2){const [a,b]=points;pinchRef.current={distance:Math.hypot(b.x-a.x,b.y-a.y),midX:(a.x+b.x)/2,midY:(a.y+b.y)/2,view};dragRef.current=null}setDragging(true);setPinned(null)};
 const pan=(e:React.PointerEvent<SVGSVGElement>)=>{if(!pointersRef.current.has(e.pointerId)||!svgRef.current)return;pointersRef.current.set(e.pointerId,{x:e.clientX,y:e.clientY});const rect=svgRef.current.getBoundingClientRect(),points=[...pointersRef.current.values()];if(points.length===2&&pinchRef.current){const [a,b]=points,start=pinchRef.current,distance=Math.hypot(b.x-a.x,b.y-a.y),midX=(a.x+b.x)/2,midY=(a.y+b.y)/2;const nextW=Math.max(430,Math.min(2400,start.view.w*start.distance/distance)),nextH=nextW*(850/1400),anchorX=start.view.x+(start.midX-rect.left)/rect.width*start.view.w,anchorY=start.view.y+(start.midY-rect.top)/rect.height*start.view.h;setView({x:anchorX-(midX-rect.left)/rect.width*nextW,y:anchorY-(midY-rect.top)/rect.height*nextH,w:nextW,h:nextH});return}const start=dragRef.current;if(start)setView({...start.view,x:start.view.x-(e.clientX-start.clientX)*start.view.w/rect.width,y:start.view.y-(e.clientY-start.clientY)*start.view.h/rect.height})};
 const stopPan=(e:React.PointerEvent<SVGSVGElement>)=>{pointersRef.current.delete(e.pointerId);pinchRef.current=null;const remaining=[...pointersRef.current.values()][0];dragRef.current=remaining?{clientX:remaining.x,clientY:remaining.y,view}:null;setDragging(pointersRef.current.size>0);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)};
 return <main className="atlas">
  <header className="masthead"><div><b>Studio Atlas</b><span>Hollywood collaboration database</span></div><label><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a person" aria-label="Find a person"/></label><p><strong>{people.length}</strong> people · <strong>{projects.length}</strong> projects · hover to explore</p></header>
  <svg ref={svgRef} className={`database ${dragging?"dragging":""}`} viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} role="img" aria-label="Hollywood people and projects database" onWheel={wheel} onPointerDown={startPan} onPointerMove={pan} onPointerUp={stopPan} onPointerCancel={stopPan}>
   <defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
   <g className="membership-lines">{projectNodes.flatMap(project=>project.people.map(id=>{const person=byId.get(id)!;const highlighted=activeProject?.id===project.id||activePerson?.id===id;return <line key={project.id+id} x1={project.x} y1={project.y} x2={person.x} y2={person.y} style={{opacity:highlighted?.42:.055}}/>}))}</g>
   <g className="collaboration-lines">{edges.map(edge=>{const a=byId.get(edge.a)!,b=byId.get(edge.b)!;const edgeId=`${edge.a}|${edge.b}`;const highlighted=activeEdge===edge||activePerson&&(edge.a===activePerson.id||edge.b===activePerson.id);const faded=active&&(!focusPeople.has(edge.a)||!focusPeople.has(edge.b));return <line key={edgeId} x1={a.x} y1={a.y} x2={b.x} y2={b.y} style={{strokeWidth:1.5+edge.projects.length*1.8,opacity:faded?.035:highlighted?.95:.25}}/>})}</g>
   <g className="relationship-targets">{edges.map(edge=>{const a=byId.get(edge.a)!,b=byId.get(edge.b)!,edgeId=`${edge.a}|${edge.b}`;return <line key={edgeId} x1={a.x} y1={a.y} x2={b.x} y2={b.y} tabIndex={0} role="button" aria-label={`${a.name} and ${b.name}: ${edge.projects.length} shared projects`} onMouseEnter={e=>show("relationship",edgeId,e)} onMouseMove={e=>show("relationship",edgeId,e)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover({type:"relationship",id:edgeId,x:innerWidth/2,y:innerHeight/2})} onBlur={()=>setHover(null)} onClick={e=>setPinned(pinned?.type==="relationship"&&pinned.id===edgeId?null:{type:"relationship",id:edgeId,x:e.clientX,y:e.clientY})}/>})}</g>
   <g className="projects">{projectNodes.map(project=>{const focused=activeProject?.id===project.id||activePerson&&project.people.includes(activePerson.id);const faded=active&&activeProject?.id!==project.id&&!(activePerson&&project.people.includes(activePerson.id));return <g key={project.id} className="project-node" transform={`translate(${project.x} ${project.y})`} style={{opacity:faded?.14:1}} tabIndex={0} role="button" aria-label={`${project.title}, ${project.year}`} onMouseEnter={e=>show("project",project.id,e)} onMouseMove={e=>show("project",project.id,e)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover({type:"project",id:project.id,x:innerWidth/2,y:innerHeight/2})} onBlur={()=>setHover(null)} onClick={e=>setPinned(pinned?.type==="project"&&pinned.id===project.id?null:{type:"project",id:project.id,x:e.clientX,y:e.clientY})}>
    <rect className={focused?"focused":""} x="-9" y="-9" width="18" height="18" rx="4"/>
   </g>})}</g>
   <g className="people">{people.map(person=>{const count=edges.filter(e=>e.a===person.id||e.b===person.id).length;const radius=Math.min(13+count*.8,23);const focused=activePerson?.id===person.id;const faded=(active&&!focusPeople.has(person.id))||(query&&!matches.has(person.id));return <g key={person.id} className="person-node" transform={`translate(${person.x} ${person.y})`} style={{opacity:faded?.1:1}} tabIndex={0} role="button" aria-label={`${person.name}, ${person.role}`} onMouseEnter={e=>show("person",person.id,e)} onMouseMove={e=>show("person",person.id,e)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover({type:"person",id:person.id,x:innerWidth/2,y:innerHeight/2})} onBlur={()=>setHover(null)} onClick={e=>setPinned(pinned?.type==="person"&&pinned.id===person.id?null:{type:"person",id:person.id,x:e.clientX,y:e.clientY})}>
    {focused&&<circle className="focus-ring" r={radius+8}/>}<circle r={radius} fill={colors[person.role]} filter={focused?"url(#glow)":undefined}/><text className={person.x>1160?"label-left":""} x={person.x>1160?-radius-8:radius+8} y="4">{person.name}</text>
   </g>})}</g>
  </svg>
  <nav className="map-controls" aria-label="Map controls"><button onClick={()=>zoomAt(.8)} aria-label="Zoom in">+</button><button onClick={()=>zoomAt(1.25)} aria-label="Zoom out">−</button><button className="reset-map" onClick={()=>setView(defaultView)}>Reset</button><span>{Math.round(1400/view.w*100)}%</span></nav>
  <footer className="key"><span><i className="person-key"/>Person</span><span><i className="project-key"/>Project</span><span><i className="thin"/>1 shared project</span><span><i className="thick"/>5+ shared projects</span></footer>
  {active&&<aside className={`hover-card ${activeEdge?"relationship-hover":""} ${active.x>innerWidth*.66?"left":""}`} style={{left:active.x,top:active.y}}>
   {activePerson&&<><WikiMedia title={activePerson.name.replaceAll(" ","_")} fallback={activePerson.name.split(" ").map(x=>x[0]).join("")} portrait/><div className="card-copy"><small>{activePerson.role}</small><h2>{activePerson.name}</h2><p>{activePerson.about}</p><span>{projects.filter(p=>p.people.includes(activePerson.id)).length} projects in this database</span></div></>}
   {activeProject&&<><WikiMedia title={activeProject.wiki||activeProject.title.replaceAll(" ","_")} fallback={activeProject.title}/><div className="card-copy"><small>{activeProject.kind} · {activeProject.year}</small><h2>{activeProject.title}</h2><p>{activeProject.people.map(id=>byId.get(id)?.name).join(" · ")}</p><span>{activeProject.people.length} people connected</span></div></>}
   {activeEdge&&<div className="relationship-card"><div className="relationship-heading"><small>Shared work</small><h2>{byId.get(activeEdge.a)?.name} <span>×</span> {byId.get(activeEdge.b)?.name}</h2><p>{activeEdge.projects.length} {activeEdge.projects.length===1?"project":"projects"} together</p></div><div className="project-strip">{activeEdge.projects.map(project=><div className="project-preview" key={project.id}><WikiMedia title={project.wiki||project.title.replaceAll(" ","_")} fallback={project.title}/><div><b>{project.title}</b><span>{project.year}</span></div></div>)}</div></div>}
  </aside>}
 </main>
}
