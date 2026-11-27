import { ArrowDown, ArrowRight, RotateCcw } from 'lucide-react';
import './united-spiral.css';

export interface UnitedSnapshot {
  season: string;
  asOf: string;
  coverage: string;
  stats: { label: string; value: string }[];
  results: { date: string; fixture: string; score: string }[];
  comparisons: { player: string; certificate: string; monologue: string; stat?: string }[];
  sources: { label: string; url: string }[];
  note: string;
}

type Props = { snapshot: UnitedSnapshot; onReturn: () => void };

/** Verified football figures and the narrator's fictional comparisons stay distinct. */
export default function UnitedSpiral({ snapshot, onReturn }: Props) {
  return (
    <section id="united" className="united-spiral" data-scene="breach" aria-labelledby="united-title">
      <div className="section-shell">
        <div className="united-section-index"><span>THE WEEKEND WAS SUPPOSED TO HELP</span><span>FICTIONAL PERSONAL HORROR</span></div>
        <div className="united-opening">
          <div>
            <span className="united-eyebrow">THE LAST LITTLE THING HOLDING IT TOGETHER</span>
            <h2 id="united-title">The final straw<br/><em>wore red.</em></h2>
          </div>
          <div className="united-confession">
            <p>I spend all week renewing trust.<br/><strong>Then I support Manchester United.</strong></p>
            <p>Football was supposed to be the part that wasn’t work. Ninety minutes without an incident. Somewhere to put the noise.</p>
            <p>Now the weekend has a maintenance window.<br/>I still spend it staring at something I cannot fix.</p>
          </div>
        </div>

        <div className="united-evidence" aria-labelledby="united-evidence-title">
          <div className="united-evidence-heading"><div><span className="united-eyebrow">FACTUAL SNAPSHOT / {snapshot.season}</span><h3 id="united-evidence-title">The numbers on the page.</h3></div><div className="united-coverage"><span>Snapshot: {snapshot.asOf}</span><span>{snapshot.coverage}</span></div></div>
          <dl className="united-stat-grid">{snapshot.stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>
          {snapshot.results.length > 0 && <div className="united-results" role="region" aria-label="Verified match results"><div className="united-results-label"><span>RECORDED RESULTS</span><span>THIS IS THE BIT I KEEP RECHECKING</span></div><ul>{snapshot.results.map((result,index) => <li key={`${result.date}-${index}`}><time>{result.date}</time><span>{result.fixture}</span><strong>{result.score}</strong></li>)}</ul></div>}
          <div className="united-source-note"><p>{snapshot.note}</p><div>{snapshot.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ArrowRight size={11}/></a>)}</div></div>
        </div>

        <div className="united-margin-note"><span aria-hidden="true">////</span><p>The figures are real.<br/><em>The following match notes belong to the fictional narrator.</em></p></div>

        <div className="united-match-notes" aria-labelledby="united-notes-title">
          <div className="united-notes-title"><span className="united-eyebrow">FICTIONAL MATCH NOTES / FOOTBALL SATIRE</span><h3 id="united-notes-title">I’ve started seeing certificates.</h3><p>Where the players should be. Where the players are.</p></div>
          <div className="united-comparison-grid">{snapshot.comparisons.map((comparison,index) => <article className={`united-player-note united-player-note-${index % 3}`} key={comparison.player} data-player={comparison.player}><div className="united-player-line"><span>SUBJECT / {String(index + 1).padStart(2,'0')}</span><span className="united-false-diagnostic" aria-hidden="true">TRUST CHECK: PERSONAL</span></div><h4>{comparison.player}</h4><span className="united-certificate">{comparison.certificate}</span>{comparison.stat && <p className="united-player-stat">Recorded: {comparison.stat}</p>}<p className="united-player-monologue">{comparison.monologue}</p><span className="united-note-signature" aria-hidden="true">M. McStraw</span></article>)}</div>
        </div>

        <div className="united-collapse"><p>I can renew a certificate.</p><p>I can’t renew a season.</p><p>I keep clicking anyway.</p></div>
        <div className="united-warning"><div><span>DO NOT REFRESH THE TABLE.</span><p>You know what it said.<br/><em>Just check it once more.</em></p></div><div className="united-warning-actions"><a href="#handover">Just check the score once more <ArrowDown size={14}/></a><button type="button" onClick={onReturn}><RotateCcw size={13}/>Return to daylight</button></div></div>
      </div>
    </section>
  );
}
