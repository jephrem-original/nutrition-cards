const targets = {
  workout: { protein: 6, carb: 8, fat: 6, veg: 3 },
  rest: { protein: 6, carb: 6, fat: 6, veg: 3 }
};
const labels = { protein:'Protein', carb:'Carbs', fat:'Fat', veg:'Veg' };
const colors = { protein:'protein', carb:'carb', fat:'fat', veg:'veg' };
const foods = [
  ['Whey scoop',{protein:1}], ['Chicken 4 oz',{protein:1}], ['Greek yogurt',{protein:1}], ['Cottage cheese',{protein:1}],
  ['Banana',{carb:1}], ['Rice 1/2 cup',{carb:1}], ['Potato 1/2 large',{carb:1}], ['Oats 1/2 cup dry',{carb:1}],
  ['Beans 1/2 cup',{carb:1}], ['Apple',{carb:1}], ['Olive oil 1 tbsp',{fat:1}], ['Peanut butter 1 tbsp',{fat:1}],
  ['Avocado 1/4',{fat:1}], ['Almonds 15',{fat:1}], ['Vegetables',{veg:1}]
];
const meals = [
  ['Pre-workout', {protein:1, carb:1}],
  ['Post-workout', {protein:1.5, carb:2}],
  ['Lunch basic', {protein:1.5, carb:2, fat:1, veg:1}],
  ['Dinner basic', {protein:2, carb:2, fat:2, veg:1}],
  ['Protein snack', {protein:1}],
  ['Treat budget', {carb:2, fat:2}]
];
const key = 'nutritionCards.v1';
let state = load();
let history = [];
function todayKey(){ return new Date().toISOString().slice(0,10); }
function load(){
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  if(saved.date !== todayKey()) return {date:todayKey(), type:'workout', used:{protein:0,carb:0,fat:0,veg:0}, note:''};
  return saved;
}
function save(){ localStorage.setItem(key, JSON.stringify(state)); }
function spend(cost){ history.push(JSON.parse(JSON.stringify(state))); for(const k in cost) state.used[k]=(state.used[k]||0)+cost[k]; save(); render(); }
function adjust(k, delta){ history.push(JSON.parse(JSON.stringify(state))); state.used[k]=Math.max(0,(state.used[k]||0)+delta); save(); render(); }
function render(){
  document.getElementById('dateLabel').textContent = new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
  document.getElementById('workoutBtn').classList.toggle('active', state.type==='workout');
  document.getElementById('restBtn').classList.toggle('active', state.type==='rest');
  const t = targets[state.type];
  document.getElementById('cards').innerHTML = Object.keys(t).map(k=>{
    const used = state.used[k] || 0; const pct = Math.min(100, (used/t[k])*100);
    return `<article class="macro ${colors[k]}"><div class="macro-head"><div class="macro-title">${labels[k]}</div><div class="count">${used}/${t[k]}</div></div><div class="bar"><div class="fill" style="width:${pct}%"></div></div><div class="actions"><button onclick="adjust('${k}',-.5)">−½</button><button onclick="adjust('${k}',.5)">+½</button><button onclick="adjust('${k}',1)">+1</button></div></article>`
  }).join('');
  document.getElementById('meals').innerHTML = meals.map(([name,cost])=>`<button class="meal" onclick='spend(${JSON.stringify(cost)})'>${name}<small>${costText(cost)}</small></button>`).join('');
 function renderFoodGroup(id, macro) {

  document.getElementById(id).innerHTML = foods

    .filter(([name, cost]) => cost[macro])

    .map(([name, cost]) => `<button class="food" onclick='spend(${JSON.stringify(cost)})'>${name}<small>${costText(cost)}</small></button>`)

    .join('');

}

renderFoodGroup('proteinFoods', 'protein');

renderFoodGroup('carbFoods', 'carb');

renderFoodGroup('fatFoods', 'fat');

renderFoodGroup('vegFoods', 'veg');.innerHTML = foods.map(([name,cost])=>`<button class="food" onclick='spend(${JSON.stringify(cost)})'>${name}<small>${costText(cost)}</small></button>`).join('');
  document.getElementById('note').value = state.note || '';
}
function costText(cost){ return Object.entries(cost).map(([k,v])=>`${v} ${labels[k]}`).join(' · '); }
document.getElementById('workoutBtn').onclick=()=>{state.type='workout';save();render()};
document.getElementById('restBtn').onclick=()=>{state.type='rest';save();render()};
document.getElementById('resetBtn').onclick=()=>{history.push(JSON.parse(JSON.stringify(state)));state.used={protein:0,carb:0,fat:0,veg:0};state.note='';save();render()};
document.getElementById('undoBtn').onclick=()=>{const prev=history.pop(); if(prev){state=prev;save();render();}};
document.getElementById('saveBtn').onclick=()=>{state.note=document.getElementById('note').value;save();alert('Saved')};
document.getElementById('note').addEventListener('input', e=>{state.note=e.target.value;save();});
if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
render();
