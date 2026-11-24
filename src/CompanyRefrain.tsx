import './company-refrain.css';

const echoes = [
  { phrase: 'We’re with you,', afterword: 'even after you close the laptop.' },
  { phrase: 'We’re with you, Michael.' },
  { phrase: 'We’re with you.' },
  { phrase: 'With you.' },
  { phrase: 'With.' },
  { phrase: 'You.' },
];

/** The narrator distorts a familiar phrase; this is not a company statement. */
export default function CompanyRefrain() {
  return (
    <section id="with-you" className="company-refrain" data-scene="breach" aria-labelledby="refrain-title">
      <div className="section-shell">
        <div className="refrain-context"><span>WATERSTONS / A PHRASE IN THE STORY</span><span>FICTIONAL REFRAMING</span></div>
        <div className="refrain-trace" aria-hidden="true"/>
        <ol className="refrain-echoes" aria-label="The narrator’s shrinking refrain">
          {echoes.map(({ phrase, afterword }, index) => (
            <li className={`refrain-line refrain-line-${index}`} key={phrase}>
              <span className="refrain-number" aria-hidden="true">0{index + 1}</span>
              {index === 0 ? <h2 id="refrain-title">{phrase}<span>{afterword}</span></h2> : <p>{phrase}</p>}
              {index === 2 && <span className="refrain-ghost" aria-hidden="true">We’re with you.</span>}
            </li>
          ))}
        </ol>
        <p className="refrain-caption">The narrator’s echo, not a company message.</p>
      </div>
    </section>
  );
}
