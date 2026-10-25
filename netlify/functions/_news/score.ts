/**
 * Ranking without AI: relevance to Matin's themes (French and English keywords),
 * credibility of the source, freshness. Stories about sports, celebrities, crime, reviews or
 * commercial promotion are filtered out first. Every point is explained in `reasons`, which
 * the dashboard shows next to the score.
 */
import type { Region, SourceKind, Topic } from './types';

type Rule = [pattern: string, weight: number];

/** Keywords per theme. Patterns are matched on whole words, case- and accent-insensitive. */
const THEMES: Record<Topic, Rule[]> = {
  policy: [
    ['politique culturelle', 20],
    ['cultural polic(y|ies)', 20],
    ['plan culturel', 18],
    ['cultural plan(ning)?', 18],
    ['planification culturelle', 18],
    ['strategie culturelle', 16],
    ['cultural strategy', 16],
    ['ministere de la culture', 14],
    ['ministry of culture', 14],
    ['canadian heritage', 12],
    ['patrimoine canadien', 12],
    ['appel (de|a) projets', 14],
    ['call for (projects|proposals|applications)', 14],
    ['financement', 8],
    ['funding', 8],
    ['subventions?', 8],
    ['grants?', 8],
    ['investi(t|ssement)', 6],
    ['invest(s|ment)?', 6],
    ['budget', 5],
    ['programme', 4],
    ['program', 4],
    ['agenda 21', 16],
    ['legislation', 6],
    ['loi', 4],
    ['conseil des arts', 10],
    ['arts council', 10],
    ['secteur culturel', 12],
    ['milieu culturel', 12],
    ['cultural sector', 12],
    ['industries culturelles', 10],
    ['cultural industries', 10],
  ],
  dialogue: [
    ['interculturel(le|les|s)?', 22],
    ['intercultural(ism)?', 22],
    ['interculturalisme', 22],
    ['dialogue', 10],
    ['diversite culturelle', 16],
    ['cultural diversity', 16],
    ['vivre[- ]ensemble', 12],
    ['rapprochement', 8],
  ],
  participation: [
    ['participation culturelle', 20],
    ['cultural participation', 20],
    ['mediation culturelle', 18],
    ['cultural mediation', 18],
    ['acces a la culture', 16],
    ['access to culture', 16],
    ['participation citoyenne', 12],
    ['public participation', 12],
    ['democratie culturelle', 14],
  ],
  'arts-heritage': [
    ['patrimoine', 10],
    ['heritage', 10],
    ['world heritage', 14],
    ['patrimoine mondial', 14],
    ['patrimoine immateriel', 14],
    ['intangible', 10],
    ['musees?', 8],
    ['museums?', 8],
    ['bibliotheques?', 6],
    ['librar(y|ies)', 6],
    ['artistes?', 6],
    ['artists?', 6],
    ['festivals?', 5],
    ['arts', 5],
    ['archives', 6],
    ['creation', 4],
    ['creative spaces?', 12],
    ['espaces? de creation', 12],
    ['lieux culturels', 10],
    ['cultural (spaces?|venues?)', 10],
    ['theatres?', 5],
    ['theaters?', 5],
    ['danse', 4],
    ['dance', 4],
    ['litterature', 4],
    ['literature', 4],
    ['cinema', 3],
    ['musique', 3],
    ['music', 3],
  ],
  community: [
    ['communautaires?', 10],
    ['communit(y|ies)', 8],
    ['quartiers?', 8],
    ['neighbou?rhoods?', 8],
    ['organismes?', 5],
    ['non-?profits?', 8],
    ['osbl', 8],
    ['sans but lucratif', 8],
    ['developpement culturel', 14],
    ['cultural development', 14],
    ['organismes culturels', 10],
    ['cultural organi[sz]ations?', 10],
  ],
  research: [
    ['recherche', 8],
    ['research', 8],
    ['etude', 6],
    ['study', 6],
    ['rapport', 5],
    ['report', 5],
    ['enquete', 6],
    ['survey', 6],
    ['donnees', 5],
    ['data', 4],
    ['observatoire', 10],
    ['observatory', 10],
    ['indicateurs', 6],
    ['indicators', 6],
  ],
  inclusion: [
    ['inclusion', 12],
    ['equite', 12],
    ['equity', 12],
    ['diversite', 8],
    ['diversity', 8],
    ['immigra(nts?|tion)', 12],
    ['newcomers?', 12],
    ['nouveaux arrivants', 12],
    ['personnes immigrantes', 12],
    ['refugi(e|es)', 10],
    ['refugees?', 10],
    ['autochtones?', 10],
    ['indigenous', 10],
    ['racise(e|es|s)?', 10],
    ['anti-?racis(m|me)', 12],
    ['accessibilit(e|y)', 8],
    ['multicultural(ism)?', 12],
    ['multiculturalisme', 12],
    ['minorit(y|ies|e|es)', 8],
    ['culturally diverse', 14],
    ['diversite artistique', 14],
    ['black artists?', 10],
    ['artistes? (noir|noirs|racise|racises|de la diversite)', 12],
  ],
  cooperation: [
    ['unesco', 14],
    ['cooperation', 10],
    ['international', 5],
    ['partenariats?', 8],
    ['partnerships?', 8],
    ['villes creatives', 14],
    ['creative cities', 14],
    ['ententes?', 6],
    ['agreements?', 6],
    ['echanges? culturels?', 12],
    ['cultural exchanges?', 12],
    ['convention', 6],
    ['council of europe', 10],
    ['conseil de l.europe', 10],
  ],
};

/** Anything matching these is left out: not Matin's subject. */
const EXCLUDE = [
  'sports?',
  'sporti(f|ve|fs|ves)',
  'hockey',
  'soccer',
  'football',
  'baseball',
  'basketball',
  'rugby',
  'curling',
  'tennis',
  'golf',
  'athl[eè]t\\w*',
  'nhl',
  'lnh',
  'olympi\\w*',
  'paralympi\\w*',
  'canadiens',
  'grand prix',
  'box[- ]office',
  'celebrit(y|ies|e|es)',
  'vedettes?',
  'horoscope',
  'recettes?',
  'recipes?',
  'meurtre',
  'murder',
  'homicide',
  'arrest(ed|ation)',
  'proces',
  'trial',
  'accident',
  'campagne electorale',
  'election campaign',
  'sondage',
  'palmares',
  'playlist',
  'concours',
  'contest',
  'giveaway',
  'soldes?',
  'black friday',
];

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .replace(/[’']/g, "'")
    .toLowerCase();

const word = (p: string) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${p})(?![\\p{L}\\p{N}])`, 'u');
const THEME_RX = Object.fromEntries(
  Object.entries(THEMES).map(([t, rules]) => [t, rules.map(([p, w]) => [word(p), w, p] as const)]),
) as Record<Topic, (readonly [RegExp, number, string])[]>;
const EXCLUDE_RX = EXCLUDE.map((p) => [word(p), p] as const);
const CULTURE_RX = word('cultur(e|el|elle|els|elles|al|ally)');

export const CREDIBILITY: Record<SourceKind, number> = {
  official: 25,
  institution: 20,
  newsroom: 12,
};

export type Score = { score: number; topic: Topic; reasons: string[]; excluded?: string };

export function scoreItem(
  title: string,
  description: string,
  kind: SourceKind,
  ageDays: number,
): Score {
  const text = fold(`${title} ${description}`);
  const titleText = fold(title);
  const hit = EXCLUDE_RX.find(([rx]) => rx.test(titleText));
  if (hit) return { score: 0, topic: 'policy', reasons: [], excluded: hit[1] };
  // An off-topic word only in the description lowers the score instead of excluding.
  const offTopic = EXCLUDE_RX.find(([rx]) => rx.test(text));

  const reasons: string[] = [];
  let best: Topic = 'policy';
  let bestPoints = 0;
  let relevance = 0;
  for (const [topic, rules] of Object.entries(THEME_RX) as [Topic, (typeof THEME_RX)[Topic]][]) {
    let points = 0;
    const found: string[] = [];
    for (const [rx, weight, p] of rules) {
      if (rx.test(text)) {
        // A keyword in the headline counts more than one only in the description.
        points += rx.test(titleText) ? weight * 1.5 : weight;
        found.push(p.replace(/\|[^)]*\)/g, ')').replace(/[()?\\]|\[.*?\]/g, ''));
      }
    }
    if (points > 0) reasons.push(`${topic}: ${found.slice(0, 3).join(', ')}`);
    relevance += points;
    if (points > bestPoints) [best, bestPoints] = [topic, points];
  }
  relevance = Math.min(50, Math.round(relevance));
  if (CULTURE_RX.test(text)) {
    relevance = Math.min(55, relevance + 5);
    reasons.push('mentions culture');
  }
  if (offTopic) {
    relevance = Math.max(0, relevance - 20);
    reasons.push(`off-topic word "${offTopic[1]}" (-20)`);
  }
  const credibility = CREDIBILITY[kind];
  const freshness = ageDays <= 2 ? 20 : ageDays <= 7 ? 14 : ageDays <= 14 ? 7 : 3;
  reasons.push(
    `source: ${kind} (+${credibility})`,
    `published ${Math.round(ageDays)} days ago (+${freshness})`,
  );
  return {
    // Without at least one real theme keyword, a story never qualifies.
    score: bestPoints < 10 ? 0 : Math.min(100, relevance + credibility + freshness),
    topic: best,
    reasons,
  };
}

/** For national or general feeds: the tab follows the places named in the story. */
export function regionOf(title: string, description: string, fallback: Region): Region {
  const text = fold(`${title} ${description}`);
  if (/(?<!\p{L})montr[eé]al(?!\p{L})/u.test(text)) return 'montreal';
  if (/(?<!\p{L})(quebec|quebecois(e|es)?|du quebec|au quebec)(?!\p{L})/u.test(text))
    return 'quebec';
  return fallback;
}

/** Words of a headline, for spotting the same story told by two publishers. */
export const titleWords = (title: string) =>
  new Set(
    fold(title)
      .split(/[^\p{L}\p{N}]+/u)
      .filter((w) => w.length > 3),
  );

export function sameStory(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return false;
  let common = 0;
  for (const w of a) if (b.has(w)) common++;
  return common / Math.min(a.size, b.size) >= 0.6 && common >= 3;
}
