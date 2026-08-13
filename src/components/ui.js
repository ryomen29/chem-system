import { h } from 'vue'
import {
  Home, BookOpen, FlaskConical, MessageSquare, BarChart2, User, Settings, X,
  ChevronRight, Check, Dna, Zap, Globe, Lock, Sparkles
} from 'lucide-vue-next'

export const AtomLogo = {
  props:{size:{default:32}},
  setup(props){ return ()=>h('svg',{width:props.size,height:props.size,viewBox:'0 0 40 40',fill:'none'},[
    h('circle',{cx:20,cy:20,r:3.5,fill:'currentColor'}),
    h('ellipse',{cx:20,cy:20,rx:17,ry:6.5,stroke:'currentColor','stroke-width':1.6}),
    h('ellipse',{cx:20,cy:20,rx:17,ry:6.5,stroke:'currentColor','stroke-width':1.6,transform:'rotate(60 20 20)'}),
    h('ellipse',{cx:20,cy:20,rx:17,ry:6.5,stroke:'currentColor','stroke-width':1.6,transform:'rotate(-60 20 20)'}),
    h('circle',{cx:37,cy:20,r:2.2,fill:'currentColor'}),h('circle',{cx:11,cy:9,r:1.8,fill:'currentColor',opacity:.7})
  ])}
}

export const MoleculeDecor = { setup(_, {attrs}){ return ()=>h('svg',{viewBox:'0 0 200 200',class:attrs.class,fill:'none'},[
  ...[[100,100,14,.25],[148,70,9,.18],[52,70,9,.18],[148,130,9,.18],[52,130,9,.18],[100,36,6,.12],[100,164,6,.12]].map(([cx,cy,r,o])=>h('circle',{cx,cy,r,fill:'currentColor',opacity:o})),
  ...[[100,100,148,70],[100,100,52,70],[100,100,148,130],[100,100,52,130],[100,100,100,36],[100,100,100,164]].map(([x1,y1,x2,y2])=>h('line',{x1,y1,x2,y2,stroke:'currentColor','stroke-width':2,opacity:.12}))
])}}

export const ProgressRing = {
  props:{pct:{default:0},size:{default:72},sw:{default:7},color:{default:'#2c7a50'}},
  setup(props){return ()=>{const r=(props.size-props.sw)/2,circ=2*Math.PI*r,off=circ-(props.pct/100)*circ;return h('div',{class:'progress-ring',style:{width:props.size+'px',height:props.size+'px'}},[
    h('svg',{width:props.size,height:props.size,viewBox:`0 0 ${props.size} ${props.size}`,style:{transform:'rotate(-90deg)'}},[
      h('circle',{cx:props.size/2,cy:props.size/2,r,fill:'none',stroke:'#e5e7eb','stroke-width':props.sw}),
      h('circle',{cx:props.size/2,cy:props.size/2,r,fill:'none',stroke:props.color,'stroke-width':props.sw,'stroke-dasharray':circ,'stroke-dashoffset':off,'stroke-linecap':'round'})
    ])] )}}
}

export const SubjectBadge = { props:{subject:String}, setup(props){return()=>h('span',{class:'subject-badge',style:{background:subjectBg(props.subject),color:subjectColor(props.subject)}},props.subject)}}
const subjectColor=s=>({Chemistry:'#2c7a50',Biology:'#be185d',Physics:'#1d4ed8','Earth Science':'#92400e'}[s]||'#6b7280')
const subjectBg=s=>({Chemistry:'#eef7f2',Biology:'#fdf2f8',Physics:'#eff6ff','Earth Science':'#fffbeb'}[s]||'#f3f4f6')

export const PBar={props:{pct:Number,color:{default:'#2c7a50'},h:{default:6}},setup(props){return()=>h('div',{class:'pbar',style:{height:(props.h||6)+'px'}},[h('div',{style:{width:`${props.pct}%`,background:props.color}})])}}

export const StatCard={props:{label:String,value:String,hint:String,icon:Object,iconBg:String,iconColor:String},setup(props){return()=>h('div',{class:'stat-card'},[
 h('div',{class:'stat-icon',style:{background:props.iconBg,color:props.iconColor}},[h(props.icon,{size:17})]),
 h('div',{class:'stat-value'},props.value),h('div',{class:'stat-label'},props.label),props.hint?h('div',{class:'stat-hint'},props.hint):null
])}}

export const ModuleCard={
 props:{module:Object},
 emits:['open'],
 setup(props,{emit}){return()=>h('div',{class:'module-card',onClick:()=>emit('open')},[
  h('div',{class:'module-card-top'},[h('span',{class:'module-icon',style:{background:subjectBg(props.module.subject),color:subjectColor(props.module.subject)}},[
    h(props.module.subject==='Biology'?Dna:props.module.subject==='Physics'?Zap:props.module.subject==='Earth Science'?Globe:FlaskConical,{size:20})]),h(SubjectBadge,{subject:props.module.subject})]),
  h('h3',props.module.title),h('p',props.module.description),
  h('div',{class:'module-card-meta'},[h('span',props.module.difficulty),h('span',[h(BookOpen,{size:13}),`${props.module.lessons} lessons`]),h('span',[h('span',''),`${props.module.hours}h`])]),
  h('div',{class:'row progress-meta'},[h('span',`${props.module.progress}% complete`),h(ChevronRight,{size:15})]),h(PBar,{pct:props.module.progress,color:subjectColor(props.module.subject)})
])}}

const navMain=[
 {id:'dashboard',label:'Dashboard',icon:Home},{id:'modules',label:'Modules',icon:BookOpen},
 {id:'simulation',label:'Simulations',icon:FlaskConical},{id:'ai-tutor',label:'AI Tutor',icon:MessageSquare},{id:'progress',label:'Progress',icon:BarChart2}
]
const navBottom=[{id:'profile',label:'Profile',icon:User},{id:'settings',label:'Settings',icon:Settings}]

export const Sidebar={
 props:{current:String},
 emits:['navigate','close'],
 setup(props,{emit}){return()=>h('div',{class:'sidebar-inner'},[
  h('div',{class:'brand'},[h('span',{class:'brand-icon'},[h(AtomLogo)]),h('div',[h('b','ChemSystem'),h('small','Learn. Explore. Experiment.')]),h('button',{class:'sidebar-close',onClick:()=>emit('close')},[h(X,{size:16})])]),
  h('nav',{class:'nav-list'},navMain.map(x=>h('button',{class:['nav-item',{active:props.current===x.id}],onClick:()=>emit('navigate',x.id)},[h(x.icon,{size:17}),h('span',x.label),props.current===x.id?h('i'):null]))),
  h('div',{class:'nav-bottom'},[...navBottom.map(x=>h('button',{class:['nav-item',{active:props.current===x.id}],onClick:()=>emit('navigate',x.id)},[h(x.icon,{size:17}),h('span',x.label),props.current===x.id?h('i'):null])),h('div',{class:'user-mini'},[h('div',{class:'mini-avatar'},'C'),h('div',[h('b','Christian'),h('small','Grade 11')])])])
])}}
export const SettingToggle={props:{label:String,desc:String,model:Boolean},emits:['toggle'],setup(props,{emit}){return()=>h('div',{class:'setting-toggle'},[h('div',[h('b',props.label),h('p',props.desc)]),h('button',{class:['toggle',{on:props.model}],onClick:()=>emit('toggle')},[h('span')])])}}
export const PauseIcon={setup(){return()=>h('span',{class:'pause-icon'},[h('i'),h('i')])}}
