// ranking helper for model ids

const BAD = /whisper|tts|orpheus|guard|safeguard|embed|moderation|transcribe|image|imagen|veo|dall|audio|live|realtime|allam|rerank|robotics|aqa|nano-banana|omni/i;
const SC = [
  [/pro\b/, 30],
  [/opus/, 35],
  [/sonnet/, 30],
  [/gpt-5/, 35],
  [/gpt-4\.1(?!-mini|-nano)/,25],
  [/gpt-4o(?!-mini)/,20],
  [/3\.8/,28],
  [/3\.6/,20],
  [/3\.5/,14],
  [/405b/,30],
  [/120b/,28],
  [/70b/,25],
  [/32b|27b/,22],
  [/gpt-4o-mini|gpt-4o-mini-1/,10],
  [/mini|tiny|nano|micro|haiku|instant|lite|fast|small/,6],
];

function score(id){
  if(!id) return -9999;
  if(BAD.test(id)) return -9999;
  let s = 0;
  for(const [re, w] of SC){ if(re.test(id)) s += w; }
  // prefer shorter ids slightly
  s -= Math.min(5, id.length/40);
  return s;
}

module.exports = function rank(list){
  if(!Array.isArray(list)) return [];
  return list.filter(id => score(id) > -999).slice().sort((a,b)=>score(b)-score(a));
};
