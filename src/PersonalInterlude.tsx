import { ArrowDownRight, ArrowRight, RotateCcw } from 'lucide-react';
import './personal-interlude.css';

type Props = { onReturn: () => void };

/** A deliberately fictional private voice interrupts the professional portfolio. */
export default function PersonalInterlude({ onReturn }: Props) {
  return (
    <section id="unwritten" className="personal-interlude" data-scene="breach" aria-labelledby="unwritten-title">
      <div className="section-shell">
        <div className="section-index unwritten-index">
          <span>03B / OFF THE RECORD</span>
          <span>THIS PART WASN’T IN THE JOB DESCRIPTION</span>
        </div>
        <div className="unwritten-heading">
          <div>
            <span className="unwritten-fiction-label">FICTIONAL INNER MONOLOGUE</span>
            <h2 id="unwritten-title">What the CV<br/><em>leaves out.</em></h2>
          </div>
          <p>There’s the person on the page.<br/>And the person still awake after you’ve closed it.</p>
        </div>

        <div className="unwritten-layout">
          <div className="unwritten-persona" aria-label="The professional persona and the private voice">
            <div className="persona-paper">
              <div className="persona-paper-top"><span>THE VERSION YOU HIRE</span><span>01 / 01</span></div>
              <div className="persona-name">Michael<br/>McStraw<span aria-hidden="true">Michael<br/>McStraw</span></div>
              <p className="persona-public-quote">“Calm under pressure.”</p>
              <p className="persona-paper-note">That’s how it reads on the page.</p>
              <div className="persona-traits"><span>PROFESSIONAL</span><span>RELIABLE</span><span>AVAILABLE</span></div>
              <span className="persona-paper-signature">M. McStraw</span>
            </div>
            <div className="persona-shadow" aria-hidden="true"><span>THE VERSION THAT COMES HOME</span><strong>The pressure<br/>comes home.</strong><small>OFF DUTY: NOT FOUND</small></div>
            <p className="persona-caption">Same name. Different room. Same feeling.</p>
          </div>

          <div className="unwritten-private-voice">
            <p className="private-opening">At work, I call it<br/><strong>being thorough.</strong></p>
            <p>At home, I check a phone that hasn’t vibrated. I hear an alert in the silence and reach for a laptop that’s already shut.</p>
            <p className="anxiety-line">The anxiety doesn’t<br/><em>clock off with me.</em></p>
            <div className="unwritten-scenes">
              <article><span>03:17 / HOME</span><p>The cat is asleep. The house is quiet. I’m rehearsing a conversation I think I got wrong.</p></article>
              <article><span>03:18 / ESCAPE</span><p>Hardwell on. RuneScape open. I wait for the drop and check the phone before it comes.</p></article>
              <article><span>03:19 / TOMORROW</span><p>I’ll say I’m fine.<br/>I’ve made that sentence automatic.</p></article>
            </div>
          </div>
        </div>

        <div className="unwritten-warning" aria-labelledby="unwritten-warning-title">
          <div className="warning-arrow" aria-hidden="true"><ArrowDownRight size={35} strokeWidth={1}/></div>
          <div className="unwritten-warning-copy"><span>THIS IS YOUR CHANCE TO LEAVE</span><h3 id="unwritten-warning-title">You should stop reading.</h3><p>Please don’t.<br/><em>I need someone to see this.</em></p></div>
          <div className="unwritten-warning-actions"><a href="#continuity" className="unwritten-continue">Show me what it costs <ArrowRight size={15}/></a><button type="button" onClick={onReturn}><RotateCcw size={13}/>Return to daylight</button></div>
        </div>
      </div>
    </section>
  );
}
