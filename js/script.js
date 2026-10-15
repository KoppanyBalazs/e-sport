const games = [
    new Game("Valorant", ["kills", "assists", "deaths", "spikes", "defuses", "wins", "matches"], 5),
    new Game("Rocket League", ["goals", "assists", "saves", "mvps", "wins", "matches"], 3)
]


const valorant_players = [new Player("Béla a tesztből", "test_bela1", 0, 150_000, games[0])]
const rocket_league_players = [new Player("Nagy Feró", "nyolc_ora_munka", 0, 100_000, games[1])]
var players_used = valorant_players.slice();

var chart = NaN
var deleteID = -1;

const add_modal = new bootstrap.Modal(".add-modal")
const sim_modal = new bootstrap.Modal(".sim-modal")
const delete_modal = new bootstrap.Modal(".delete-modal")
const success_toast = new bootstrap.Toast(".toast")

viewed = 0//0 = valorant 1 = rocket_league

//Teszt adat feltöltés
function add_in_bulk(game_index, id, values) {
    var keys = Object.keys(games[game_index].get_stats())
    for (let i = 0; i < keys.length; i++) {
        games[game_index].add_stat_value(keys[i], id, values[i])
    }
}

//Nem használt de ha akarjuk feltudjuk használni egy keresőhöz pl
function search_player(players, id) {
    var index = -1
    for (let i = 0; i < players.length; i++) {
        if (players[i].get_id() == id) {
            index = i
        }
    }
    return index
}

//chart létrehozása, ha a felhasználó megnyitja az accordiont
function new_chart(id) {
    if (chart) {
        chart.destroy()
    }

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

function write() {
    var output_accordion = document.querySelector(".output")
    var empty_list_text = document.querySelector(".empty_list")
    output_accordion.innerHTML = ""
    var id = -1

    if (players_used.length == 0) {
        empty_list_text.classList.remove('d-none');
    } else {
        empty_list_text.classList.add('d-none')
        //Játéktól függően, accordion-item-ek hozzáadása
        if (!viewed) {
            for (let i = 0; i < players_used.length; i++) {
                id = players_used[i].get_id()

                output_accordion.innerHTML +=
                    `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" onclick = "new_chart(${id})" data-bs-toggle="collapse"
                        data-bs-target="#p-${id}" aria-expanded="false" aria-controls="p-${id}">
                        ${players_used[i].get_name()}
                    </button>
                </h2>
                <div id="p-${id}" class="accordion-collapse collapse">
                    <div class="accordion-body p-3">
                        <div class="row g-2">
                            <div class = "d-flex flex-row">
                                <div class = "p-2 flex-grow-1">
                                <p class = "p-2 fw-bold">Spikes: ${games[viewed].get_stats_value("spikes", id)}</p>
                                <p class = "p-2 fw-bold">Defuses: ${games[viewed].get_stats_value("defuses", id)}</p>
                                <p class = "p-2 fw-bold">K/D: ${games[viewed].get_stats_value("kills", id) / games[viewed].get_stats_value("deaths", id)}</p>
                                <p class = "p-2">Assists: ${games[viewed].get_stats_value("assists", id)}</p>
                                </div>
                                <div class = "p-2 flex-grow-1 chart"><canvas class = "chart-${id}"><canvas></div>
                            </div>
                        </div>
                        <div class="text-end mt-2">
                            <button type="button" class="btn btn-outline-danger btn-sm" onclick="delete_ID(${i})">Játékos törlése</button>
                        </div>
                    </div>
                </div>
            </div>
            `
            }
        }
        else {
            for (let i = 0; i < players_used.length; i++) {
                id = players_used[i].get_id()

                output_accordion.innerHTML +=
                    `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" onclick = "new_chart(${id})" data-bs-toggle="collapse"
                        data-bs-target="#p-${id}" aria-expanded="false" aria-controls="p-${id}">
                        ${players_used[i].get_name()}
                    </button>
                </h2>
                <div id="p-${id}" class="accordion-collapse collapse">
                    <div class="accordion-body p-3">
                        <div class="row g-2">
                            <div class = "d-flex flex-row">
                                <div class = "p-2 flex-grow-1">
                                <p class = "p-2 fw-bold">Goals: ${games[viewed].get_stats_value("goals", id)}</p>
                                <p class = "p-2 fw-bold">Saves: ${games[viewed].get_stats_value("saves", id)}</p>
                                <p class = "p-2 fw-bold">MVPs: ${games[viewed].get_stats_value("mvps", id)}</p>
                                <p class = "p-2">Assists: ${games[viewed].get_stats_value("assists", id)}</p>
                                </div>
                                <div class = "p-2 flex-grow-1 chart"><canvas class = "chart-${id}"><canvas></div>
                            </div>
                        </div>
                        <div class="text-end mt-2">
                            <button type="button" class="btn btn-outline-danger btn-sm" onclick="delete_ID(${i})">Játékos törlése</button>
                        </div>
                    </div>
                </div>
            </div>
            `
            }
        }
    }
}
// success toast helper (ai)

const toast_element = document.querySelector(".toast")
const toast_title = document.querySelector(".toast-header strong")
const toast_body = document.querySelector(".toast-body")
const toast_square = document.querySelector(".toast-square")
const toast = new bootstrap.Toast(toast_element, { delay: 3000 })

function show_toast(title, message, color) {
    toast_title.textContent = title
    toast_body.textContent = message
    toast_square.classList.remove("bg-success", "bg-danger")
    toast_square.classList.add("bg-" + color)
    toast.show()
}

//

function delete_ID(index) {
    deleteID = index;

    document.querySelector(".delete-modal-body").innerHTML = `<p>Biztosan törölni szeretnéd ezt a játékost a ${(viewed) ? "Rocket League" : "Valorant"} csapatból?</p>
                                                        <p class="m-0">${(viewed) ? `${rocket_league_players[index].get_name()} (${rocket_league_players[index].get_nick()})` : `${valorant_players[index].get_name()} (${valorant_players[index].get_nick()})`}</p>`

    delete_modal.show();
}

document.querySelector(".delete-btn").addEventListener('click', () => {
    show_toast("Játékos törölve!", `${players_used[deleteID].get_name()} szerződése törlődött.`, "danger");
    if (viewed) {
        rocket_league_players.splice(deleteID, 1)
        players_used = rocket_league_players.slice();
    } else {
        valorant_players.splice(deleteID, 1)
        players_used = valorant_players.slice();
    }
    write(viewed);
    
})

add_in_bulk(0, 0, [15, 10, 4, 4, 3, 1, 2])
add_in_bulk(1, 0, [10, 12, 4, 1, 3, 3])
write()

//Játék-nézet váltás
document.querySelector(".valorant_btn").addEventListener("click", () => {
    viewed = 0
    players_used = valorant_players.slice()
    document.querySelector(".valorant_btn").classList.add("active")
    document.querySelector(".rocket_league_btn").classList.remove("active")
    write()
})

document.querySelector(".rocket_league_btn").addEventListener("click", () => {
    viewed = 1
    players_used = rocket_league_players.slice()
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

function next_id(players) {
    if (players.length == 0) {
        return 0;
    }
    return players[players.length - 1].get_id() + 1;
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
        if (!viewed) {
            var p = new Player(new_name.value, new_nick.value, next_id(valorant_players), new_pay.value, games[viewed], date_time);
            add_in_bulk(viewed, next_id(valorant_players), [0, 0, 0, 0, 0, 0, 0])
            valorant_players.push(p);
            players_used = valorant_players.slice()
        } else {
            var p = new Player(new_name.value, new_nick.value, next_id(rocket_league_players), new_pay.value, games[viewed], date_time);
            add_in_bulk(viewed, next_id(rocket_league_players), [0, 0, 0, 0, 0, 0])
            rocket_league_players.push(p);
            players_used = rocket_league_players.slice()
        }

        add_modal.hide();
        write();

        new_name.value = new_nick.value = new_date.value = "";
        new_pay.value = 20000;
        rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";


        show_toast("Játékos hozzáadva!", `${p.get_name()} szerződése felvételre került.`, "success");
    }
})

document.querySelector(".sim-modalbtn").addEventListener("click", () => {
    sim_modal.show()

    var inputs = document.querySelector(".sim-inputs")
    inputs.innerHTML = ""

    for (let i = 0; i < players_used.length; i++) {
        inputs.innerHTML +=
            `
        <div class = "p-2 d-flex flex-row justify-content-center form-check">
            <p class = "p-1 flex-grow-1">${i + 1}. Játékos:<p>
            <p class = "p-1 flex-grow-1">${players_used[i].get_nick()}</p>
            <p class = "p-1 flex-grow-1">Játszott:</p>
            <input type = "checkbox" value = "${players_used[i].get_id()}" class = "form-control index-${i} form-check-input">
        </div>
        `
    }

})

//szimuláció indítása
//TODO: ellenőrizni, hogy ne lépje át a maximum játékos számot a meccs
document.querySelector(".sim-btn").addEventListener("click", () => {

    var inputs = []
    var checkbox = ""
    for (let i = 0; i < players_used.length; i++) {
        checkbox = document.querySelector(`.index-${i}`)
        if (checkbox.checked) {
            inputs.push(Number.parseInt(checkbox.value))
        }
    }

    var id = -1
    for (let i = 0; i < inputs.length; i++) {
        id = inputs[i]
        if (!viewed) {
            add_in_bulk(viewed, id, [
                games[viewed].get_stats_value("kills", id) + Math.floor(Math.random() * 31),
                games[viewed].get_stats_value("assists", id) + Math.floor(Math.random() * 31),
                games[viewed].get_stats_value("deaths", id) + Math.floor(Math.random() * 31),
                games[viewed].get_stats_value("spikes", id) + Math.floor(Math.random() * 9),
                games[viewed].get_stats_value("defuses", id) + Math.floor(Math.random() * 9),
                games[viewed].get_stats_value("wins", id) + Math.floor(Math.random() * 2),
                games[viewed].get_stats_value("matches", id) + 1,
            ])
        }
        else {
            add_in_bulk(viewed, id, [
                games[viewed].get_stats_value("goals", id) + Math.floor(Math.random() * 21),
                games[viewed].get_stats_value("assists", id) + Math.floor(Math.random() * 21),
                games[viewed].get_stats_value("saves", id) + Math.floor(Math.random() * 21),
                games[viewed].get_stats_value("mvps", id) + Math.floor(Math.random() * 2.1),
                games[viewed].get_stats_value("wins", id) + Math.floor(Math.random() * 2),
                games[viewed].get_stats_value("matches", id) + 1,
            ])
        }

        console.log(games[viewed].get_stats_value("kills", id) + Math.floor(Math.random() * 31))
    }
    write()

})