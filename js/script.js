const games = [
    new Game("Valorant", ["kills", "assists", "deaths", "spikes", "defuses", "wins", "matches"], 5),
    new Game("Rocket League", ["goals", "assists", "saves", "mvps", "wins", "matches"], 3)
]


const valorant_players = [new Player("Béla a tesztből", "test_bela1", 0, 150_000, games[0])]
const rocket_league_players = [new Player("Nagy Feró", "nyolc_ora_munka", 0, 100_000, games[1])]

var valorant_chart = NaN
var rocket_league_chart = NaN

const add_modal = new bootstrap.Modal(".add-modal")

viewed = 0//0 = valorant 1 = rocket_league

//Teszt adat feltöltés
function add_in_bulk(game_index, id, values){
    keys = Object.keys(games[game_index].get_stats())
    for(let i = 0; i < keys.length; i++){
        games[game_index].add_stat_value(keys[i], id, values[i])
    }
}

function search_player(players,id){
    var index = -1
    for(let i = 0; i < players.length; i++){
        if(players[i].get_id() == id){
            index = i
        }
    }
    return index
}

//chart létrehozása, ha a felhasználó megnyitja az accordiont
function new_chart(id){

    //chart létrehozás
    chart = new Chart(
        document.querySelector(`.chart-${id}`),//canvas amire rakjuk
        {
            type: "doughnut",//típusa
            data: {//adatok
                datasets: [{
                    data: [
                        games[viewed].get_stats_value("wins", id), //wins
                        games[viewed].get_stats_value("matches", id) - games[viewed].get_stats_value("wins", id)//nem tároljuk a vereségeket, ezért a matches - win a vereségek száma
                    ]
                }],
                labels: ["wins", "losses"]
            },
            options: {
                animation: false,//crazy ha true-n van rezgés majd javítani kell valahogy
                responsive: true
            }

        }
    )
    chart.resize()
    chart.update()
    
}

function write(){
    output_accordion = document.querySelector(".output")
    output_accordion.innerHTML = ""

    //Játéktól függően, accordion-item-ek hozzáadása
    if(! viewed){
        for(let i = 0; i < valorant_players.length; i++){

            output_accordion.innerHTML += 
            `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" onclick = "new_chart(${valorant_players[i].get_id()})" data-bs-toggle="collapse"
                        data-bs-target="#p-${valorant_players[i].get_id()}" aria-expanded="false" aria-controls="p-${valorant_players[i].get_id()}">
                        ${valorant_players[i].get_name()}
                    </button>
                </h2>
                <div id="p-${valorant_players[i].get_id()}" class="accordion-collapse collapse">
                    <div class="accordion-body p-3">
                        <div class="row g-2">
                            <div class = "d-flex flex-row">
                                <div class = "p-2 flex-grow-1">
                                <p class = "p-2 fw-bold">Spikes: ${games[viewed].get_stats_value("spikes", valorant_players[i].get_id())}</p>
                                <p class = "p-2 fw-bold">Defuses: ${games[viewed].get_stats_value("defuses", valorant_players[i].get_id())}</p>
                                <p class = "p-2 fw-bold">K/D: ${games[viewed].get_stats_value("kills", valorant_players[i].get_id()) / games[viewed].get_stats_value("deaths", valorant_players[i].get_id())}</p>
                                <p class = "p-2">Assists: ${games[viewed].get_stats_value("assists", valorant_players[i].get_id())}</p>
                                </div>
                                <div class = "p-2 flex-grow-1"><canvas class = "chart-${valorant_players[i].get_id()}"><canvas></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }
    else if(viewed){
        for(let i = 0; i < rocket_league_players.length; i++){

            output_accordion.innerHTML += 
            `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" onclick = "new_chart(${rocket_league_players[i].get_id()})" data-bs-toggle="collapse"
                        data-bs-target="#p-${rocket_league_players[i].get_id()}" aria-expanded="false" aria-controls="p-${rocket_league_players[i].get_id()}">
                        ${rocket_league_players[i].get_name()}
                    </button>
                </h2>
                <div id="p-${rocket_league_players[i].get_id()}" class="accordion-collapse collapse">
                    <div class="accordion-body p-3">
                        <div class="row g-2">
                            <div class = "d-flex flex-row">
                                <div class = "p-2 flex-grow-1">
                                <p class = "p-2 fw-bold">Goals: ${games[viewed].get_stats_value("goals", rocket_league_players[i].get_id())}</p>
                                <p class = "p-2 fw-bold">Saves: ${games[viewed].get_stats_value("saves", rocket_league_players[i].get_id())}</p>
                                <p class = "p-2 fw-bold">MVPs: ${games[viewed].get_stats_value("mvps", rocket_league_players[i].get_id())}</p>
                                <p class = "p-2">Assists: ${games[viewed].get_stats_value("assists", rocket_league_players[i].get_id())}</p>
                                </div>
                                <div class = "p-2 flex-grow-1"><canvas class = "chart-${rocket_league_players[i].get_id()}"><canvas></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }      
    }
}

add_in_bulk(0, 0, [15, 10, 4, 4, 3, 1, 2])
add_in_bulk(1, 0, [10, 12, 4, 1, 3, 3])
write()

//Játék-nézet váltás
document.querySelector(".valorant_btn").addEventListener("click", () => {
    viewed = 0
    document.querySelector(".valorant_btn").classList.add("active")
    document.querySelector(".rocket_league_btn").classList.remove("active")
    write()
})

document.querySelector(".rocket_league_btn").addEventListener("click", () => {
    viewed = 1
    document.querySelector(".rocket_league_btn").classList.add("active")
    document.querySelector(".valorant_btn").classList.remove("active")
    write()
})

/////////////////add-modal
const rangeInput = document.getElementById('range4');
const rangeOutput = document.getElementById('rangeValue');

rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";

rangeInput.addEventListener('input', function () {
    rangeOutput.textContent = Intl.NumberFormat().format(this.value) + " Ft";
});


var new_name = document.querySelector(".add-name");
var new_nick = document.querySelector(".add-nick");
var new_pay = document.querySelector(".add-pay");
var new_date = document.querySelector(".add-date");
var new_time = document.querySelector(".add-time");
var date_error = document.querySelector(".date-error")

document.querySelector(".add-modalbtn").addEventListener('click', () => {
    add_modal.show();
    new_name.classList.remove("is-invalid")
    new_nick.classList.remove("is-invalid")
    new_date.classList.remove("is-invalid")
    new_time.classList.remove("is-invalid")
    date_error.classList.remove("d-block")
})

function is_valid_input() {
    var name_valid = new_name.value.trim().length > 5
    for (let i = 0; i < new_name.value.length; i++) {
        if ("0123456789".includes(new_name.value[i])) {
            name_valid = false;
        }
    }
    var nick_valid = new_nick.value.trim().length > 2

    var date_time = new Date(new_date.value + "T" + new_time.value)
    var date_valid = new_date.value != "" && new_time.value != "" && date_time > new Date()

    new_name.classList.toggle("is-invalid", !name_valid)
    new_nick.classList.toggle("is-invalid", !nick_valid)
    new_date.classList.toggle("is-invalid", !date_valid)
    new_time.classList.toggle("is-invalid", !date_valid)
    date_error.classList.toggle("d-block", !date_valid)

    return name_valid && nick_valid && date_valid
}

document.querySelector(".add-btn").addEventListener('click', () => {
    if (!is_valid_input()) {
        return;
    } else {
        var date_parts = new_date.value.split("-");
        var time_parts = new_time.value.split(":");
        var date_time = new Date(
            parseInt(date_parts[0]),
            parseInt(date_parts[1]) - 1,
            parseInt(date_parts[2]),
            parseInt(time_parts[0]),
            parseInt(time_parts[1])
        );

        if (! viewed) {
            var p = new Player(new_name.value, new_nick.value, valorant_players.length, new_pay.value, games[viewed], date_time);
            valorant_players.push(p);
        } else if (viewed) {
            var p = new Player(new_name.value, new_nick.value, rocket_league_players.length, new_pay.value, games[viewed], date_time);
            rocket_league_players.push(p);
        }

        add_modal.hide();
        write();

        new_name.value = new_nick.value = new_date.value = "";
        new_pay.value = 20000;
        rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";
    }
})

