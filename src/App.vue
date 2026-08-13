<script setup>
import { computed, ref, nextTick, reactive } from 'vue'
import {
  Home, BookOpen, FlaskConical, MessageSquare, BarChart2, User, Settings,
  Menu, X, Send, ChevronRight, ChevronLeft, Check, Play, Maximize2,
  RotateCcw, Clock, ArrowRight, Bell, Eye, EyeOff, CheckCircle, XCircle,
  TrendingUp, Award, Dna, Zap, Flame, Globe, Target, Search, RefreshCw,
  HelpCircle, Star, FileText, PlayCircle, Lock, Bookmark, Sparkles,
  Timer, Trophy, Activity, LogOut
} from 'lucide-vue-next'
import { USER, MODULES, LESSONS, QUIZ, ACTIVITY, AI_INIT } from './data'
import { authService } from './services/auth'
import { aiTutorService } from './services/aiTutor'
import { AtomLogo, MoleculeDecor, ProgressRing, SubjectBadge, PBar, ModuleCard, StatCard, Sidebar, SettingToggle, PauseIcon } from './components/ui.js'

const route = ref({ page:'login', moduleId:'dna-genetics' })
const authed = ref(false)
const mobileOpen = ref(false)

const nav = (page, extra={}) => {
  route.value = { page, ...extra }
  mobileOpen.value = false
  window.scrollTo({top:0, behavior:'smooth'})
}
const authNav = page => {
  if (page === 'dashboard') { authed.value=true; route.value={page} }
  else route.value={page}
}

const lessonNav = l => l.type==='simulation' ? 'simulation' : l.type==='quiz' ? 'quiz' : 'lesson'
const lessonLabel = l => l.type==='simulation' ? 'Interactive simulation' : l.type==='quiz' ? 'Quiz' : 'Reading'

const subjectColor = s => ({Chemistry:'#2c7a50', Biology:'#be185d', Physics:'#1d4ed8','Earth Science':'#92400e'}[s] || '#6b7280')
const subjectBg = s => ({Chemistry:'#eef7f2', Biology:'#fdf2f8', Physics:'#eff6ff','Earth Science':'#fffbeb'}[s] || '#f3f4f6')
const diffStyle = d => d==='Beginner' ? {bg:'#eef7f2',text:'#2c7a50'} : d==='Intermediate' ? {bg:'#fff7ed',text:'#c2410c'} : {bg:'#f5f3ff',text:'#7c3aed'}
const nowTime = () => new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
const genId = () => Math.random().toString(36).slice(2)

const pageTitle = computed(() => ({
  dashboard:'Dashboard', modules:'Modules', simulation:'Simulations', 'ai-tutor':'AI Tutor',
  progress:'Progress', profile:'Profile', settings:'Settings'
}[route.value.page] || 'ChemSystem'))

const login = reactive({email:'', password:'', show:false, loading:false, error:''})
const register = reactive({name:'',email:'',password:'',confirm:'',show:false,loading:false,error:''})
async function doLogin(){
  login.loading=true; login.error=''
  const r=await authService.login(login.email,login.password)
  login.loading=false
  if(r.ok) authNav('dashboard'); else login.error=r.error
}
async function doRegister(){
  register.loading=true; register.error=''
  const r=await authService.register(register)
  register.loading=false
  if(r.ok) authNav('dashboard'); else register.error=r.error
}

const search = ref('')
const filterSubject = ref('All')
const filterDiff = ref('All')
const filteredModules = computed(()=>MODULES.filter(m =>
  (filterSubject.value==='All'||m.subject===filterSubject.value) &&
  (filterDiff.value==='All'||m.difficulty===filterDiff.value) &&
  (m.title+m.description).toLowerCase().includes(search.value.toLowerCase())
))

const selectedModule = computed(()=>MODULES.find(m=>m.id===route.value.moduleId) || MODULES[3])
const activeMods = computed(()=>MODULES.filter(m=>m.progress>0))
const moduleLessons = computed(()=> selectedModule.value.id==='dna-genetics' ? LESSONS : LESSONS.map((l,i)=>({...l,title:`${['Introduction','Core Concepts','Guided Practice','Interactive Experiment','Practice Problems','Final Quiz'][i] || l.title} — ${selectedModule.value.title}`})))

const quizIndex=ref(0), quizAnswers=ref({}), quizSubmitted=ref(false), quizScore=ref(0)
function startQuiz(){quizIndex.value=0;quizAnswers.value={};quizSubmitted.value=false;nav('quiz')}
function chooseAnswer(i){
  if(quizSubmitted.value) return
  quizAnswers.value[quizIndex.value]=i
}
function nextQuestion(){
  if(quizIndex.value<QUIZ.length-1) quizIndex.value++
  else {
    let score=0
    QUIZ.forEach((q,i)=>{if(quizAnswers.value[i]===q.correct) score++})
    quizScore.value=Math.round(score/QUIZ.length*100)
    quizSubmitted.value=true
    nav('quiz-results')
  }
}

const chat = ref(AI_INIT.map(x=>({...x})))
const chatInput=ref('')
const chatBusy=ref(false)
const chatBox=ref(null)
async function sendChat(){
  const text=chatInput.value.trim()
  if(!text||chatBusy.value) return
  chat.value.push({id:genId(),role:'user',content:text,time:nowTime()})
  chatInput.value=''; chatBusy.value=true
  await nextTick(); chatBox.value?.scrollTo({top:chatBox.value.scrollHeight,behavior:'smooth'})
  const answer=await aiTutorService.send(text)
  chat.value.push({id:genId(),role:'ai',content:answer,time:nowTime()})
  chatBusy.value=false
  await nextTick(); chatBox.value?.scrollTo({top:chatBox.value.scrollHeight,behavior:'smooth'})
}

const settingsTab=ref('Account')
const tabs=['Account','Notifications','Learning','AI Tutor','Accessibility']
const notifs=ref({email:true,push:false,reminders:true,achievements:true})
const prefs=ref({autoPlay:true,hints:true,dark:false,dyslexic:false})
const selectedSubjects=ref([...USER.subjects])
const dark= computed(()=>prefs.value.dark)

const simulationRunning=ref(false), simStep=ref(0), simFullscreen=ref(false)
function resetSim(){simulationRunning.value=false;simStep.value=0}
function toggleSubject(s){
  selectedSubjects.value=selectedSubjects.value.includes(s)
    ? selectedSubjects.value.filter(x=>x!==s) : [...selectedSubjects.value,s]
}
</script>

<template>
  <!-- AUTH -->
  <div v-if="!authed" class="auth-page">
    <div class="auth-visual">
      <div class="hex-bg"></div>
      <div class="auth-brand"><AtomLogo :size="42"/><span>ChemSystem</span></div>
      <div class="auth-copy">
        <div class="eyebrow">LEARN · EXPLORE · EXPERIMENT</div>
        <h1>Science becomes<br><em>curiosity</em>.</h1>
        <p>A focused learning space for students to explore chemistry, biology and physics through lessons, simulations and an AI tutor.</p>
        <div class="auth-stats"><div><b>8</b><span>Modules</span></div><div><b>40+</b><span>Lessons</span></div><div><b>24/7</b><span>AI Tutor</span></div></div>
      </div>
      <MoleculeDecor class="auth-molecule"/>
    </div>
    <div class="auth-form-wrap">
      <form v-if="route.page==='login'" class="auth-form" @submit.prevent="doLogin">
        <div class="mobile-brand"><AtomLogo :size="34"/><b>ChemSystem</b></div>
        <div class="form-head"><span class="eyebrow green">WELCOME BACK</span><h2>Continue learning.</h2><p>Sign in to pick up where you left off.</p></div>
        <div v-if="login.error" class="error-box">{{login.error}}</div>
        <label>Email<input v-model="login.email" type="email" placeholder="you@example.com" autocomplete="email"></label>
        <label>Password<span class="pass"><input v-model="login.password" :type="login.show?'text':'password'" placeholder="••••••••"><button type="button" @click="login.show=!login.show"><EyeOff v-if="!login.show" :size="17"/><Eye v-else :size="17"/></button></span></label>
        <div class="form-row"><label class="check"><input type="checkbox"> Remember me</label><button type="button" class="link">Forgot password?</button></div>
        <button class="primary-btn wide" :disabled="login.loading">{{login.loading?'Signing in…':'Sign In'}}<ArrowRight v-if="!login.loading" :size="17"/></button>
        <div class="or"><span>or</span></div>
        <button type="button" class="outline-btn wide" @click="authNav('register')">Create a new account</button>
      </form>

      <form v-else class="auth-form" @submit.prevent="doRegister">
        <div class="mobile-brand"><AtomLogo :size="34"/><b>ChemSystem</b></div>
        <div class="form-head"><span class="eyebrow green">GET STARTED</span><h2>Create your account.</h2><p>Build your own science learning journey.</p></div>
        <div v-if="register.error" class="error-box">{{register.error}}</div>
        <label>Full name<input v-model="register.name" placeholder="Your name"></label>
        <label>Email<input v-model="register.email" type="email" placeholder="you@example.com"></label>
        <label>Password<input v-model="register.password" type="password" placeholder="At least 4 characters"></label>
        <label>Confirm password<input v-model="register.confirm" type="password" placeholder="Repeat your password"></label>
        <button class="primary-btn wide" :disabled="register.loading">{{register.loading?'Creating account…':'Create Account'}}<ArrowRight v-if="!register.loading" :size="17"/></button>
        <p class="switch-auth">Already have an account? <button type="button" class="link" @click="authNav('login')">Sign in</button></p>
      </form>
    </div>
  </div>

  <!-- APP -->
  <div v-else class="app" :class="{dark:dark}">
    <aside class="sidebar desktop-sidebar"><Sidebar :current="route.page" @navigate="nav"/></aside>
    <div v-if="mobileOpen" class="mobile-drawer"><div class="drawer-backdrop" @click="mobileOpen=false"></div><aside class="drawer"><Sidebar :current="route.page" @navigate="nav" @close="mobileOpen=false"/></aside></div>
    <main class="main-shell">
      <header class="topbar">
        <button class="icon-btn mobile-only" @click="mobileOpen=true"><Menu :size="20"/></button>
        <div class="crumb"><span>{{pageTitle}}</span><span v-if="route.page==='module-detail'"> / {{selectedModule.title}}</span></div>
        <div class="top-actions"><button class="icon-btn"><Bell :size="18"/><i></i></button><div class="top-avatar">{{USER.name[0]}}</div></div>
      </header>

      <!-- DASHBOARD -->
      <section v-if="route.page==='dashboard'" class="page dashboard-page">
        <div class="page-head split"><div><span class="eyebrow green">YOUR LEARNING SPACE</span><h1>Good morning, {{USER.name}} <span>👋</span></h1><p>Keep the momentum going. You're doing great.</p></div><button class="primary-btn" @click="nav('modules')">Explore modules <ArrowRight :size="16"/></button></div>
        <div class="hero-card">
          <div><span class="hero-kicker"><Flame :size="15"/> {{USER.streak}} day streak</span><h2>You're on a roll.</h2><p>Complete one more lesson today to keep your streak alive.</p><button class="light-btn" @click="nav('module-detail',{moduleId:'dna-genetics'})">Continue learning <ChevronRight :size="16"/></button></div>
          <MoleculeDecor class="hero-molecule"/>
          <div class="hero-ring"><ProgressRing :pct="62" :size="118" :sw="9" color="#f59e0b"/><div><b>62%</b><span>Overall progress</span></div></div>
        </div>
        <div class="stat-grid">
          <StatCard label="Lessons completed" value="24" hint="+3 this week" :icon="BookOpen" icon-bg="#eef7f2" icon-color="#2c7a50"/>
          <StatCard label="Average quiz score" value="79%" hint="+6% this month" :icon="Award" icon-bg="#fff7ed" icon-color="#ea580c"/>
          <StatCard label="Learning time" value="12.5h" hint="+2.4h this week" :icon="Clock" icon-bg="#eff6ff" icon-color="#1d4ed8"/>
          <StatCard label="Current streak" value="7 days" hint="Personal best: 12" :icon="Flame" icon-bg="#fdf2f8" icon-color="#be185d"/>
        </div>
        <div class="section-grid two">
          <div class="panel">
            <div class="panel-head"><div><h2>Continue learning</h2><p>Pick up where you left off</p></div><button class="text-btn" @click="nav('modules')">View all <ArrowRight :size="14"/></button></div>
            <div class="continue-card" @click="nav('module-detail',{moduleId:'dna-genetics'})">
              <div class="subject-icon biology"><Dna :size="20"/></div><div class="grow"><div class="row"><b>DNA & Genetics</b><span>62%</span></div><p>3 of 8 lessons completed</p><PBar :pct="62" color="#be185d"/></div><ChevronRight class="muted"/>
            </div>
            <div class="lesson-row" @click="nav('lesson')"><span class="lesson-check"><Check :size="13"/></span><div><b>Genes & Traits</b><small>Reading · 25 min</small></div><span class="done">Completed</span></div>
            <div class="lesson-row current" @click="nav('lesson')"><span class="play-circle"><Play :size="11" fill="currentColor"/></span><div><b>Interactive Experiment</b><small>Simulation · 30 min</small></div><span class="continue-link">Continue <ChevronRight :size="13"/></span></div>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h2>Recent activity</h2><p>Your latest learning moments</p></div></div>
            <div v-for="a in ACTIVITY" :key="a.id" class="activity-row"><div class="activity-icon" :class="a.type"><CheckCircle v-if="a.type==='completed'" :size="16"/><Award v-else-if="a.type==='quiz'" :size="16"/><FlaskConical v-else :size="16"/></div><div class="grow"><b>{{a.title}}</b><small>{{a.detail}}</small></div><span class="time">{{a.time}}</span></div>
          </div>
        </div>
        <div class="section-title"><div><h2>Recommended for you</h2><p>Based on your progress and interests</p></div></div>
        <div class="module-grid three">
          <ModuleCard v-for="m in MODULES.slice(0,3)" :key="m.id" :module="m" @open="nav('module-detail',{moduleId:m.id})"/>
        </div>
      </section>

      <!-- MODULES -->
      <section v-else-if="route.page==='modules'" class="page">
        <div class="page-head"><span class="eyebrow green">EXPLORE</span><h1>Learning modules</h1><p>Explore interactive science topics at your own pace.</p></div>
        <div class="filters"><div class="search-box"><Search :size="17"/><input v-model="search" placeholder="Search modules…"></div><select v-model="filterSubject"><option>All</option><option>Chemistry</option><option>Biology</option><option>Physics</option></select><select v-model="filterDiff"><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
        <div class="module-grid three"><ModuleCard v-for="m in filteredModules" :key="m.id" :module="m" @open="nav('module-detail',{moduleId:m.id})"/></div>
        <div v-if="!filteredModules.length" class="empty"><Search :size="30"/><h3>No modules found</h3><p>Try another search or filter.</p></div>
      </section>

      <!-- MODULE DETAIL -->
      <section v-else-if="route.page==='module-detail'" class="page">
        <button class="back-btn" @click="nav('modules')"><ChevronLeft :size="16"/> All modules</button>
        <div class="module-hero">
          <div><SubjectBadge :subject="selectedModule.subject"/><h1>{{selectedModule.title}}</h1><p>{{selectedModule.description}}</p><div class="module-meta"><span><BookOpen :size="15"/> {{selectedModule.lessons}} lessons</span><span><Clock :size="15"/> {{selectedModule.hours}} hours</span><span><Activity :size="15"/> {{selectedModule.difficulty}}</span></div></div>
          <div class="detail-progress"><ProgressRing :pct="selectedModule.progress" :size="110" :sw="9" :color="subjectColor(selectedModule.subject)"/><b>{{selectedModule.progress}}%</b><small>Complete</small></div>
        </div>
        <div class="lesson-layout"><div class="panel lesson-list"><div class="panel-head"><div><h2>Module lessons</h2><p>Work through each activity in order</p></div></div><div v-for="(l,i) in moduleLessons" :key="l.id" class="module-lesson" @click="nav(lessonNav(l))"><div class="lesson-number" :class="{completed:l.completed}"><Check v-if="l.completed" :size="15"/><span v-else>{{i+1}}</span></div><div class="grow"><b>{{l.title}}</b><small>{{lessonLabel(l)}} · {{l.duration}} min</small></div><span v-if="l.completed" class="status-pill done">Completed</span><span v-else-if="i===3" class="status-pill next">Next up</span><Lock v-else :size="15" class="muted"/></div></div>
          <div class="side-stack"><div class="panel"><h3>Your progress</h3><PBar :pct="selectedModule.progress" color="#2c7a50" h="8"/><div class="progress-row"><span>Completed</span><b>{{Math.round(selectedModule.progress/100*selectedModule.lessons)}} / {{selectedModule.lessons}}</b></div></div><div class="panel tip"><Sparkles :size="18"/><div><b>Study tip</b><p>Short, focused sessions are easier to maintain. Try 20–30 minutes today.</p></div></div></div></div>
      </section>

      <!-- LESSON -->
      <section v-else-if="route.page==='lesson'" class="page lesson-page">
        <button class="back-btn" @click="nav('module-detail',{moduleId:'dna-genetics'})"><ChevronLeft :size="16"/> Back to DNA & Genetics</button>
        <div class="lesson-header"><div><SubjectBadge subject="Biology"/><h1>Genes & Traits</h1><p>How genes influence the traits of living organisms.</p></div><span class="duration"><Clock :size="15"/> 25 min</span></div>
        <div class="lesson-content"><article class="article panel"><div class="article-label">LESSON 03 · READING</div><h2>Genes are the instructions of life</h2><p>Every living cell contains DNA, a molecule that stores the information needed to build and maintain an organism. Within DNA are <strong>genes</strong> — specific segments that carry instructions for making proteins and regulating biological processes.</p><div class="science-callout"><Dna :size="22"/><div><b>Think of a gene like a recipe</b><p>A recipe tells you which ingredients to use and how to combine them. A gene contains instructions that help a cell make a particular protein.</p></div></div><h3>Genes and traits</h3><p>A <strong>trait</strong> is a characteristic of an organism, such as eye color, height, or blood type. Genes influence traits by providing instructions for proteins that affect how cells work.</p><div class="trait-diagram"><div class="dna-visual">A T<br>G C<br>A T<br>C G<br>T A</div><div class="arrow-big">→</div><div class="protein-visual">Protein<br><span>function</span></div><div class="arrow-big">→</div><div class="trait-visual">Trait<br><span>characteristic</span></div></div><h3>Key takeaway</h3><p>Genes are segments of DNA that contain biological instructions. Different versions of genes can contribute to differences in traits among individuals.</p></article>
          <aside class="lesson-side"><div class="panel"><h3>Lesson progress</h3><div class="mini-progress"><span>3</span><div><b>3 of 6</b><small>lessons completed</small></div></div><PBar :pct="50" color="#2c7a50"/></div><div class="panel"><h3>Up next</h3><div class="next-item"><FlaskConical :size="17"/><div><b>Interactive Experiment</b><small>30 min · Simulation</small></div><ChevronRight :size="15"/></div></div><button class="primary-btn wide" @click="nav('simulation')">Start experiment <Play :size="15"/></button></aside>
        </div>
      </section>

      <!-- SIMULATION -->
      <section v-else-if="route.page==='simulation'" class="page">
        <div class="page-head split"><div><span class="eyebrow green">INTERACTIVE LAB</span><h1>DNA Genetics Simulation</h1><p>Explore how DNA base pairing works through an interactive model.</p></div><button class="outline-btn" @click="resetSim"><RotateCcw :size="15"/> Reset</button></div>
        <div class="sim-layout"><div class="simulation-window panel" :class="{fullscreen:simFullscreen}">
          <div class="sim-toolbar"><span><span class="live-dot"></span> Simulation ready</span><div><button class="icon-btn light"><Maximize2 :size="16" @click="simFullscreen=!simFullscreen"/></button></div></div>
          <div class="sim-stage"><div class="double-helix"><div v-for="n in 9" :key="n" class="dna-row" :style="{animationDelay:`-${n*0.16}s`}"><span :class="n%2?'a':'g'">{{n%2?'A':'G'}}</span><i></i><span :class="n%2?'t':'c'">{{n%2?'T':'C'}}</span></div></div><div class="sim-label"><span>DNA double helix</span><small>Complementary base pairs</small></div></div>
          <div class="sim-controls"><button class="primary-btn" @click="simulationRunning=!simulationRunning"><PauseIcon v-if="simulationRunning"/><Play v-else :size="15"/> {{simulationRunning?'Pause':'Run simulation'}}</button><div class="step-control"><button @click="simStep=Math.max(0,simStep-1)">−</button><span>Step {{simStep+1}} / 6</span><button @click="simStep=Math.min(5,simStep+1)">+</button></div></div>
        </div>
        <div class="sim-side"><div class="panel"><div class="panel-head"><div><h3>What to observe</h3><p>Watch the base pairs interact.</p></div></div><div class="observe"><span>A</span><b>pairs with</b><span>T</span></div><div class="observe"><span>G</span><b>pairs with</b><span>C</span></div><p class="small-copy">Adenine always pairs with thymine. Guanine always pairs with cytosine.</p></div><div class="panel"><h3>Experiment steps</h3><div v-for="(s,i) in ['Build a DNA strand','Add complementary bases','Observe the pairing','Test a mutation']" :key="s" class="step-row"><span :class="{active:i===simStep,complete:i<simStep}">{{i<simStep?'✓':i+1}}</span><b>{{s}}</b></div></div></div></div>
      </section>

      <!-- AI -->
      <section v-else-if="route.page==='ai-tutor'" class="page ai-page">
        <div class="page-head"><span class="eyebrow green">YOUR STUDY PARTNER</span><h1>AI Tutor</h1><p>Ask questions, get explanations, and work through difficult concepts.</p></div>
        <div class="ai-layout"><div class="chat-panel panel"><div class="chat-head"><div class="ai-avatar"><Sparkles :size="18"/></div><div><b>AI Tutor</b><small>Online · ready to help</small></div><span class="online"></span></div><div ref="chatBox" class="chat-messages"><div v-for="m in chat" :key="m.id" class="message" :class="m.role"><div class="message-avatar">{{m.role==='ai'?'AI':USER.name[0]}}</div><div><div class="bubble">{{m.content}}</div><small>{{m.time}}</small></div></div><div v-if="chatBusy" class="message ai"><div class="message-avatar">AI</div><div class="bubble typing"><i></i><i></i><i></i></div></div></div><div class="suggestions"><button v-for="q in ['Explain genes simply','What is DNA?','How do mutations work?']" :key="q" @click="chatInput=q;sendChat()">{{q}}</button></div><form class="chat-input" @submit.prevent="sendChat"><input v-model="chatInput" placeholder="Ask your tutor anything…"><button :disabled="!chatInput.trim()"><Send :size="17"/></button></form></div>
          <aside class="side-stack"><div class="panel"><h3>Try asking</h3><div v-for="q in ['Why are genes important?','Explain DNA like I’m 10','What is a mutation?','How does transcription work?']" :key="q" class="question-link" @click="chatInput=q;sendChat()"><MessageSquare :size="14"/><span>{{q}}</span><ChevronRight :size="13"/></div></div><div class="panel ai-note"><Sparkles :size="18"/><b>Tip</b><p>Ask follow-up questions whenever an explanation isn't clear. Your tutor can explain the same concept in different ways.</p></div></aside>
        </div>
      </section>

      <!-- QUIZ -->
      <section v-else-if="route.page==='quiz'" class="page quiz-page">
        <div class="quiz-top"><button class="back-btn" @click="nav('module-detail',{moduleId:'dna-genetics'})"><ChevronLeft :size="16"/> Exit quiz</button><span>Question {{quizIndex+1}} of {{QUIZ.length}}</span></div><PBar :pct="((quizIndex)/QUIZ.length)*100" color="#2c7a50" h="6"/>
        <div class="quiz-card panel"><div class="quiz-label">DNA & GENETICS · FINAL QUIZ</div><h1>{{QUIZ[quizIndex].question}}</h1><div class="options"><button v-for="(o,i) in QUIZ[quizIndex].options" :key="o" class="option" :class="{selected:quizAnswers[quizIndex]===i,correct:quizSubmitted&&i===QUIZ[quizIndex].correct,wrong:quizSubmitted&&quizAnswers[quizIndex]===i&&i!==QUIZ[quizIndex].correct}" @click="chooseAnswer(i)"><span>{{String.fromCharCode(65+i)}}</span><b>{{o}}</b><CheckCircle v-if="quizSubmitted&&i===QUIZ[quizIndex].correct" :size="18"/><XCircle v-else-if="quizSubmitted&&quizAnswers[quizIndex]===i" :size="18"/></button></div><div v-if="quizSubmitted" class="explanation"><Sparkles :size="17"/><div><b>Explanation</b><p>{{QUIZ[quizIndex].explanation}}</p></div></div><div class="quiz-actions"><span v-if="quizAnswers[quizIndex]!==undefined">Answer selected</span><button class="primary-btn" :disabled="quizAnswers[quizIndex]===undefined" @click="nextQuestion">{{quizIndex===QUIZ.length-1?'Finish quiz':'Next question'}} <ChevronRight :size="15"/></button></div></div>
      </section>

      <!-- RESULTS -->
      <section v-else-if="route.page==='quiz-results'" class="page result-page"><div class="result-card panel"><div class="trophy"><Trophy :size="34"/></div><span class="eyebrow green">QUIZ COMPLETE</span><h1>Great work, {{USER.name}}!</h1><p>You've completed the DNA & Genetics final quiz.</p><div class="score-ring"><ProgressRing :pct="quizScore" :size="170" :sw="12" color="#2c7a50"/><div><b>{{quizScore}}%</b><span>Your score</span></div></div><div class="result-stats"><div><b>{{Math.round(quizScore/100*QUIZ.length)}}</b><span>Correct</span></div><div><b>{{QUIZ.length-Math.round(quizScore/100*QUIZ.length)}}</b><span>To review</span></div><div><b>5</b><span>Questions</span></div></div><div class="result-actions"><button class="primary-btn" @click="nav('modules')">Back to modules</button><button class="outline-btn" @click="startQuiz"><RefreshCw :size="15"/> Try again</button></div></div></section>

      <!-- PROGRESS -->
      <section v-else-if="route.page==='progress'" class="page">
        <div class="page-head"><span class="eyebrow green">YOUR JOURNEY</span><h1>Progress</h1><p>See how your learning is developing over time.</p></div>
        <div class="stat-grid three"><StatCard label="Overall completion" value="62%" hint="+8% this month" :icon="TrendingUp" icon-bg="#eef7f2" icon-color="#2c7a50"/><StatCard label="Study time" value="12.5h" hint="+2.4h this week" :icon="Clock" icon-bg="#eff6ff" icon-color="#1d4ed8"/><StatCard label="Avg. score" value="79%" hint="+6% this month" :icon="Award" icon-bg="#fff7ed" icon-color="#ea580c"/></div>
        <div class="section-grid two"><div class="panel chart-panel"><div class="panel-head"><div><h2>Weekly activity</h2><p>Minutes spent learning</p></div><span class="chart-total">148 min</span></div><div class="fake-chart"><div v-for="(d,i) in [28,44,32,66,52,78,38]" :key="i" class="bar-col"><span>{{d}}</span><div class="bar" :style="{height:d+'%'}"></div><small>{{['M','T','W','T','F','S','S'][i]}}</small></div></div></div><div class="panel"><div class="panel-head"><div><h2>Module progress</h2><p>Across your active modules</p></div></div><div v-for="m in activeMods" :key="m.id" class="module-progress-row"><div class="subject-dot" :style="{background:subjectBg(m.subject),color:subjectColor(m.subject)}"><Dna v-if="m.subject==='Biology'" :size="14"/><FlaskConical v-else-if="m.subject==='Chemistry'" :size="14"/><Zap v-else :size="14"/></div><div class="grow"><div class="row"><span>{{m.title}}</span><b>{{m.progress}}%</b></div><PBar :pct="m.progress" :color="subjectColor(m.subject)"/></div></div></div></div>
        <div class="section-grid two"><div class="panel"><h2>Areas to improve</h2><div class="improve"><div><Target :size="15"/><b>Chemical Reactions</b><p>Practice 2 more activities to strengthen this topic.</p></div><div><Target :size="15"/><b>Forces & Motion</b><p>Practice 2 more activities to strengthen this topic.</p></div></div><button class="outline-btn wide">View recommended practice</button></div><div class="panel achievement-panel"><div class="panel-head"><div><h2>Recent achievements</h2><p>Keep building your streak.</p></div></div><div class="achievement"><div class="badge-circle"><Flame :size="20"/></div><div><b>7-Day Streak</b><small>Learned for 7 days in a row</small></div><span>Earned</span></div><div class="achievement"><div class="badge-circle"><Star :size="20"/></div><div><b>Quiz Master</b><small>Completed 5 quizzes</small></div><span>Earned</span></div></div></div>
      </section>

      <!-- PROFILE -->
      <section v-else-if="route.page==='profile'" class="page narrow-page"><h1>Profile</h1><div class="profile-cover"><div class="hex-bg"></div></div><div class="profile-card panel"><div class="profile-avatar">{{USER.name[0]}}</div><button class="outline-btn edit-profile">Edit Profile</button><h2>{{USER.name}}</h2><p>{{USER.email}}</p><small>{{USER.grade}}</small><div class="badges"><SubjectBadge v-for="s in USER.subjects" :key="s" :subject="s"/></div></div><div class="mini-stat-grid"><StatCard label="Day streak" value="7 days" hint="" :icon="Flame" icon-bg="#fff7ed" icon-color="#ea580c"/><StatCard label="Lessons done" value="24" hint="" :icon="BookOpen" icon-bg="#eef7f2" icon-color="#2c7a50"/><StatCard label="Quizzes taken" value="8" hint="" :icon="Star" icon-bg="#fff7ed" icon-color="#f59e0b"/><StatCard label="Avg score" value="79%" hint="" :icon="Award" icon-bg="#fdf2f8" icon-color="#be185d"/></div></section>

      <!-- SETTINGS -->
      <section v-else-if="route.page==='settings'" class="page narrow-page"><h1>Settings</h1><div class="settings-tabs"><button v-for="t in tabs" :key="t" :class="{active:settingsTab===t}" @click="settingsTab=t">{{t}}</button></div><div class="panel settings-panel">
        <template v-if="settingsTab==='Account'"><h3>Personal information</h3><div class="form-grid"><label>Full Name<input :value="USER.name"></label><label>Email<input :value="USER.email"></label><label>Grade<input :value="USER.grade"></label><label>Member Since<input value="August 2024"></label></div><button class="primary-btn">Save Changes</button><hr><h3>Change password</h3><input class="setting-input" type="password" placeholder="Current password"><input class="setting-input" type="password" placeholder="New password"><input class="setting-input" type="password" placeholder="Confirm new password"><button class="outline-btn">Update Password</button></template>
        <template v-else-if="settingsTab==='Notifications'"><h3>Notification preferences</h3><SettingToggle label="Email notifications" desc="Receive updates and progress reports via email" :model="notifs.email" @toggle="notifs.email=!notifs.email"/><SettingToggle label="Push notifications" desc="Browser notifications for reminders and achievements" :model="notifs.push" @toggle="notifs.push=!notifs.push"/><SettingToggle label="Learning reminders" desc="Daily reminders to keep your learning streak active" :model="notifs.reminders" @toggle="notifs.reminders=!notifs.reminders"/><SettingToggle label="Achievement alerts" desc="Get notified when you earn badges or complete modules" :model="notifs.achievements" @toggle="notifs.achievements=!notifs.achievements"/></template>
        <template v-else-if="settingsTab==='Learning'"><h3>Learning preferences</h3><label>Preferred subjects</label><div class="subject-select"><button v-for="s in ['Chemistry','Biology','Physics','Earth Science']" :key="s" :class="{chosen:selectedSubjects.includes(s)}" @click="toggleSubject(s)">{{s}}</button></div><label>Daily learning goal<select class="setting-input"><option>15 minutes / day</option><option>30 minutes / day</option><option>45 minutes / day</option><option>1 hour / day</option></select></label><SettingToggle label="Auto-play simulations" desc="Automatically start simulations when you open them" :model="prefs.autoPlay" @toggle="prefs.autoPlay=!prefs.autoPlay"/><SettingToggle label="Show hints by default" desc="Display contextual hints while you learn" :model="prefs.hints" @toggle="prefs.hints=!prefs.hints"/></template>
        <template v-else-if="settingsTab==='AI Tutor'"><h3>AI Tutor preferences</h3><label>Response style<select class="setting-input"><option>Conversational (recommended)</option><option>Concise and direct</option><option>Detailed explanations</option><option>Socratic (ask questions back)</option></select></label><label>Explanation depth<select class="setting-input"><option>Match my grade level</option><option>Simplified language</option><option>Advanced technical depth</option></select></label><div class="integration"><Sparkles :size="17"/><div><b>Integration ready</b><p>Replace <code>aiTutorService.send()</code> in <code>src/services/aiTutor.js</code> with your real AI API call.</p></div></div></template>
        <template v-else><h3>Accessibility</h3><SettingToggle label="Dark mode" desc="Reduce eye strain in low-light environments" :model="prefs.dark" @toggle="prefs.dark=!prefs.dark"/><SettingToggle label="Dyslexia-friendly font" desc="Use a readability-focused font" :model="prefs.dyslexic" @toggle="prefs.dyslexic=!prefs.dyslexic"/><label>Font size<select class="setting-input"><option>Default (16px)</option><option>Large (18px)</option><option>Extra Large (20px)</option></select></label></template>
      </div></section>
    </main>
  </div>
</template>

