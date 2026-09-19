export const teams=[
 ['ARI','Arizona Cardinals','❤️','#97233F'],['ATL','Atlanta Falcons','🦅','#A71930'],['BAL','Baltimore Ravens','🐦','#241773'],['BUF','Buffalo Bills','🦬','#00338D'],['CAR','Carolina Panthers','🐆','#0085CA'],['CHI','Chicago Bears','🐻','#0B162A'],['CIN','Cincinnati Bengals','🐅','#FB4F14'],['CLE','Cleveland Browns','🐶','#311D00'],['DAL','Dallas Cowboys','⭐','#003594'],['DEN','Denver Broncos','🐴','#FB4F14'],['DET','Detroit Lions','🦁','#0076B6'],['GB','Green Bay Packers','🧀','#203731'],['HOU','Houston Texans','🐂','#03202F'],['IND','Indianapolis Colts','🐎','#002C5F'],['JAX','Jacksonville Jaguars','🐆','#006778'],['KC','Kansas City Chiefs','🏹','#E31837'],['LV','Las Vegas Raiders','☠️','#A5ACAF'],['LAC','Los Angeles Chargers','⚡','#0080C6'],['LAR','Los Angeles Rams','🐏','#003594'],['MIA','Miami Dolphins','🐬','#008E97'],['MIN','Minnesota Vikings','🛡️','#4F2683'],['NE','New England Patriots','🏈','#002244'],['NO','New Orleans Saints','⚜️','#D3BC8D'],['NYG','New York Giants','🗽','#0B2265'],['NYJ','New York Jets','✈️','#125740'],['PHI','Philadelphia Eagles','🦅','#004C54'],['PIT','Pittsburgh Steelers','⚫','#FFB612'],['SEA','Seattle Seahawks','🦅','#002244'],['SF','San Francisco 49ers','⛏️','#AA0000'],['TB','Tampa Bay Buccaneers','🏴‍☠️','#D50A0A'],['TEN','Tennessee Titans','⚔️','#0C2340'],['WAS','Washington Commanders','🏈','#5A1414']
] as const;
export type TeamCode=typeof teams[number][0];
export function team(code?:string){return teams.find(item=>item[0]===code)||null;}
export function seasonTheme(date=new Date()){
 const month=date.getMonth()+1; const day=date.getDate();
 if(month===2&&day<=16)return {name:'Super Bowl',emoji:'🏆',copy:'Championship season',className:'from-amber-950/70 via-slate-950 to-slate-950'};
 if(month===11&&day>=20&&day<=30)return {name:'Thanksgiving football',emoji:'🦃',copy:'Turkey, football, and rivalries',className:'from-orange-950/60 via-slate-950 to-slate-950'};
 if(month===12&&day>=15)return {name:'Playoff push',emoji:'❄️',copy:'Every pick matters now',className:'from-sky-950/60 via-slate-950 to-slate-950'};
 if(month>=9||month===1)return {name:'NFL season',emoji:'🏈',copy:'Make every week count',className:'from-emerald-950/60 via-slate-950 to-slate-950'};
 return {name:'Offseason',emoji:'☀️',copy:'The next kickoff is coming',className:'from-indigo-950/60 via-slate-950 to-slate-950'};
}
