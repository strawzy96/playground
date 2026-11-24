import { useCallback,useEffect,useRef,useState } from 'react';
import { ArrowDown,ArrowDownRight,ArrowRight,ArrowUpRight,AudioLines,Check,CornerDownRight,Headphones,HeartHandshake,Layers3,Menu,RotateCcw,Server,ShieldCheck,Terminal,Volume2,VolumeX,X } from 'lucide-react';
import Corridor from './Corridor';
import PersonalInterlude from './PersonalInterlude';
import CompanyRefrain from './CompanyRefrain';
import './psychological-horror.css';
import { useAtmosphere } from './useAtmosphere';

type Phase='normal'|'uneasy'|'breach'|'dark';
const phases:Phase[]=['normal','uneasy','breach','dark'];
const caseNotes={
  certificates:{title:'Making renewal routine.',eyebrow:'SELECTED WORK / 01',body:'Certificate work is about more than a new expiry date. The aim is a repeatable path through renewal, deployment, service binding and checking the certificate the service actually uses.',points:['Plan renewals before they become incidents.','Build towards automatic renewal and deployment.','Verify what is actually being served.'],footer:'Every certificate needs an owner.'},
  recovery:{title:'A way out of firefighting.',eyebrow:'SELECTED WORK / 02',body:'A structured, phased approach to helping at-risk clients: understand the problems, agree priorities, stabilise the service and hand over improvements that can last.',points:['Discovery and clear priorities.','Cross-team ownership and communication.','A practical route back to steady support.'],footer:'Every incident needs an ending.'},
};
type NoteKey=keyof typeof caseNotes;
function useScrollStory(){
  const [phase,setPhase]=useState<Phase>('normal');const [progress,setProgress]=useState(0);const [approach,setApproach]=useState(0);
  useEffect(()=>{
    let frame=0;
    const update=()=>{
      frame=0;const height=window.innerHeight;const sections=Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
      let next:Phase='normal';for(const section of sections){if(section.getBoundingClientRect().top<=height*.55)next=section.dataset.scene as Phase;}
      setPhase(next);setProgress(Math.max(0,Math.min(1,window.scrollY/Math.max(1,document.documentElement.scrollHeight-height))));
      const finale=document.getElementById('contact');if(finale){const rect=finale.getBoundingClientRect();setApproach(Math.max(0,Math.min(1,(height-rect.top)/(height+rect.height*.3))));}
    };
    const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);update();
    return()=>{window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);cancelAnimationFrame(frame);};
  },[]);
  return {phase,progress,approach};
}

function NoteDialog({note,onClose}:{note:NoteKey;onClose:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);const content=caseNotes[note];
  useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close();},[]);
  return <dialog ref={ref} className="note-dialog" aria-labelledby="note-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><button type="button" className="close-note" aria-label="Close case notes" onClick={onClose}><X size={20}/></button><span className="eyebrow">{content.eyebrow}</span><h2 id="note-title">{content.title}</h2><p>{content.body}</p><ul>{content.points.map(point=><li key={point}><Check size={15}/>{point}</li>)}</ul><p className="note-afterword">{content.footer}</p></dialog>;
}
function IdentityDialog({onReturn}:{onReturn:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close();},[]);
  return <dialog ref={ref} className="identity-dialog final-application" aria-label="The final application" onCancel={e=>{e.preventDefault();onReturn();}}>
    <div className="identity-room"><Corridor variant="haunted" approach={1}/></div><div className="identity-grain"/>
    <div className="identity-copy">
      <span className="terminal-eyebrow">FICTIONAL ENDING / THE CANDIDATE</span>
      <h2 aria-label="If you hire me, I will get revenge.">If you hire me,<br/>I will get<br/><span>revenge.</span></h2>
      <p>You wanted someone who never switches off.<br/>You should have asked what stays awake.</p>
      <p className="application-afterword">Every unanswered alert. Every evening swallowed by the next day.<br/>You can have the job title. The rest of me is coming with it.</p>
      <button type="button" className="return-button" autoFocus onClick={onReturn}><RotateCcw size={15}/>Return to daylight</button>
      <small>A fictional psychological-horror ending, not a real job application.<br/>You can leave whenever you want.</small>
    </div>
  </dialog>;
}

export default function App(){
  const {phase,progress,approach}=useScrollStory();
  const [menu,setMenu]=useState(false);const [note,setNote]=useState<NoteKey|null>(null);const [identity,setIdentity]=useState(false);
  const topLink=useRef<HTMLAnchorElement>(null);
  const intensity=phases.indexOf(phase)/3;
  const audio=useAtmosphere(intensity);
  const dark=phase==='breach'||phase==='dark';
  const returnToDaylight=useCallback(()=>{
    setIdentity(false);setMenu(false);audio.stop();
    try{history.replaceState(null,'',window.location.href.split('#')[0]);}catch{/* File URLs may restrict history operations. */}
    requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});topLink.current?.focus({preventScroll:true});});
  },[audio.stop]);
  const status=phase==='normal'?'All systems operational':phase==='uneasy'?'All systems responding':phase==='breach'?'One connection remains':'Connection never closed';
  return <div id="experience" className={`experience ${dark?'is-dark':''}`} data-phase={phase} style={{'--story-progress':progress,'--approach':approach} as React.CSSProperties}>
    <div className="page-grain" aria-hidden="true"/>
    <header className={`site-header ${dark?'header-dark':''}`}><a ref={topLink} className="wordmark" href="#home" aria-label="Michael McStraw, home"><span className="monogram">m<span>.</span></span><span className="wordmark-name">Michael McStraw<span>{phase==='normal'?'Infrastructure. People. Progress.':phase==='uneasy'?'Reliable. Available. Still available.':phase==='breach'?'I said I was fine.':'You kept reading.'}</span></span></a><nav className={menu?'nav-open':''} aria-label="Main navigation"><a href="#about" onClick={()=>setMenu(false)}>About</a><a href="#work" onClick={()=>setMenu(false)}>Selected work</a><a href="#beyond" onClick={()=>setMenu(false)}>Beyond the desk</a></nav><div className="header-actions"><a className="connect-link" href="#contact" onClick={()=>setMenu(false)}>{phase==='normal'?'Let’s connect':phase==='uneasy'?'Keep reading':'Do not continue'} <ArrowUpRight size={15}/></a><button type="button" className="mobile-nav-button" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={21}/>:<Menu size={21}/>}</button></div></header>
    <main>
      <section id="home" className="hero section-shell" data-scene="normal" aria-labelledby="hero-title"><div className="hero-copy"><div className="availability"><span/>SENIOR INFRASTRUCTURE & NETWORK ENGINEER</div><h1 id="hero-title">Good systems.<br/>Better <span>outcomes<span className="period">.</span></span></h1><p className="hero-intro">I’m Michael. I help make complex infrastructure work better—for the people who depend on it.</p><p className="hero-secondary">Technical problem-solver. People person. Big believer in leaving things better than I found them.</p><div className="hero-actions"><a className="button dark-button" href="#work">Explore my work <ArrowUpRight size={17}/></a><a className="quiet-link" href="#about">A little about me <ArrowRight size={16}/></a></div><div className="hero-location"><span className="location-dot"/>BASED IN THE NORTH EAST, UK<span className="hero-local-time">A human approach to technical things.</span></div></div><div className="hero-art-wrap"><div className="hero-image-label"><span>THE QUIET BEHIND THE EVERYDAY</span><ArrowUpRight size={15}/></div><div className="hero-art"><Corridor variant="clean"/><div className="art-coordinate">OPERATIONS / 01<br/><span>Designed to keep moving.</span></div><div className="hero-art-word">Always<br/><em>on.</em></div></div><div className="hero-image-footer"><span><span className="status-dot"/>{status}</span><span>UPTIME IS A TEAM SPORT <ArrowDownRight size={12}/></span></div></div><a href="#about" className="scroll-cue"><ArrowDown size={14}/><span>SCROLL TO GET TO KNOW ME</span></a></section>
      <div className="facts-strip section-shell"><div><strong>8+</strong><span>years in infrastructure<br/>& service delivery</span></div><div><strong>100+</strong><span>client organisations in<br/>certificate planning</span></div><div><span className="fact-icon"><HeartHandshake size={29} strokeWidth={1.3}/></span><span>People first.<br/>Even when it’s technical.</span></div><div className="facts-aside">Less firefighting.<br/><em>More moving forward.</em></div></div>
      <section id="about" className="about-section section-shell" data-scene="normal" aria-labelledby="about-title"><div className="section-index"><span>01 / THE APPROACH</span><span>BUILT ON EXPERIENCE <CornerDownRight size={15}/></span></div><div className="section-heading two-column-heading"><h2 id="about-title">Calm in the<br/><em>complicated.</em></h2><div><p>I’ve spent my career at Waterstons, at the point where systems, people and pressure meet.</p><p>From Windows and VMware operations to certificates, incidents and service improvement, I care about making the next day easier—not just getting through this one.</p><p className="education-line">First-class honours · Digital & Computer Forensics<br/>Northumbria University</p><div className="company-signoff"><span>WATERSTONS</span><q>We’re with you.</q></div></div></div><div className="approach-grid"><article><span className="approach-icon"><Server size={22} strokeWidth={1.5}/></span><h3>Keep things running.</h3><p>Practical infrastructure support, careful change planning and a steady head when the unexpected happens.</p><span className="card-index">01</span></article><article><span className="approach-icon"><HeartHandshake size={22} strokeWidth={1.5}/></span><h3>Bring people with you.</h3><p>Mentoring, clear communication and shared ownership. Good technology works better with a good team.</p><span className="card-index">02</span></article><article><span className="approach-icon"><Layers3 size={22} strokeWidth={1.5}/></span><h3>Make it better.</h3><p>Turn recurring problems into a plan. Build improvements that keep working after the handover.</p><span className="card-index">03</span></article></div></section>
      <section id="work" className="work-section section-shell" data-scene="uneasy" aria-labelledby="work-title"><div className="section-index"><span>02 / SELECTED WORK</span><span className="uneasy-label"><span/>NOT EVERYTHING SHOULD BE MANUAL</span></div><div className="section-heading work-heading"><h2 id="work-title">Less repetition.<br/><em>More progress.</em></h2><p>A few things I’ve put my time into.<br/>The kind of work that makes a difference<br/>long after the ticket closes.</p></div><div className="project-grid"><article className="project-card renewal-project"><div className="project-art renewal-art" aria-hidden="true"><div className="certificate-sheet"><span className="document-topline">CERTIFICATE OF CONTINUITY <ShieldCheck size={16}/></span><div className="certificate-seal"><ShieldCheck size={34} strokeWidth={1.1}/></div><strong>TRUST, RENEWED.</strong><span className="document-line"/><span className="document-line short"/><div className="document-signature">M. McStraw<span>RENEWAL: AUTOMATIC</span></div></div><span className="project-art-label">THINK BEYOND THE EXPIRY DATE</span></div><div className="project-card-copy"><span className="eyebrow">CERTIFICATE MANAGEMENT & AUTOMATION</span><h3>Make renewal routine.</h3><p>From issuance to the certificate actually being served. Less manual work. Fewer unwelcome surprises.</p><button type="button" onClick={()=>setNote('certificates')}>Read the case notes <ArrowUpRight size={17}/></button></div></article><article className="project-card recovery-project"><div className="project-art recovery-art" aria-hidden="true"><div className="recovery-path"><span>DISCOVER</span><span>STABILISE</span><span>IMPROVE</span><span className="recovery-last">HAND OVER</span></div><div className="recovery-line"/><div className="recovery-note"><span className="status-dot"/>SERVICE RECOVERED<span className="wrong-note">subject still present</span></div></div><div className="project-card-copy"><span className="eyebrow">CLIENT SERVICE RECOVERY</span><h3>A way out of firefighting.</h3><p>Clear priorities, cross-team ownership and phased improvement plans for clients who need a steadier service.</p><button type="button" onClick={()=>setNote('recovery')}>Read the case notes <ArrowUpRight size={17}/></button></div></article></div><div className="work-afterword"><span>Every system needs an owner.</span><span className="faint-duplicate">So does the damage.</span><span className="work-afterword-code">OFF DUTY: NOT FOUND / STILL ANSWERING</span></div></section>
      <section id="beyond" className="beyond-section section-shell" data-scene="uneasy" aria-labelledby="beyond-title"><div className="section-index"><span>03 / BEYOND THE DESK</span><span>THERE’S ALWAYS SOMETHING ELSE TO LEARN</span></div><div className="section-heading"><h2 id="beyond-title">There’s more to me<br/>than <em>the day job.</em></h2></div><div className="interest-grid"><article><Headphones size={25} strokeWidth={1.3}/><h3>A good build-up.</h3><p>Big room. Progressive. Hardwell at the top of the list. A beginner’s curiosity for the decks.</p><span>MUSIC / TURN IT UP</span></article><article><span className="dart-icon" aria-hidden="true">↗</span><h3>One more round.</h3><p>A bit of darts. A good game. Wrestling references that probably don’t belong in a serious conversation.</p><span>OFF THE CLOCK / MOSTLY</span></article><article className="interest-after-hours" aria-label="Fictional after-hours thought"><Terminal size={25} strokeWidth={1.3}/><h3>One more level.</h3><p>GTA. RuneScape. A game left on the menu while I listen for a phone that hasn’t rung.</p><span>FICTIONAL VOICE / <b>AFTER HOURS</b></span></article></div><p className="beyond-footnote">It’s good to switch off.<span>It’s good to switch off.</span><span className="wrong-sentence">It’s good to switch off.</span></p></section>
      <PersonalInterlude onReturn={returnToDaylight}/>
      <section id="continuity" className="continuity-section personal-continuity" data-scene="breach" aria-labelledby="continuity-title">
        <div className="continuity-grid" aria-hidden="true"/>
        <div className="section-shell">
          <div className="section-index"><span>05 / NEVER OFF DUTY</span><span className="breach-tag"><span/>FICTIONAL INNER MONOLOGUE</span></div>
          <div className="continuity-layout">
            <div>
              <div className="terminal-eyebrow">WHEN “ALWAYS ON” STOPS BEING A SELLING POINT</div>
              <h2 id="continuity-title">I can fix<br/><em>almost anything.</em></h2>
              <p>I used to bring work home.<br/>Now it lets me go to the office.</p>
              <p>The job taught me to find a fault before it became an incident.<br/>Now I look for faults in every quiet room.</p>
              <p className="continuity-question">I wasn’t calm. I was rehearsed.</p>
            </div>
            <div className="incident-terminal" aria-label="Fictional anxiety transcript">
              <div className="terminal-bar"><span/><span/><span/><strong>not_for_the_application.txt</strong><Terminal size={14}/></div>
              <div className="terminal-lines">
                <p><time>03:17:00</time><span>phone.vibrated</span><b>NO</b></p>
                <p><time>03:17:01</time><span>checked.anyway</span><b>YES</b></p>
                <p><time>03:17:02</time><span>workday.ended</span><b>HOURS AGO</b></p>
                <p><time>03:17:03</time><span>happy.to.help</span><b>AGAIN</b></p>
                <p><time>03:17:04</time><span>anxiety</span><b className="terminal-red">STILL HERE</b></p>
                <p className="terminal-corrupt"><time>03:17:04</time><span>checked.again</span><b>AGAIN</b></p>
                <div className="terminal-divider"/><p className="terminal-prompt">&gt; nothing is wrong. nothing is wrong.<span className="cursor-block"/></p>
              </div>
              <div className="terminal-footer"><span>NO TICKETS OPEN</span><span>CAN’T CLOSE THE THOUGHT</span></div>
            </div>
          </div>
          <div className="breach-bottomline"><span>THE WORKDAY ENDED HOURS AGO.</span><span>I AM STILL WAITING TO BE TOLD I CAN LEAVE.</span></div>
        </div>
      </section>
      <CompanyRefrain/>
      <section id="handover" className="handover-section section-shell personal-handover" data-scene="breach" aria-labelledby="handover-title">
        <div className="section-index"><span>06 / THE PERSON BEHIND THE JOB</span><span className="redacted-label">THIS IS NOT A REFERENCE</span></div>
        <div className="handover-layout">
          <div className="handover-aside">
            <span className="terminal-eyebrow">FICTIONAL INNER MONOLOGUE</span><div className="recovered-mark">M<span>.</span></div>
            <div className="recovered-metadata"><span>PUBLIC VERSION: CALM</span><span>PRIVATE VERSION: CHECK AGAIN</span><span>PERSONAL TIME: CONSUMED</span><span className="terminal-red">HANDOVER: FAILED</span></div>
            <div className="erased-assurance" aria-hidden="true"><s>I’m fine.</s><span>I’m fine.</span><span>I’m fine.</span></div>
          </div>
          <div className="recovered-note">
            <span className="letter-framing">FICTIONAL CAREER HORROR / AN UNSENT LETTER</span>
            <h2 id="handover-title" aria-label="IT has ruined my life.">IT has ruined<br/><em>my life.</em></h2>
            <p>I still write “happy to help”.</p>
            <p>I go home and carry every unfinished thing through the front door with me.</p>
            <p>Music is on. A game is open. Someone is talking. I’m watching for a notification.</p>
            <p>The anxiety doesn’t clock off. It gets into the small, ordinary parts of a life until they all look like something I’ve forgotten to fix.</p>
            <aside className="care-and-coping" aria-label="Fictional reflections on care and coping">
              <span className="care-framing">FICTIONAL INNER MONOLOGUE / CARE & COPING</span>
              <div className="care-support">
                <h3>Something that helps.</h3>
                <p>My prescribed medical cannabis helps me find a little calm. A little room to breathe. A reminder that I deserve care as well as being useful.</p>
              </div>
              <div className="coping-shadow">
                <span>THE VOICE UNDERNEATH</span>
                <blockquote>The job has turned me to substance abuse.</blockquote>
                <p>That’s the sentence this exhausted version of me keeps writing.</p>
              </div>
            </aside>
            <p>They call it resilience when I keep answering.</p>
            <p className="note-revelation">I don’t know where<br/>the job stops<br/>and I start.</p>
            <div className="fracture-lines" aria-label="The fictional narrator’s thoughts fragment"><p>I can fix it.</p><p>I can fix it.</p><p>I can fix</p><p>I can</p><p>I</p></div>
            <div className="handwritten-warning">Don’t turn this into another application.</div>
            <div className="last-warning">
              <span>YOU SHOULD CLOSE THIS PAGE.</span>
              <p>You’ve read this much.<br/>You want to know what happens if you don’t.</p>
              <a href="#contact" className="descend-link">JUST ONE MORE SECTION <ArrowDown size={17}/></a>
              <button type="button" onClick={returnToDaylight}>Return to daylight</button>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="finale-section personal-finale" data-scene="dark" aria-labelledby="finale-title">
        <div className="finale-art"><Corridor variant="haunted" approach={approach*.7}/></div><div className="finale-shadow"/>
        <div className="finale-topline"><span>THE LAST PART OF THE APPLICATION</span><span className="finale-presence"><span/>YOU WERE WARNED</span></div>
        <div className="finale-content">
          <span className="terminal-eyebrow">FICTIONAL ENDING / THE PERSON BEHIND THE PROFILE</span>
          <h2 id="finale-title" aria-label="DON’T HIRE ME.">DON’T<br/><span>HIRE ME.</span></h2>
          <p>That is the warning.<br/><span>This is still an application.</span></p>
          <p className="finale-confession">You wanted the person behind the job.<br/>You kept scrolling until you found him.</p>
          <button type="button" className="verify-button" onClick={()=>setIdentity(true)}>Hire me anyway <ArrowRight size={17}/></button>
          <button type="button" className="finale-return" onClick={returnToDaylight}><RotateCcw size={14}/>Return to daylight</button>
        </div>
        <div className="finale-foot"><span>CANDIDATE: MICHAEL MCSTRAW</span><span>PERSONAL TIME: CONSUMED</span><span>AVAILABILITY: <b>ALWAYS</b></span></div>
      </section>
    </main>
    <footer className="site-footer"><span>Michael McStraw <span>© {new Date().getFullYear()}</span></span><p>A work of fictional psychological horror, inspired by a real career.<br/>These monologues are not medical records or a real job application.</p><button type="button" onClick={returnToDaylight}>Back to the beginning <ArrowUpRight size={14}/></button></footer>
    <div className={`experience-controls ${dark?'controls-dark':''}`}><button type="button" className="sound-button" disabled={audio.busy} aria-label={audio.enabled?'Mute sound':'Enable sound'} aria-pressed={audio.enabled} onClick={()=>void audio.toggle()}>{audio.enabled?<Volume2 size={15}/>:<VolumeX size={15}/>}<span>Sound {audio.enabled?'on':'off'}</span>{audio.enabled&&<AudioLines size={13} className="sound-meter"/>}</button>{phase!=='normal'&&<button type="button" className="escape-button" onClick={returnToDaylight}><RotateCcw size={13}/><span>Return to daylight</span></button>}{audio.error&&<span className="sound-error" role="status">{audio.error}</span>}</div>
    <div className={`story-rail ${dark?'rail-dark':''}`} aria-hidden="true"><span>{phase==='normal'?'01':phase==='uneasy'?'02':phase==='breach'?'03':'04'}</span><div><i style={{height:`${progress*100}%`}}/></div><span>SCROLL</span></div>
    {note&&<NoteDialog note={note} onClose={()=>setNote(null)}/>}{identity&&<IdentityDialog onReturn={returnToDaylight}/>}
  </div>;
}
