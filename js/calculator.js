// Pack Weight Calculator Logic
document.addEventListener('DOMContentLoaded', function() {
    updateCalculator();
    const inputs = document.querySelectorAll('input[type="number"], input[type="checkbox"], select');
    inputs.forEach(input => input.addEventListener('change', updateCalculator));
});

function updateCalculator() {
    const gearItems = [
        { id: 'backpack', weight: getWeight('backpackWeight'), worn: isChecked('backpackWorn'), shared: false, consumable: false },
        { id: 'tent', weight: getWeight('tentWeight'), worn: false, shared: isChecked('tentShared'), consumable: false },
        { id: 'bag', weight: getWeight('bagWeight'), worn: isChecked('bagWorn'), shared: false, consumable: false },
        { id: 'pad', weight: getWeight('padWeight'), worn: isChecked('padWorn'), shared: false, consumable: false },
        { id: 'stove', weight: getWeight('stoveWeight'), worn: false, shared: isChecked('stoveShared'), consumable: false },
        { id: 'water', weight: getWeight('waterWeight'), worn: false, shared: false, consumable: isChecked('waterConsumable') },
        { id: 'food', weight: getWeight('foodWeight'), worn: false, shared: false, consumable: isChecked('foodConsumable') },
        { id: 'fuel', weight: getWeight('fuelWeight'), worn: false, shared: false, consumable: isChecked('fuelConsumable') },
        { id: 'clothing', weight: getWeight('clothingWeight'), worn: isChecked('clothingWorn'), shared: false, consumable: false },
        { id: 'firstAid', weight: getWeight('firstAidWeight'), worn: false, shared: isChecked('firstAidShared'), consumable: false }
    ];
    let baseWeight = 0, consumableWeight = 0, wornWeight = 0;
    gearItems.forEach(item => {
        if (item.consumable) consumableWeight += item.weight;
        else if (item.worn) wornWeight += item.weight;
        else baseWeight += item.shared ? item.weight / 2 : item.weight;
    });
    const totalWeight = baseWeight + consumableWeight + wornWeight;
    document.getElementById('totalWeight').textContent = totalWeight.toFixed(1);
    document.getElementById('baseWeight').textContent = baseWeight.toFixed(1) + ' lbs';
    document.getElementById('consumableWeight').textContent = consumableWeight.toFixed(1) + ' lbs';
    document.getElementById('wornWeight').textContent = wornWeight.toFixed(1) + ' lbs';
    updateWeightRating(totalWeight, baseWeight);
    updateOptimizationTips(gearItems);
}

function getWeight(id) { const el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; }
function isChecked(id) { const el = document.getElementById(id); return el ? el.checked : false; }

function updateWeightRating(total, base) {
    let rating = '', color = '', message = '';
    if (total < 15) { rating = 'Ultralight!'; color = 'text-green-600'; message = 'Excellent pack weight.'; }
    else if (total < 25) { rating = 'Lightweight'; color = 'text-green-600'; message = 'Good for most trips.'; }
    else if (total < 35) { rating = 'Moderate'; color = 'text-orange-600'; message = 'Consider trimming non-essentials.'; }
    else { rating = 'Heavy'; color = 'text-red-600'; message = 'Your knees will thank you if you lighten up.'; }
    document.getElementById('weightRating').innerHTML = `<div class="font-semibold mb-2">Your Pack Rating:</div><div class="text-lg font-bold ${color}">${rating}</div><p class="text-sm text-gray-600 mt-1">${message}</p>`;
}

function updateOptimizationTips(gearItems) {
    const tipsDiv = document.getElementById('optimizationTips');
    let tips = [];
    gearItems.forEach(item => {
        if (item.weight > 3 && !item.consumable && !item.worn) {
            if (item.id === 'tent') tips.push({ item: 'Tent', weight: item.weight, suggestion: 'Consider a trekking pole tent like Zpacks Duplex (1.2 lbs)' });
            else if (item.id === 'backpack') tips.push({ item: 'Backpack', weight: item.weight, suggestion: 'Check out Hyperlite or Zpacks (2-2.5 lbs)' });
            else if (item.id === 'bag') tips.push({ item: 'Sleeping bag', weight: item.weight, suggestion: 'A quilt saves 8-12 oz (EE Revelation)' });
        }
    });
    const foodItem = gearItems.find(i => i.id === 'food');
    if (foodItem && foodItem.weight > 2) tips.push({ item: 'Food', weight: foodItem.weight, suggestion: 'Repackage food to remove excess packaging' });
    if (tips.length > 0) {
        let html = '';
        tips.forEach(tip => html += `<div class="flex items-start gap-2 text-sm"><i class="fas fa-lightbulb text-yellow-500 mt-1"></i><div><span class="font-medium">${tip.item} (${tip.weight.toFixed(1)} lbs)</span> is heavy. ${tip.suggestion}.</div></div>`);
        tipsDiv.innerHTML = html;
    } else tipsDiv.innerHTML = '<p class="text-sm text-gray-600">Great job! Your pack is well optimized.</p>';
}

function saveList() {
    const gearData = {};
    document.querySelectorAll('input[type="number"], input[type="checkbox"]').forEach(input => gearData[input.id] = input.type === 'checkbox' ? input.checked : input.value);
    localStorage.setItem('savedGearList', JSON.stringify(gearData));
    alert('Gear list saved!');
}
function loadList() {
    const saved = localStorage.getItem('savedGearList');
    if (saved) {
        const gearData = JSON.parse(saved);
        Object.keys(gearData).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.type === 'checkbox' ? el.checked = gearData[id] : el.value = gearData[id];
        });
        updateCalculator();
        alert('Gear list loaded!');
    } else alert('No saved list found');
}
function addCustomItem() { alert('Add custom item feature - would open a modal'); }