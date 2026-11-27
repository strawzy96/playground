import type { UnitedSnapshot } from './UnitedSpiral';

// Static, dated evidence. See research/united-2026-27.md for calculations and provenance.
const source = 'https://raw.githubusercontent.com/nr-jp/fpl-mirror/b81b2e0819357c1b4f8f5a879f221881a9701e16';
export const unitedSnapshot: UnitedSnapshot = {
  season: '2026/27 Premier League',
  asOf: '27 November 2026',
  coverage: 'Gameweek 11 complete · league results through 23 November',
  stats: [
    {label:'LEAGUE POSITION',value:'19th'},
    {label:'WINS / MATCHES',value:'1 / 11'},
    {label:'POINTS / POSSIBLE',value:'8 / 33'},
    {label:'GOALS CONCEDED',value:'23'},
    {label:'CLEAN SHEETS',value:'0'},
    {label:'GAMES WITHOUT A WIN',value:'9'},
  ],
  results: [
    {date:'25 Oct 2026',fixture:'Manchester United – Bournemouth',score:'0–3'},
    {date:'31 Oct 2026',fixture:'Chelsea – Manchester United',score:'2–0'},
    {date:'8 Nov 2026',fixture:'Manchester United – Aston Villa',score:'4–4'},
    {date:'22 Nov 2026',fixture:'Liverpool – Manchester United',score:'4–0'},
  ],
  comparisons: [
    {
      player:'Diogo Dalot',
      certificate:'HOSTNAME MISMATCH / DALOT.EXPIRED',
      stat:'802 league minutes · 9 starts · 0 goals · 0 FPL assists',
      monologue:'Diogo fucking Dalot. The subject says defender. The hostname resolves somewhere else.\n\nI have clicked “revoke” so many times the OCSP responder now says his name in my sleep. “Proceed anyway,” it whispers. NO. I WILL NOT PROCEED ANYWAY.\n\nI can replace an expired certificate. Why can’t I replace this feeling every time I see him on the team sheet? I’ve opened a change request against a right-back. I am asking CAB to approve my weekend.',
    },
    {
      player:'Bruno Fernandes',
      certificate:'THE LAST VALID INTERMEDIATE',
      stat:'4 league goals · 2 FPL assists · 900 minutes',
      monologue:'Bruno is the only intermediate certificate left in the chain. I’ve pinned my emotional security to his thumbprint. If he expires, the whole trust store goes with him. I refresh his fingerprint like it’s a pulse.',
    },
    {
      player:'Senne Lammens',
      certificate:'INBOUND RULE: PROCEED AT OWN RISK',
      stat:'990 league minutes · 23 goals conceded · 0 clean sheets',
      monologue:'I know a goalkeeper isn’t a firewall. I know. There are eleven players out there. I still keep writing DENY ALL on a team sheet and checking the logs whenever the ball enters our half. Twenty-three alerts. Not one quiet Saturday.',
    },
    {
      player:'Mason Mount',
      certificate:'VALID CERTIFICATE / BINDING NOT FOUND',
      stat:'189 league minutes · 1 start · 0 goals · 0 FPL assists',
      monologue:'Mount is a certificate I can see in the store but can’t find bound to anything. I restart the service. I restart the television. I restart the weekend. It is still the same weekend. Why is it still the same weekend?',
    },
  ],
  sources: [
    {label:'Results snapshot',url:source+'/data/latest/fixtures.json'},
    {label:'Player & team snapshot',url:source+'/data/latest/bootstrap-static.json'},
    {label:'Independent dated FPL cache',url:'https://github.com/Randdalf/fplcache/blob/main/cache/2026/11/27/0755.json.xz'},
  ],
  note:'Dated public Fantasy Premier League data, mirrored by nr-jp/fpl-mirror and checked against a separate 27 November cache. League record: 11 played, 1 win, 5 draws, 5 losses; 14 scored, 23 conceded. Match and player figures are league only; assists use FPL’s definition. This is a fixed snapshot, not a live table. The insults and certificate comparisons below are fictional fan satire, not football statistics.',
};
