var cs2 = new Game("Counter Strike 2", ["kills", "damage", "assists", "plants", "defuses"], 5)
var valo = new Game("Valorant", ["kills", "damage", "assists", "spikes", "defuses"], 5)

var bela = new Player("Kovács béla", "belus123", 0, 120_000, cs2, new Date(2026, 9, 19, 23, 30, 0, 0))
var feri = new Player("ferencz józsef", "austrianking223", 1, 100000, valo, new Date(2026, 9, 19, 21, 30, 0, 0))
var gergo = new Player("", "", 2, 50000, valo, new Date(2026, 9, 19, 21, 30, 0, 0))

cs2.add_stat_value("kills", 0, 5);
cs2.add_stat_value("damage", 0, 8);
cs2.remove_stat_value("kills", 0);

console.log(cs2.to_string())