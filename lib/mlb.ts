const MLB_API = 'https://statsapi.mlb.com/api/v1';

export type MLBTeam = {
    id: number;
    name: string;
    teamName: string;
    locationName: string;
    parentOrgName?: string;
    parentOrgId?: number;
    league?: { id: number; name: string };
    sport?: { id: number; code: string; name: string };
};

export type RosterPerson = {
    person: { id: number; fullName: string };
    jerseyNumber?: string;
    position?: { code?: string; name?: string };
};

export type StaffPerson = {
    person: { id: number; fullName: string };
    job: string;
};

export async function getMiLBTeams(): Promise<MLBTeam[]> {
    // sportId 11 corresponds to Minor League Baseball in Stats API
    const res = await fetch(`${MLB_API}/teams?sportId=11&activeStatus=Y`, { next: { revalidate: 3600 } });
    const json = await res.json();
    return (json?.teams || []) as MLBTeam[];
}

export async function getTeamRoster(teamId: number): Promise<RosterPerson[]> {
    const res = await fetch(`${MLB_API}/teams/${teamId}/roster?rosterType=active`, { next: { revalidate: 600 } });
    const json = await res.json();
    return (json?.roster || []) as RosterPerson[];
}

export function mlbHeadshot(personId: number, size = 80): string {
    return `https://img.mlbstatic.com/mlb-photos/image/upload/w_${size},q_75/v1/people/${personId}/headshot/silo/current`;
}

export function teamLogo(teamId: number, size = 80): string {
    // Public logo CDN variant
    return `https://www.mlbstatic.com/team-logos/${teamId}.svg`;
}

export async function getTeamCoaches(teamId: number): Promise<StaffPerson[]> {
    const res = await fetch(`${MLB_API}/teams/${teamId}/coaches`, { next: { revalidate: 600 } });
    const json = await res.json();
    const staff: StaffPerson[] = (json?.coaches || []).map((c: any) => ({ person: { id: c.person?.id, fullName: c.person?.fullName }, job: c.job || c.title || '' }));
    return staff;
}

export async function getPlayerBio(personId: number): Promise<any> {
    const res = await fetch(`${MLB_API}/people/${personId}`, { next: { revalidate: 600 } });
    const json = await res.json();
    return (json?.people || [])[0] || null;
}

export async function getPlayerStats(personId: number): Promise<{ hitting?: any; pitching?: any; fielding?: any }> {
    const season = new Date().getFullYear();
    const common = `stats=season,career&season=${season}`;
    const [hRes, pRes, fRes] = await Promise.all([
        fetch(`${MLB_API}/people/${personId}/stats?${common}&group=hitting`, { next: { revalidate: 600 } }),
        fetch(`${MLB_API}/people/${personId}/stats?${common}&group=pitching`, { next: { revalidate: 600 } }),
        fetch(`${MLB_API}/people/${personId}/stats?${common}&group=fielding`, { next: { revalidate: 600 } }),
    ]);
    const [h, p, f] = await Promise.all([hRes.json(), pRes.json(), fRes.json()]);
    return {
        hitting: h?.stats || [],
        pitching: p?.stats || [],
        fielding: f?.stats || [],
    };
}


