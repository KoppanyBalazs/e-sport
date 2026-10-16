var cs2 = new Game("Counter Strike 2", ["kills", "damage", "assists", "plants", "defuses"], 5)
var valo = new Game("Valorant", ["kills", "damage", "assists", "spikes", "defuses"], 5)
var bela = new Player("Kovács béla", "belus123", 0, 120_000, cs2)

var feri = new Player("ferencz józsef", "austrianking223", 1, 100000, valo)
var gergo = new Player("", "", 2, 50000, valo)

bela.set_id(0);
bela.set_game(valo);
console.assert(valo.to_string() === "{Valorant;Üres;5}", "Hiba a remove_empty() metódusban! (Visszaad üres mező értékeket is!)")
valo.add_stat_value("kills", 0, 18)
valo.add_stat_value("defuses", 0, 2)

console.assert(valo.to_string() === "{Valorant;[[18],[2]];5}", "Hiba az add_stat_value() metódus működésében! (nem adódnak hozzá a statok)")

console.assert(valo.remove_stat_value("kills", 0), "Hiba a remove_stat_value() metódusban! (nem távolít el valid értéket)")
console.assert(!valo.remove_stat_value("kills", 0), "Hiba a remove_stat_value() metódusban! (eltávolít invalid értéket)")
console.log(valo.get_stats()["kills"]) //--> 12, 30, 15

valo.add_stat_value("kills", 2, 80)
valo.add_stat_value("kills", 1, 30)
valo.add_stat_value("kills", 0, 12)
console.assert(valo.get_stats()["kills"][2] === 80, "Hiba az add_stat_value() metódusban! (rossz indexen tárolja el az egyes adatokat, ha nem létező indexre próbálunk hivatkozni!)")

valo.add_stat_value("kills", 2, 15)
console.assert(valo.get_stats()["kills"][2] === 15, "Hiba az add_stat_value() metódusban! (rossz indexen tárolja el az egyes adatokat!)")