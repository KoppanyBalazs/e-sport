const games = [
    new Game("Valorant", ["kills", "assists", "deaths", "spikes", "defuses", "wins", "matches"], 5),
    new Game("Rocket League", ["goals", "assists", "saves", "mvps", "wins", "matches"], 3)
]


const valorant_players = [
    new Player("Béla a tesztből", "test_bela1", 0, 150_000, games[0], new Date(2026, 9, 19, 23, 30, 0, 0)),
    new Player("Lejárt János", "janika", 1, 30_000, games[0], new Date(2025, 9, 19, 23, 30, 0, 0)),
    new Player("Kincses Ádám", "xxx_kincses_xxx", 2, 550_000, games[0], new Date(2028, 5, 15, 15, 15, 0, 0)),
    new Player("Ferenc József", "austrianking223", 3, 125_001, games[0], new Date(2026, 9, 25, 24, 0, 0, 0)),
    new Player("Koppány Félix", "Cpt. Meatballz", 4, 1_000_000, games[0], new Date(2035, 0, 1, 0, 0, 0, 0))]
const rocket_league_players = [
    new Player("Nagy Feró", "nyolc_ora_munka", 0, 100_000, games[1], new Date(2026, 9, 19, 23, 30, 0, 0)),
    new Player("Gregor Bence", "kolbi", 1, 1, games[1], new Date(2075, 11, 31, 24, 59, 0, 0)),
    new Player("Benjamin", "bibi_bomb_children", 2, 1_000_000, games[1], new Date(2001, 8, 10, 0, 0, 0, 0)),
]
var players_used = valorant_players.slice();

var chart = NaN
var deleteID = -1;

const add_modal = new bootstrap.Modal(".add-modal")
const sim_modal = new bootstrap.Modal(".sim-modal")
const delete_modal = new bootstrap.Modal(".delete-modal")
const success_toast = new bootstrap.Toast(".toast")

var toast_input = NaN
var toast_input_values = []
const toast_input_live = document.querySelector('#live-toast')

const toast_element = document.querySelector(".toast-success")
const toast_title = document.querySelector(".toast-success-header strong")
const toast_body = document.querySelector(".toast-success-body")
const toast_square = document.querySelector(".toast-square")
const toast = new bootstrap.Toast(toast_element, { delay: 3000 })

const rangeInput = document.querySelector('#range4');
const rangeOutput = document.querySelector('#rangeValue');

var new_name = document.querySelector(".add-name");
var new_nick = document.querySelector(".add-nick");
var new_pay = document.querySelector(".add-pay");
var new_date = document.querySelector(".add-date");
var new_time = document.querySelector(".add-time");
var date_error = document.querySelector(".date-error")

var edit_index = -1
var edit_stat_index = -1
var edit_stat_name = ""

var timeouts = []

var viewed = 0//0 = valorant 1 = rocket_league

//Teszt adat feltöltés
function add_in_bulk(game_index, id, values) {
    var keys = Object.keys(games[game_index].get_stats())
    for (let i = 0; i < keys.length; i++) {
        games[game_index].add_stat_value(keys[i], id, values[i])
    }
}

//Valorant játékosok adatai
//"kills", "assists", "deaths", "spikes", "defuses", "wins", "matches"
add_in_bulk(0, 0, [15, 10, 4, 4, 3, 1, 2])
add_in_bulk(0, 1, [12, 1, 10, 2, 3, 1, 1])
add_in_bulk(0, 2, [38, 16, 7, 6, 9, 2, 3])
add_in_bulk(0, 3, [18, 34, 21, 13, 11, 4, 6])
add_in_bulk(0, 4, [98, 44, 13, 0, 38, 7, 8])

//Rocket League játékosok adati
//"goals", "assists", "saves", "mvps", "wins", "matches"
add_in_bulk(1, 0, [10, 12, 4, 1, 3, 3])
add_in_bulk(1, 1, [11, 9, 7, 1, 3, 4])
add_in_bulk(1, 2, [66, 34, 45, 9, 9, 9])

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
    var team_stats = document.querySelector(".output-stats")

    var max_kills = player_with_highest_value(0, "kills")
    var max_goals = player_with_highest_value(1, "goals")

    team_stats.innerHTML = ""
    output_accordion.innerHTML = ""
    var id = -1

    if (players_used.length == 0) {
        empty_list_text.classList.remove('d-none');
        team_stats.innerHTML = "<p>Nincs adat!</p>"
    } else {
        empty_list_text.classList.add('d-none')
        //Játéktól függően, accordion-item-ek hozzáadása
        output_accordion.innerHTML = `<h3 class = "text-center">${games[viewed].get_name()} csapat</h3>`
        for (let i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i])
        }
        timeouts = []
        if (!viewed) {
            team_stats.innerHTML =
                `
                <p>Játékos a legtöbb öléssel: ${players_used[max_kills].get_name()} (${games[viewed].get_stats_value("kills", max_kills)})</p>
                `
            for (let i = 0; i < players_used.length; i++) {
                id = players_used[i].get_id()

                output_accordion.innerHTML +=
                    `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" onclick = "new_chart(${id})" data-bs-toggle="collapse"
                        data-bs-target="#acc-${i}" aria-expanded="false" aria-controls="acc-${i}">
                        ${players_used[i].get_name()}  -  ${players_used[i].get_nick()}
                    </button>
                </h2>
                <div id="acc-${i}" class="accordion-collapse collapse" data-bs-parent = ".output">
                    <div class="accordion-body p-1">
                        <button type="button" class="btn btn-warning accordion-btn" onclick = "start_edit(${i})">Szerződés szerkesztése</button>
                        <div class="row g-2">
                            <div class = "d-flex flex-row">
                                <div class = "p-2 flex-grow-1">
                                    <p class = "p-2 fw-bold">Spikes: ${games[viewed].get_stats_value("spikes", id)} <a href= "#toast-header"><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['spikes'], ${id})"></i></a></p>
                                    <p class = "p-2 fw-bold">Defuses: ${games[viewed].get_stats_value("defuses", id)} <a href= "#toast-header"><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['defuses'], ${id})"></i></a></p>
                                    <p class = "p-2 fw-bold">K/D: ${games[viewed].get_stats_value("kills", id) / games[viewed].get_stats_value("deaths", id)} <a href= "#toast-header"><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['kills', 'deaths'], ${id})"></i></a></p>
                                    <p class = "p-2">Assists: ${games[viewed].get_stats_value("assists", id)} <a href= "#toast-header"><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['assists'], ${id})"></i></a></p>
                                    <p class = "px-2 pt-5">Fizetés: ${players_used[i].get_pay()}/hó</p>
                                    <p class = "p-2 contract-${id}">Szerződés státusza: ${players_used[i].get_contractleft() > 0 ? `érvényes ${players_used[i].get_contracttime().toDateString()}-ig` : "<strong class = 'text-danger'>Lejárt</strong>"}</p>
                                </div>
                                <a href= "#toast-header" class = "px-1 py-3"><i class = "bi bi-pencil-fill" onclick = "start_edit_stat(['wins', 'matches'], ${id})"></i></a>
                                <div class = "p-2 flex-grow-1"><canvas class = "chart-${id}"><canvas></div>
                            </div>
                        </div>
                        <div class="text-end mt-2">
                            <button type="button" class="btn btn-outline-danger btn-sm" onclick="delete_ID(${i})">Játékos törlése</button>
                        </div>
                    </div>
                </div>
            </div>
            `

                if (players_used[i].get_contractleft() > 0) {
                    var timeout = setTimeout(() => {
                        document.querySelector(`.contract-${id}`).innerHTML = "Szerződés státusza: <strong class = 'text-danger'>Lejárt</strong>"
                    }
                        , players_used[i].get_contractleft() * 1000
                    )
                    timeouts.push(timeout)
                }
            }
        }
        else {
            team_stats.innerHTML =
                `
                <p>Játékos a legtöbb góllal: ${players_used[max_goals].get_name()} (${games[viewed].get_stats_value("goals", max_goals)})</p>
                `
            for (let i = 0; i < players_used.length; i++) {
                id = players_used[i].get_id()

                output_accordion.innerHTML +=
                    `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed accordion-btn" type="button" onclick = "new_chart(${id})" data-bs-toggle="collapse"
                        data-bs-target="#acc-${i}" aria-expanded="false" aria-controls="p-${i}">
                        ${players_used[i].get_name()}  -  ${players_used[i].get_nick()}
                    </button>
                </h2>
                <div id="acc-${i}" class="accordion-collapse collapse" data-bs-parent = ".output">
                    <div class="accordion-body p-3">
                        <button type="button" class="btn btn-warning" onclick = "start_edit(${i})">Szerződés szerkesztése</button>
                        <div class="row g-2">
                            <div class = "d-flex flex-row">
                                <div class = "p-1 flex-grow-2">
                                    <p class = "p-2 fw-bold">Goals: ${games[viewed].get_stats_value("goals", id)} <a href= "#toast-header"><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['goals'], ${id})"></i></a></p>
                                    <p class = "p-2 fw-bold">Saves: ${games[viewed].get_stats_value("saves", id)} <a href= "#toast-header"><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['saves'], ${id})"></i></a></p>
                                    <p class = "p-2 fw-bold">MVPs: ${games[viewed].get_stats_value("mvps", id)} <a href= "#toast-header"><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['mvps'], ${id})"></i></a></p>
                                    <p class = "p-2">Assists: ${games[viewed].get_stats_value("assists", id)} <a href= "#toast-header"><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['assists'], ${id})"></i></a></p>
                                    <p class = "px-2 pt-5">Fizetés: ${players_used[i].get_pay()}/hó</p>
                                    <p class = "p-2 contract-${id}">${players_used[i].get_contractleft() > 0 ? `Szerződés érvényes ${players_used[i].get_contracttime().toDateString()}-ig` : "<strong class = 'text-danger'>Lejárt</strong>"}</p>
                                </div>
                                <a href= "#toast-header" class = "px-1 py-3"><i class = "bi bi-pencil-fill" onclick = "start_edit_stat(['wins', 'matches'], ${id})"></a></i>
                                <div class = "p-2 flex-grow-1"><canvas class = "chart-${id}"><canvas></div>
                            </div>
                        </div>
                        <div class="text-end mt-2">
                            <button type="button" class="btn btn-outline-danger btn-sm" onclick="delete_ID(${i})">Szerződés bontás</button>
                        </div>
                    </div>
                </div>
            </div>
            `

                if (players_used[i].get_contractleft() > 0) {
                    var timeout = setTimeout(() => {
                        document.querySelector(`.contract-${id}`).innerHTML = "Szerződés státusza: <strong class = 'text-danger'>Lejárt</strong>"
                    }
                        , players_used[i].get_contractleft() * 1000
                    )
                    timeouts.push(timeout)
                }
            }
        }
    }
}
write()

// success toast helper (ai)
function show_toast(title, message, color) {
    toast_title.textContent = title
    toast_body.textContent = message
    toast_square.classList.remove("bg-success", "bg-danger")
    toast_square.classList.add("bg-" + color)
    toast.show()
}

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

function add_player() {
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

        new_name.value = new_nick.value = new_date.value = new_time.value = "";
        new_pay.value = 20000;
        rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";


        show_toast("Játékos igazolva!", `${p.get_name()} szerződése felvételre került.`, "success");
    }
}

//Szerződés szerkesztése
function start_edit(index) {
    edit_index = index

    add_modal.show()
    document.querySelector(".add-header").classList.remove("bg-success")
    document.querySelector(".add-header").classList.add("bg-warning")
    document.querySelector(".add-header h5").innerHTML = "Szerződés módosítása"

    document.querySelector(".add-btn").classList.remove("btn-success")
    document.querySelector(".add-btn").classList.add("btn-warning")
    document.querySelector(".add-btn").setAttribute("onclick", "edit_player()")


    new_name.classList.remove("is-invalid")
    new_name.value = players_used[edit_index].get_name()
    new_nick.classList.remove("is-invalid")
    new_nick.value = players_used[edit_index].get_nick()

    new_pay.value = players_used[edit_index].get_pay()
    rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";

    new_date.valueAsDate = players_used[edit_index].get_contracttime()
    new_date.classList.remove("is-invalid")
    new_time.valueAsDate = players_used[edit_index].get_contracttime();
    new_time.classList.remove("is-invalid")

    date_error.classList.remove("d-block")

}

function edit_player() {
    if (!is_valid_input()) {
        return;
    }
    else {
        var date_parts = new_date.value.split("-");
        var time_parts = new_time.value.split(":");
        var date_time = new Date(
            parseInt(date_parts[0]),
            parseInt(date_parts[1]) - 1,
            parseInt(date_parts[2]),
            parseInt(time_parts[0]),
            parseInt(time_parts[1])
        );

        players_used[edit_index].set_name(new_name.value)
        players_used[edit_index].set_nick(new_nick.value)
        players_used[edit_index].set_pay(new_pay.value)
        players_used[edit_index].set_game(games[viewed])
        players_used[edit_index].set_contracttime(date_time)

        add_modal.hide();
        write();

        new_name.value = new_nick.value = new_date.value = "";
        new_pay.value = 20000;
        rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";
    }
}

function start_edit_stat(values, index) {
    toast_input_values = values
    edit_stat_index = index
    toast_input = bootstrap.Toast.getOrCreateInstance(toast_input_live, { delay: 25000 })
    toast_input.show()
    toast_form = document.querySelector(".toast-form")
    toast_form.innerHTML = ""

    for (let i = 0; i < toast_input_values.length; i++) {
        toast_form.innerHTML +=
            `
        <div class="p-2">
            <label>${toast_input_values[i]}</label>
            <input type = "number" class = "form-control edit-${toast_input_values[i]}"></input>
            <div class="invalid-feedback"></div>
        </div>
        `
    }

}

function edit_stat() {
    var toast_inputfield = NaN
    var valid = true
    for (let i = 0; i < toast_input_values.length; i++) {
        toast_inputfield = document.querySelector(`.edit-${toast_input_values[i]}`)
        toast_inputfield.classList.remove("is-invalid")

        if (Number.parseInt(toast_inputfield.value) < 0 || Number.parseInt(toast_inputfield.value) > 1000) {
            valid = false
            toast_inputfield.classList.add("is-invalid")
            document.querySelector(".invalid-feedback").innerHTML = "Nem adhatsz meg 0-nál kisebb vagy 1000-nél nagyobb értéket!"
        }
        else if (toast_input_values.length == 2 && toast_input_values[0] == "wins" &&
            Number.parseInt(document.querySelector(`.edit-${toast_input_values[0]}`).value) > Number.parseInt(toast_inputfield.value)) {
            valid = false
            document.querySelector(`.edit-${toast_input_values[0]}`).classList.add("is-invalid")
            document.querySelector(".invalid-feedback").innerHTML = "Nem lehet a győzelmek száma nagyobb mint a meccseké!"
        }
        else if (valid) {
            games[viewed].add_stat_value(toast_input_values[i], edit_stat_index, Number.parseInt(toast_inputfield.value))
        }
    }

    if (valid) {
        toast_input.hide()
        write()
    }

}

function player_with_highest_value(game, stat_name) {
    var max_index = -1
    var max_value = 0
    var tmp
    for (let i = 0; i < players_used.length; i++) {
        tmp = games[game].get_stats_value(stat_name, i)
        if (tmp > max_value) {
            max_index = i
            max_value = tmp
        }
    }
    return max_index
}

function delete_ID(index) {
    deleteID = index;

    document.querySelector(".delete-modal-body").innerHTML = `<p>Biztosan ki szeretnéd rúgni ezt a játékost a ${(viewed) ? "Rocket League" : "Valorant"} csapatból?</p>
                                                        <p class="m-0">${(viewed) ? `${rocket_league_players[index].get_name()} (${rocket_league_players[index].get_nick()})` : `${valorant_players[index].get_name()} (${valorant_players[index].get_nick()})`}</p>`

    delete_modal.show();
}

document.querySelector(".delete-btn").addEventListener('click', () => {
    show_toast("Szerződés felbontva!", `${players_used[deleteID].get_name()} szerződése törlődött.`, "danger");
    if (viewed) {
        rocket_league_players.splice(deleteID, 1)
        players_used = rocket_league_players.slice();
    } else {
        valorant_players.splice(deleteID, 1)
        players_used = valorant_players.slice();
    }
    write(viewed);

})

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

//add-modal
rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";
rangeInput.addEventListener('input', () => {
    rangeOutput.textContent = Intl.NumberFormat().format(this.value) + " Ft";
});

document.querySelector(".add-modalbtn").addEventListener('click', () => {
    new_name.value = new_nick.value = new_date.value = new_time.value = "";
    new_pay.value = 20000;
    add_modal.show();
    new_name.classList.remove("is-invalid")
    new_nick.classList.remove("is-invalid")
    new_date.classList.remove("is-invalid")
    new_time.classList.remove("is-invalid")
    date_error.classList.remove("d-block")

    document.querySelector(".add-header").classList.remove("bg-warning")
    document.querySelector(".add-header").classList.add("bg-success")
    document.querySelector(".add-header h5").innerHTML = "Új játékos igazolása"

    document.querySelector(".add-btn").classList.remove("btn-warning")
    document.querySelector(".add-btn").classList.add("btn-success")
    document.querySelector(".add-btn").setAttribute("onclick", "add_player()")
})



document.querySelector(".sim-modalbtn").addEventListener("click", () => {

    sim_modal.show()

    var inputs = document.querySelector(".sim-inputs")
    inputs.innerHTML = ""

    for (let i = 0; i < players_used.length; i++) {
        if (players_used[i].get_contractleft() != "Lejárt") {
            inputs.innerHTML +=
                `
            <div class = "p-2 d-flex flex-row flex-wrap justify-content-center form-check">
                <p class = "p-2 flex-grow-1">${i + 1}. Játékos:</p>
                <p class = "p-2 flex-grow-1">${players_used[i].get_nick()}</p>
                <p class = "p-2 flex-grow-1">Játszott:</p>
                <input type = "checkbox" value = "${i}" class = "index-${i} form-check-input mx-1 m-2">
                <div class="invalid-feedback w-100 p-1">Több játékos mint ${games[viewed].get_max_players_in_round()}!</div>
            </div>
            `
        }
    }

})

//szimuláció indítása
document.querySelector(".sim-btn").addEventListener("click", () => {

    var inputs = []
    var checkbox = ""
    for (let i = 0; i < players_used.length; i++) {
        checkbox = document.querySelector(`.index-${i}`)
        if (checkbox.checked) {
            inputs.push(checkbox)
            checkbox.classList.remove("is-invalid")
        }
    }

    var input_len = inputs.length
    var id = -1
    var wins = 0
    if (input_len <= games[viewed].get_max_players_in_round()) {
        wins = Math.floor(Math.random() * (0.53 * input_len))
        for (let i = 0; i < input_len; i++) {
            id = Number.parseInt(inputs[i].value)
            if (!viewed) {

                add_in_bulk(viewed, id, [
                    games[viewed].get_stats_value("kills", id) + Math.floor(Math.random() * (6.2 * input_len)),
                    games[viewed].get_stats_value("assists", id) + Math.floor(Math.random() * (6.2 * input_len)),
                    games[viewed].get_stats_value("deaths", id) + Math.floor(Math.random() * (125 / input_len)),
                    games[viewed].get_stats_value("spikes", id) + Math.floor(Math.random() * (1.5 * input_len)),
                    games[viewed].get_stats_value("defuses", id) + Math.floor(Math.random() * (1.5 * input_len)),
                    games[viewed].get_stats_value("wins", id) + wins,
                    games[viewed].get_stats_value("matches", id) + 1,
                ])
            }
            else {
                add_in_bulk(viewed, id, [
                    games[viewed].get_stats_value("goals", id) + Math.floor(Math.random() * (5.2 * input_len)),
                    games[viewed].get_stats_value("assists", id) + Math.floor(Math.random() * (5.2 * input_len)),
                    games[viewed].get_stats_value("saves", id) + Math.floor(Math.random() * (5.2 * input_len)),
                    games[viewed].get_stats_value("mvps", id) + Math.floor(Math.random() * 2),
                    games[viewed].get_stats_value("wins", id) + wins,
                    games[viewed].get_stats_value("matches", id) + 1,
                ])
            }
        }
        sim_modal.hide()
        write()
    }
    else {
        for (let i = 1; i <= input_len - games[viewed].get_max_players_in_round(); i++) {
            inputs[inputs.length - i].classList.add("is-invalid")
        }
    }

})