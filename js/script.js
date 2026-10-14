const valorant = new Game("Valorant", ["kills", "assists", "deaths", "spikes", "defuses", "wins", "matches"], 5)
const rocket_league = new Game("Rocket League", ["goals", "assists", "saves", "mvps", "wins", "matches"], 3)

const valorant_players = [new Player("Béla a tesztből", "test_bela1", 0, 150_000, valorant)]
const rocket_league_players = [new Player("Nagy Feró", "nyolc_ora_munka", 0, 100_000, rocket_league)]

var valorant_chart = NaN
var rocket_league_chart = NaN

const add_modal = new bootstrap.Modal(".add-modal")

//Teszt adat feltöltés
valorant.add_stat_value("kills", 0, 15)
valorant.add_stat_value("assists", 0, 10)
valorant.add_stat_value("deaths", 0, 5)
valorant.add_stat_value("spikes", 0, 3)
valorant.add_stat_value("defuses", 0, 4)
valorant.add_stat_value("wins", 0, 1)
valorant.add_stat_value("matches", 0, 2)

rocket_league.add_stat_value("goals", 0, 4)
rocket_league.add_stat_value("assists", 0, 7)
rocket_league.add_stat_value("saves", 0, 2)
rocket_league.add_stat_value("mvps", 0, 1)
rocket_league.add_stat_value("wins", 0, 1)
rocket_league.add_stat_value("matches", 0, 1)

var viewed = "valorant"

//chart létrehozása, ha a felhasználó megnyitja az accordiont
function new_chart(id) {
    if (viewed == "valorant") {

        //valorant chartja
        valorant_chart = new Chart(
            document.querySelector(`.chart-${id}`),//canvas amire rakjuk
            {
                type: "doughnut",//típusa
                data: {//adatok
                    datasets: [{
                        data: [
                            valorant.get_stats_value("wins", id), //wins
                            valorant.get_stats_value("matches", id) - valorant.get_stats_value("wins", id)//nem tároljuk a vereségeket, ezért a matches - win a vereségek száma
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
        valorant_chart.resize()
        valorant_chart.update()
    }
    else if (viewed = "rocket_league") {

        //rocket league chartja
        rocket_league_chart = new Chart(
            document.querySelector(`.chart-${id}`),//canvas amire rakjuk
            {
                type: "doughnut",//típusa
                data: {//adatok
                    datasets: [{
                        data: [
                            rocket_league.get_stats_value("wins", id), //wins
                            rocket_league.get_stats_value("matches", id) - rocket_league.get_stats_value("wins", id)//nem tároljuk a vereségeket, ezért a matches - win a vereségek száma
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
        rocket_league_chart.resize()
        rocket_league_chart.update()
    }
}

function write(viewed) {
    output_accordion = document.querySelector(".output")
    output_accordion.innerHTML = ""

    //Játéktól függően, accordion-item-ek hozzáadása
    if (viewed == "valorant") {
        for (let i = 0; i < valorant_players.length; i++) {

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
                                <p class = "p-2 fw-bold">Spikes: ${valorant.get_stats_value("spikes", valorant_players[i].get_id())}</p>
                                <p class = "p-2 fw-bold">Defuses: ${valorant.get_stats_value("defuses", valorant_players[i].get_id())}</p>
                                <p class = "p-2 fw-bold">K/D: ${valorant.get_stats_value("kills", valorant_players[i].get_id()) / valorant.get_stats_value("deaths", valorant_players[i].get_id())}</p>
                                <p class = "p-2">Assists: ${valorant.get_stats_value("assists", valorant_players[i].get_id())}</p>
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
    else if (viewed == "rocket_league") {
        for (let i = 0; i < rocket_league_players.length; i++) {

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
                                <p class = "p-2 fw-bold">Goals: ${rocket_league.get_stats_value("goals", rocket_league_players[i].get_id())}</p>
                                <p class = "p-2 fw-bold">Saves: ${rocket_league.get_stats_value("saves", rocket_league_players[i].get_id())}</p>
                                <p class = "p-2 fw-bold">MVPs: ${rocket_league.get_stats_value("mvps", rocket_league_players[i].get_id())}</p>
                                <p class = "p-2">Assists: ${rocket_league.get_stats_value("assists", rocket_league_players[i].get_id())}</p>
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

write(viewed)

//Játék-nézet váltás
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

/////////////////add-modal

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

        if (viewed == "valorant") {
            var p = new Player(new_name.value, new_nick.value, valorant_players.length, new_pay.value, valorant, date_time);
            valorant_players.push(p);
        } else if (viewed == "rocket_league") {
            var p = new Player(new_name.value, new_nick.value, rocket_league_players.length, new_pay.value, rocket_league, date_time);
            rocket_league_players.push(p);
        }

        add_modal.hide();
        write(viewed);
    }
})


const rangeInput = document.getElementById('range4');
const rangeOutput = document.getElementById('rangeValue');

rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";

rangeInput.addEventListener('input', function () {
    rangeOutput.textContent = Intl.NumberFormat().format(this.value) + " Ft";
});

