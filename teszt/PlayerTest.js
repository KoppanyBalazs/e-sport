var cs2 = new Game("Counter Strike 2", ["kills", "damage", "assists", "plants", "defuses"], 5)
var valo = new Game("Valorant", ["kills", "damage", "assists", "spikes", "defuses"], 5)

var bela = new Player("Kovács béla", "belus123", 0, 120_000, cs2, new Date(2026, 9, 19, 23, 30, 0, 0))
var hibas_andras = new Player("", "", -5, 5_000_000, bela, new Date(2025, 9, 19, 21, 30, 0, 0))

console.assert(bela.to_string() === "{Kovács Béla;belus123;0;Counter Strike 2;120000;Mon Oct 19 2026 23:30:00 GMT+0200 (közép-európai nyári idő)}", `Hiba a setter-ekben : ${bela.to_string()}`)
console.assert(hibas_andras.to_string() === "{Ismeretlen Játékos;Anonymus;0;Nincs játék hozzádrendelve;0;Sun Oct 19 2026 21:30:00 GMT+0200 (közép-európai nyári idő)}", `Hiba a setter-ekben (ha rossz input-ot ad meg a felhasználó) :  ${hibas_andras.to_string()}`)
//Nem ellenőrzi hogy biztosan game osztály van-e megadva

hibas_andras.set_pay(-5)
console.assert(hibas_andras.get_pay() === 0, `Hibás input ellenőrzés a set_pay()-ben (túl kicsi érték esetén) : ${bela.get_pay()}`)

hibas_andras.set_name("123 andris fiú")
console.assert(hibas_andras.get_name() === "Ismeretlen Játékos", `Hiba a set_name metódusban (szám megadásakor) : ${hibas_andras.get_name()}`)
//Számokat is enged megadni a névbe

var now = new Date()
console.assert(bela.get_contractleft() === Math.floor((bela.get_contracttime().getTime() - now.getTime()) / 1000), `Hiba a get_contractleft metódusban(Ha nem járt le a szerződés) : ${bela.get_contractleft}`)
console.assert(hibas_andras.get_contractleft() === "Lejárt", `Hiba a get_contractleft metódusban(Ha lejárt a szerződés) : ${hibas_andras.get_contractleft()}`)