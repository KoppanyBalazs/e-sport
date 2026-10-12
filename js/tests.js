cs2 = new Game("Counter Strike 2", ["kills", "damage", "assists", "plants", "defuses"], 5)
valo = new Game("Valorant", ["kills", "damage", "assists", "spikes", "defuses"], 5)
bela = new Player("Kovács béla", "belus123", 0, 120_000, cs2)

console.assert(bela.to_string() === "{Kovács Béla;belus123;0;120000;Counter Strike 2}", `Nem megfelelő konstruktor, vagy to_string() : ${bela.to_string()}`)

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
