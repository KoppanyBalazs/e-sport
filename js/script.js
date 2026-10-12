const valorant = new Game("Valorant", ["kills", "assists", "deaths", "spikes", "defuses", "wins", "matches"], 5)
const rocket_league = new Game("Rocket League", ["goals", "assists", "saves", "mvps", "wins", "matches"], 3)

const valorant_players = [new Player("Béla a tesztből", "test_bela1", 0, 150_000, valorant)]
const rocket_league_players = [new Player("Nagy Feró", "nyolc_ora_munka", 0, 100_000, rocket_league)]

var viewed = "valorant"

function write(viewed){
    output_accordion = document.querySelector(".output")
    output_accordion.innerHTML = ""

    if(viewed == "valorant"){
        for(let i = 0; i < valorant_players.length; i++){
            //TODO: statok kiírása
            output_accordion.innerHTML += 
            `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#p-${valorant_players[i].get_id()}" aria-expanded="false" aria-controls="p-${valorant_players[i].get_id()}">
                        ${valorant_players[i].get_name()}
                    </button>
                </h2>
                <div id="p-${valorant_players[i].get_id()}" class="accordion-collapse collapse">
                    <div class="accordion-body p-3">
                        <div class="row g-2">
                        <h2 class = "text-danger">Statok</h2>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }
    else if(viewed == "rocket_league"){
        for(let i = 0; i < valorant_players.length; i++){
            //TODO: statok kiírása
            output_accordion.innerHTML += 
            `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#p-${rocket_league_players[i].get_id()}" aria-expanded="false" aria-controls="p-${rocket_league_players[i].get_id()}">
                        ${rocket_league_players[i].get_name()}
                    </button>
                </h2>
                <div id="p-${rocket_league_players[i].get_id()}" class="accordion-collapse collapse">
                    <div class="accordion-body p-3">
                        <div class="row g-2">
                        <h2 class = "text-danger">Statok</h2>
                        </div>
                    </div>
                </div>
            </div>
            `
        }      
    }
}

write(viewed)

document.querySelector(".valorant_btn").addEventListener("click", () => {
    viewed = "valorant"
    document.querySelector(".valorant_btn").classList.add("active")
    document.querySelector(".rocket_league_btn").classList.remove("active")
    write(viewed)
})

document.querySelector(".rocket_league_btn").addEventListener("click", () => {
    viewed = "rocket_league"
    document.querySelector(".rocket_league_btn").classList.add("active")
    document.querySelector(".valorant_btn").classList.remove("active")
    write(viewed)
})