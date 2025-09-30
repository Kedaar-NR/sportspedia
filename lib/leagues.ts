export type LeagueMeta = {
    id: string;
    name: string;
    short?: string;
    country: string;
    flag: string; // emoji
    logo: string; // URL
    tiers?: { key: string; name: string }[]; // optional sub-leagues
};

export const leaguesMeta: LeagueMeta[] = [
    { id: 'premier-league', name: 'Premier League', short: 'EPL', country: 'England', flag: '🇬🇧', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg', tiers: [{ key: 'Premier League', name: 'Premier League' }, { key: 'EFL Championship', name: 'Championship' }] },
    { id: 'la-liga', name: 'La Liga', short: 'LaLiga', country: 'Spain', flag: '🇪🇸', logo: 'https://upload.wikimedia.org/wikipedia/en/9/92/La_Liga_Santander.svg', tiers: [{ key: 'La Liga', name: 'La Liga' }, { key: 'Segunda División', name: 'Segunda División' }] },
    { id: 'bundesliga', name: 'Bundesliga', short: 'Bundesliga', country: 'Germany', flag: '🇩🇪', logo: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg', tiers: [{ key: 'Bundesliga', name: 'Bundesliga' }, { key: '2. Bundesliga', name: '2. Bundesliga' }] },
    { id: 'serie-a', name: 'Serie A', short: 'Serie A', country: 'Italy', flag: '🇮🇹', logo: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Serie_A_logo_%282019%29.svg', tiers: [{ key: 'Serie A', name: 'Serie A' }, { key: 'Serie B', name: 'Serie B' }] },
    { id: 'ligue-1', name: 'Ligue 1', short: 'Ligue 1', country: 'France', flag: '🇫🇷', logo: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Ligue1_Uber_Eats_Logo.svg', tiers: [{ key: 'Ligue 1', name: 'Ligue 1' }, { key: 'Ligue 2', name: 'Ligue 2' }] },
    {
        id: 'mlb', name: 'Major League Baseball', short: 'MLB', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Major_League_Baseball_logo.svg',
        tiers: [
            { key: 'American League East', name: 'AL East' },
            { key: 'American League Central', name: 'AL Central' },
            { key: 'American League West', name: 'AL West' },
            { key: 'National League East', name: 'NL East' },
            { key: 'National League Central', name: 'NL Central' },
            { key: 'National League West', name: 'NL West' },
        ]
    },
    {
        id: 'nba', name: 'National Basketball Association', short: 'NBA', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg',
        tiers: [
            { key: 'NBA Atlantic Division', name: 'Atlantic' },
            { key: 'NBA Central Division', name: 'Central' },
            { key: 'NBA Southeast Division', name: 'Southeast' },
            { key: 'NBA Northwest Division', name: 'Northwest' },
            { key: 'NBA Pacific Division', name: 'Pacific' },
            { key: 'NBA Southwest Division', name: 'Southwest' },
        ]
    },
    {
        id: 'nfl', name: 'National Football League', short: 'NFL', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/National_Football_League_logo.svg',
        tiers: [
            { key: 'AFC East', name: 'AFC East' },
            { key: 'AFC North', name: 'AFC North' },
            { key: 'AFC South', name: 'AFC South' },
            { key: 'AFC West', name: 'AFC West' },
            { key: 'NFC East', name: 'NFC East' },
            { key: 'NFC North', name: 'NFC North' },
            { key: 'NFC South', name: 'NFC South' },
            { key: 'NFC West', name: 'NFC West' },
        ]
    },
    {
        id: 'nhl', name: 'National Hockey League', short: 'NHL', country: 'USA/Canada', flag: '🇺🇸🇨🇦', logo: 'https://upload.wikimedia.org/wikipedia/en/3/3a/05_NHL_Shield.svg',
        tiers: [
            { key: 'NHL Atlantic Division', name: 'Atlantic' },
            { key: 'NHL Metropolitan Division', name: 'Metropolitan' },
            { key: 'NHL Central Division', name: 'Central' },
            { key: 'NHL Pacific Division', name: 'Pacific' },
        ]
    },
];

export function getLeagueMeta(id: string) {
    return leaguesMeta.find(l => l.id === id);
}


