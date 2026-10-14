var cs2 = new Game("Counter Strike 2", ["kills", "damage", "assists", "plants", "defuses"], 5)
var valo = new Game("Valorant", ["kills", "damage", "assists", "spikes", "defuses"], 5)
var bela = new Player("Kovács béla", "belus123", 0, 120_000, cs2)

// Player.js funkcióinak tesztjei (Koppány)

//ideiglenesen kivettem mert nem az igazi még a contract
//console.assert(bela.to_string() === "{Kovács Béla;belus123;0;Counter Strike 2;120000}", `Nem megfelelő konstruktor, vagy to_string() : ${bela.to_string()}`)

bela.set_name("Béla")
console.assert(bela.get_name() === "Ismeretlen játékos", `Hibás input ellenőrzés a set_name()-ben : ${bela.get_name()}`)

bela.set_nick("b")
console.assert(bela.get_nick() === "Anonymus", `Hibás input ellenőrzés a set_nick()-ben : ${bela.get_nick()}`)

bela.set_pay(-5)
console.assert(bela.get_pay() === 0, `Hibás input ellenőrzés a set_pay()-ben (túl kicsi érték esetén) : ${bela.get_pay()}`)

bela.set_pay(10000000000)
console.assert(bela.get_pay() === 0, `Hibás input ellenőrzés a set_pay()-ben (túl nagy érték esetén) : ${bela.get_pay()}`)


bela.set_game(valo)
console.assert(bela.get_game().get_name() === "Valorant", `Hibás input ellenőrzés a set_game()-ben : ${bela.get_game().get_name()}`)


// Game.js funkcióinak tesztjei (Kiss)


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

valo.add_stat_value("kills", 2, 15)//itt adja hozzá a 15-öt geci, időt utazik ez a szar
console.assert(valo.get_stats()["kills"][2] === 15, "Hiba az add_stat_value() metódusban! (rossz indexen tárolja el az egyes adatokat!)")

/*
temp: ha először nagyobb indexhez akarunk statot adni, mint ami már meg van adva, akkor automatikusan a legközelebbi indexre 
tárolja el az adatot. frontenden kiküszöbölhető talán

majd a script.js-ben ne felejtsük el ellenőrizni, hogy létezik-e az index amire statot adunk (vagy mondjuk úgy, hogy van-e pl. 5-ös 
indexű ember), vagy majd amikor új playert hoz létre a felhasználó, akkor nézzük meg, melyik játék lett megadva, és az alapján 
adhatunk kezdőértéket az összes statnak, lehet macerás. kell ötlet

illetve arra is gondoljunk, hogy hogyan fogjuk az új játék csapatait eltárolni, illetve a statábrázolásokat hogyan kéne 
megvalósítani (jelenleg a bal oldali kártyákon lévő hely van nekik elkülönítve, logikailag ide inkább csapat szintű statokat kéne 
ábrázolni. de pl. ha k/d-t vagy ilyesmit akarunk, akkor baj lesz, ha a játékban nincs kill. ötlet: az új játék hozzáadására 
vonatkozó résznél textinputok helyett egy dropdown vagy checkbox listából lehetne kiválasztani, hogy mit tárolunk a playerekről, 
talán 1-2 textinput ha van custom stat, a csapatszintű statot pedig radiogombos listábol lehetne kiválasztani, 
hogy mit akar a felhasználó, hogy megjelennen a kártyán (pl. semmi, K/D, Winrate) esetleg).
jelenleg a navbarban van 2db elem ami a két csapatot elkülöníti, de mi van akkor ha túl sok játékot ad hozzá a 
felhasználó? erre kéne egy maximum érték, 3 vagy 4 (nyilván ép eszű ember a való életben nem fog random adogatni játékokat az 
e-sport csapatához, de ha nem gondolunk minden eshetőségre, akkor fix, pontlevonás lesz)

bocs a yap miatt --> nembaj
*/