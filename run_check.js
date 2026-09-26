import obj from './temp2.js';
let hasDupes = false;
for (let key in obj) {
  const list = obj[key];
  if (list.length !== new Set(list).size) {
    console.log(`Duplicate in ${key}:`, list);
    hasDupes = true;
  }
}
if (!hasDupes) console.log("No duplicates in PREDICTIVE_INVOCATIONS.");
