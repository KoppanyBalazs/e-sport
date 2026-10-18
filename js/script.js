const games = [
    new Game("Valorant", ["kills", "assists", "deaths", "spikes", "defuses", "wins", "matches"], 5),
    new Game("Rocket League", ["goals", "assists", "saves", "mvps", "wins", "matches"], 3)
]


const valorant_players = [
    new Player("Béla a tesztből", "test_bela1", 0, 150_000, games[0], new Date(2026, 9, 19, 23, 30, 0, 0)),
    new Player("Lejárt János", "janika", 1, 30_000, games[0], new Date(2025, 9, 19, 23, 30, 0, 0)),
    new Player("Kincses Ádám", "xxx_kincses_xxx", 2, 550_000, games[0], new Date(2028, 5, 15, 15, 15, 0, 0)),
    new Player("Ferenc József", "austrianking223", 3, 125_001, games[0], new Date(2026, 9, 25, 24, 0, 0, 0)),
    new Player("Koppány Félix", "Cpt_Meatballz", 4, 1_000_000, games[0], new Date(2035, 0, 1, 0, 0, 0, 0))]
const rocket_league_players = [
    new Player("Nagy Feró", "nyolc_ora_munka", 0, 100_000, games[1], new Date(2026, 9, 19, 23, 30, 0, 0)),
    new Player("Gregor Bence", "kolbi", 1, 1, games[1], new Date(2075, 11, 31, 24, 59, 0, 0)),
    new Player("Benjamin", "big_yahoo271", 2, 1_000_000, games[1], new Date(2001, 8, 10, 0, 0, 0, 0)),
]
var players_used = valorant_players.slice();

var chart = NaN
var deleteID = -1;

const add_modal = new bootstrap.Modal(".add-modal")
const sim_modal = new bootstrap.Modal(".sim-modal")
const delete_modal = new bootstrap.Modal(".delete-modal")
const success_toast = new bootstrap.Toast(".toast")

const max_roster = [8, 5]
const roster_count = document.querySelector(".roster-count")

const max_budget = 5_000_000
const budget_text = document.querySelector(".budget-text")
const budget_bar = document.querySelector(".budget-bar")
const budget_error = document.querySelector(".budget-error")

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

var in_simulation = 0

var viewed = 0

function delete_in_bulk(game, id) {
    var keys = Object.keys(game.get_stats())
    for (let i = 0; i < keys.length; i++) {
        game.remove_stat_value(keys[i], id)
    }
}


function add_in_bulk(game, id, values) {
    var keys = Object.keys(game.get_stats())
    for (let i = 0; i < keys.length; i++) {
        game.add_stat_value(keys[i], id, values[i])
    }
}

add_in_bulk(games[0], 0, [15, 10, 4, 4, 3, 1, 2])
add_in_bulk(games[0], 1, [12, 1, 10, 2, 3, 1, 1])
add_in_bulk(games[0], 2, [38, 16, 7, 6, 9, 2, 3])
add_in_bulk(games[0], 3, [18, 34, 21, 13, 11, 4, 6])
add_in_bulk(games[0], 4, [98, 44, 13, 0, 38, 7, 8])

add_in_bulk(games[1], 0, [10, 12, 4, 1, 3, 3])
add_in_bulk(games[1], 1, [11, 9, 7, 1, 3, 4])
add_in_bulk(games[1], 2, [66, 34, 45, 9, 9, 9])

function player_with_highest_value(game, stat_name) {
    var max_index = -1
    var max_value = 0
    var tmp
    for (let i = 0; i < players_used.length; i++) {
        tmp = games[game].get_stats_value(stat_name, players_used[i].get_id())
        if (tmp > max_value) {
            max_index = i
            max_value = tmp
        }
    }
    return max_index
}


function win_rate(id) {
    var matches = games[viewed].get_stats_value("matches", id)
    if (matches == 0) {
        return 0
    }
    return Math.round(games[viewed].get_stats_value("wins", id) / matches * 100)
}

function team_win_rate() {
    var win_rate_sum = 0
    if (players_used.length > 0) {
        for (let i = 0; i < players_used.length; i++) {
            win_rate_sum += win_rate(players_used[i].get_id())
        }
    }
    console.log(win_rate_sum / players_used.length)
    return Math.round(win_rate_sum / players_used.length)
}

function new_chart(id) {
    if (chart) {
        chart.destroy()
    }

    chart = new Chart(
        document.querySelector(`.chart-${id}`),
        {
            type: "doughnut",
            data: {
                datasets: [{
                    data: [
                        games[viewed].get_stats_value("wins", id),
                        games[viewed].get_stats_value("matches", id) - games[viewed].get_stats_value("wins", id)
                    ],
                    backgroundColor: [
                        "#4caf50",
                        "#555555"
                    ],
                    borderWidth: 0
                }],
            },
            options: {
                animation: false,
                responsive: true,
                cutout: "75%",
                plugins: {
                    legend: {
                        display: false
                    }
                }
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
    var max_spikes = player_with_highest_value(0, "spikes")
    var max_goals = player_with_highest_value(1, "goals")
    var max_mvps = player_with_highest_value(1, "mvps")
    win_rate_team = team_win_rate()

    team_stats.innerHTML = ""
    output_accordion.innerHTML = ""
    var id = -1
    update_budget()
    update_roster()
    if (players_used.length == 0) {
        empty_list_text.classList.remove('d-none');
        team_stats.innerHTML = "<p>Nincs adat!</p>"
    } else {

        team_stats.innerHTML += (win_rate_team <= 0) ?
            `<p class = "text-secondary">Még nincs win rate adat!</p>`
            :
            `
            <p>Csapat win rate-je - <span class = "text-success fs-5">${win_rate_team} %</span></p>
            `

        empty_list_text.classList.add('d-none')
        output_accordion.innerHTML = `
        <div class="d-flex align-items-center gap-3 mb-3">
            <h3 class="m-0">${games[viewed].get_name()} csapat</h3>
            <div class="d-flex flex-column flex-lg-row align-items-end gap-1 ms-auto flex-shrink-0">
                <span class="badge text-bg-success active-badge ms-auto"></span>
                <span class="badge text-bg-danger expired-badge"></span>
            </div>
        </div>`
        update_badges()
        for (let i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i])
        }
        timeouts = []
        if (!viewed) {

            team_stats.innerHTML += (max_kills == -1) ?
                `<p class = "text-secondary">Még nincs ölési adat!</p>`
                :
                `
                <p>A leghalálosabb: ${players_used[max_kills].get_name()} - <span class = "text-success fs-5">${games[viewed].get_stats_value("kills", players_used[max_kills].get_id())}</span> kill(s)</p>
                `

            team_stats.innerHTML += (max_spikes == -1) ?
                `<p class = "text-secondary">Még nincs spike telepítési adat!</p>`
                :
                `
                <p>A legjobb telepítő: ${players_used[max_spikes].get_name()} - <span class = "text-success fs-5">${games[viewed].get_stats_value("spikes", players_used[max_spikes].get_id())}</span> spike telepítéssel</p>
                `

            for (let i = 0; i < players_used.length; i++) {
                let id = players_used[i].get_id()

                output_accordion.innerHTML +=
                    `
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" onclick="new_chart(${id})"
                data-bs-toggle="collapse" data-bs-target="#acc-${i}" aria-expanded="false" aria-controls="acc-${i}">
                ${players_used[i].get_name()} - ${players_used[i].get_nick()}
            </button>
        </h2>
        <div id="acc-${i}" class="accordion-collapse collapse" data-bs-parent=".output">
            <div class="accordion-body p-3">
                <div class="row g-3 align-items-center">
                    <div class="col-12 col-md-8">
                        <div class="row row-cols-2 g-3">
                            <div class="col">
                                <div class="rounded border p-3 position-relative">
                                    <div class="small text-secondary">Spikes:</div>
                                    <div class="fs-3 fw-bold">
                                        ${games[viewed].get_stats_value("spikes", id)}
                                    </div>
                                    <a href="#toast-header"
                                        class="tile-edit text-secondary position-absolute top-0 end-0 m-3">
                                        <i class="bi bi-pencil-fill" onclick="start_edit_stat(['spikes'], ${id})"></i>
                                    </a>
                                </div>
                            </div>

                            <div class="col">
                                <div class="rounded border p-3 position-relative">
                                    <div class="small text-secondary">Defuses:</div>
                                    <div class="fs-3 fw-bold">
                                        ${games[viewed].get_stats_value("defuses", id)}
                                    </div>
                                    <a href="#toast-header"
                                        class="tile-edit text-secondary position-absolute top-0 end-0 m-3">
                                        <i class="bi bi-pencil-fill" onclick="start_edit_stat(['defuses'], ${id})"></i>
                                    </a>
                                </div>
                            </div>

                            <div class="col">
                                <div class="rounded border p-3 position-relative">
                                    <div class="small text-secondary">K/D:</div>
                                    <div class="fs-3 fw-bold">
                                        ${(games[viewed].get_stats_value("deaths", id) > 0) ?
                        ((games[viewed].get_stats_value("kills", id) /
                            games[viewed].get_stats_value("deaths", id))).toFixed(1)
                        : `${games[viewed].get_stats_value("kills", id)}`}
                                    </div>
                                    <a href="#toast-header"
                                        class="tile-edit text-secondary position-absolute top-0 end-0 m-3">
                                        <i class="bi bi-pencil-fill"
                                            onclick="start_edit_stat(['kills', 'deaths'], ${id})"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="col">
                                <div class="rounded border p-3 position-relative">
                                    <div class="small text-secondary">Assists:</div>
                                    <div class="fs-3 fw-bold">
                                        ${games[viewed].get_stats_value("assists", id)}
                                    </div>
                                    <a href="#toast-header"
                                        class="tile-edit text-secondary position-absolute top-0 end-0 m-3">
                                        <i class="bi bi-pencil-fill" onclick="start_edit_stat(['assists'], ${id})"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div class="chart-wrap position-relative mx-auto">
                            <canvas class="chart-${id}"></canvas>
                            <div class="chart-center">
                                <span class="fs-3 fw-bold">${win_rate(id)}%</span>
                                <span class="small text-secondary">win rate</span>
                            </div>
                            <a href="#toast-header" class="text-secondary position-absolute top-0 end-0">
                                <i class="bi bi-pencil-fill" onclick="start_edit_stat(['wins', 'matches'], ${id})"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-wrap align-items-center gap-2 border-top p-3 mt-3">
                <span class="contract-${id}">Szerződés státusza: ${players_used[i].get_contractleft() > 0 ?
                        `<span class="badge text-bg-success">Érvényes</span> <span
                        class="small text-secondary">${players_used[i].get_contracttime().toLocaleDateString("hu-HU")}-ig</span>`
                        : "<span class='badge text-bg-danger'>Lejárt</span>"}</span>
                <span>${Intl.NumberFormat().format(players_used[i].get_pay())} Ft/hó</span>
                <div class="ms-auto d-flex gap-2">
                    <button type="button" class="btn btn-outline-warning btn-sm" onclick="start_edit(${i})">Szerződés
                        szerkesztése</button>
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="delete_ID(${i})">Szerződés
                        bontás</button>
                </div>
            </div>
        </div>
    </div>
                    `

                if (players_used[i].get_contractleft() > 0 && players_used[i].get_contractleft() < 2147483) {
                    var timeout = setTimeout(() => {
                        document.querySelector(`.contract-${id}`).innerHTML = "Szerződés státusza: <span class='badge text-bg-danger'>Lejárt</span>"
                        update_badges()
                    }
                        , players_used[i].get_contractleft() * 1000
                    )
                    timeouts.push(timeout)
                }
            }
        }
        else {

            team_stats.innerHTML += (max_goals == -1) ?
                `<p class = "text-secondary">Még nincs gól adat!</p>`
                :
                `
                <p>Az Aranycsapat új tagja: ${players_used[max_goals].get_name()} - <span class = "text-success fs-5">${games[viewed].get_stats_value("goals", players_used[max_goals].get_id())}</span> goal(s)</p>
                `
            team_stats.innerHTML += (max_mvps == -1) ?
                `<p class = "text-secondary">Még nincs MVP adat!</p>`
                :
                `
                <p>A Legértékesebb: ${players_used[max_mvps].get_name()} - <span class = "text-success fs-5">${games[viewed].get_stats_value("mvps", players_used[max_mvps].get_id())}</span>-szer lett MVP</p>
                `

            for (let i = 0; i < players_used.length; i++) {
                let id = players_used[i].get_id()

                output_accordion.innerHTML +=
                    `
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" onclick="new_chart(${id})"
                                data-bs-toggle="collapse" data-bs-target="#acc-${i}" aria-expanded="false" aria-controls="acc-${i}">
                                ${players_used[i].get_name()} - ${players_used[i].get_nick()}
                            </button>
                        </h2>
                        <div id="acc-${i}" class="accordion-collapse collapse" data-bs-parent=".output">
                            <div class="accordion-body p-3">
                                <div class="row g-3 align-items-center">
                                    <div class="col-12 col-md-8">
                                        <div class="row row-cols-2 g-3">
                                            <div class="col">
                                                <div class="rounded border p-3 position-relative">
                                                    <div class="small text-secondary">Goals:</div>
                                                    <div class="fs-3 fw-bold">
                                                        ${games[1].get_stats_value("goals", id)}
                                                    </div>
                                                    <a href="#toast-header"
                                                        class="tile-edit text-secondary position-absolute top-0 end-0 m-3">
                                                        <i class="bi bi-pencil-fill" onclick="start_edit_stat(['goals'], ${id})"></i>
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="col">
                                                <div class="rounded border p-3 position-relative">
                                                    <div class="small text-secondary">Assists:</div>
                                                    <div class="fs-3 fw-bold">
                                                        ${games[1].get_stats_value("assists", id)}
                                                    </div>
                                                    <a href="#toast-header"
                                                        class="tile-edit text-secondary position-absolute top-0 end-0 m-3">
                                                        <i class="bi bi-pencil-fill" onclick="start_edit_stat(['assists'], ${id})"></i>
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="col">
                                                <div class="rounded border p-3 position-relative">
                                                    <div class="small text-secondary">Saves:</div>
                                                    <div class="fs-3 fw-bold">
                                                        ${games[viewed].get_stats_value("saves", id)}
                                                    </div>
                                                    <a href="#toast-header"
                                                        class="tile-edit text-secondary position-absolute top-0 end-0 m-3">
                                                        <i class="bi bi-pencil-fill"
                                                            onclick="start_edit_stat(['kills', 'deaths'], ${id})"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="rounded border p-3 position-relative">
                                                    <div class="small text-secondary">MVPs:</div>
                                                    <div class="fs-3 fw-bold">
                                                        ${games[viewed].get_stats_value("mvps", id)}
                                                    </div>
                                                    <a href="#toast-header"
                                                        class="tile-edit text-secondary position-absolute top-0 end-0 m-3">
                                                        <i class="bi bi-pencil-fill" onclick="start_edit_stat(['mvps'], ${id})"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-4">
                                        <div class="chart-wrap position-relative mx-auto">
                                            <canvas class="chart-${id}"></canvas>
                                            <div class="chart-center">
                                                <span class="fs-3 fw-bold">${win_rate(id)}%</span>
                                                <span class="small text-secondary">win rate</span>
                                            </div>
                                            <a href="#toast-header" class="text-secondary position-absolute top-0 end-0">
                                                <i class="bi bi-pencil-fill" onclick="start_edit_stat(['wins', 'matches'], ${id})"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap align-items-center gap-2 border-top p-3 mt-3">
                                <span class="contract-${id}">Szerződés státusza: ${players_used[i].get_contractleft() > 0 ?
                        `<span class="badge text-bg-success">Érvényes</span> <span
                                        class="small text-secondary">${players_used[i].get_contracttime().toLocaleDateString("hu-HU")}-ig</span>`
                        : "<span class='badge text-bg-danger'>Lejárt</span>"}</span>
                                <span>${Intl.NumberFormat().format(players_used[i].get_pay())} Ft/hó</span>
                                <div class="ms-auto d-flex gap-2">
                                    <button type="button" class="btn btn-outline-warning btn-sm" onclick="start_edit(${i})">Szerződés
                                        szerkesztése</button>
                                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="delete_ID(${i})">Szerződés
                                        bontás</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `

                if (players_used[i].get_contractleft() > 0 && players_used[i].get_contractleft() < 2147483) {
                    var timeout = setTimeout(() => {
                        document.querySelector(`.contract - ${id} `).innerHTML = "<span class='badge text-bg-danger'>Lejárt</span>"
                        update_badges()
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

function update_badges() {
    var active = 0
    for (let i = 0; i < players_used.length; i++) {
        if (players_used[i].get_contractleft() > 0) {
            active++
        }
    }
    document.querySelector(".active-badge").textContent = `${active} aktív szerződés`
    document.querySelector(".expired-badge").textContent = `${players_used.length - active} lejárt szerződés`
}

function update_roster() {
    roster_count.textContent = `${players_used.length}/${max_roster[viewed]}`
}

function show_toast(title, message, color) {
    toast_title.textContent = title
    toast_body.textContent = message
    toast_square.classList.remove("bg-success", "bg-danger")
    toast_square.classList.add("bg-" + color)
    toast.show()
}

function used_budget() {
    var sum = 0
    for (let i = 0; i < players_used.length; i++) {
        sum += players_used[i].get_pay()
    }
    return sum
}

function update_budget() {
    var used = used_budget()
    budget_text.textContent = `${Intl.NumberFormat().format(used)} Ft / ${Intl.NumberFormat().format(max_budget)} Ft`
    budget_bar.style.width = Math.min(used / max_budget * 100, 100) + "%"
}

function is_budget_valid(old_pay) {
    var free = max_budget - used_budget() + old_pay
    var valid = Number(new_pay.value) <= free

    budget_error.textContent = `Nem fér bele a keretbe! Legfeljebb ${Intl.NumberFormat().format(free)} Ft adható.`
    budget_error.classList.toggle("d-block", !valid)

    return valid
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
    if (!is_valid_input() || !is_budget_valid(0)) {
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
            var p = new Player(new_name.value, new_nick.value, next_id(valorant_players), new_pay.value, games[0], date_time);
            add_in_bulk(games[0], next_id(valorant_players), [0, 0, 0, 0, 0, 0, 0])
            valorant_players.push(p);
            players_used = valorant_players.slice()
        } else {
            var p = new Player(new_name.value, new_nick.value, next_id(rocket_league_players), new_pay.value, games[1], date_time);
            add_in_bulk(games[1], next_id(rocket_league_players), [0, 0, 0, 0, 0, 0])
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
    budget_error.classList.remove("d-block")
}

function edit_player() {
    if (!is_valid_input() || !is_budget_valid(players_used[edit_index].get_pay())) {
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
document.addEventListener("click", (e) => {
    if (toast_input_live.classList.contains("show") && !toast_input_live.contains(e.target) && !e.target.closest(".bi-pencil-fill")) {
        toast_input.hide()
    }
})

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
        <div class="me-2 mb-3">
            <label>${toast_input_values[i]}</label>
            <input type = "number" class = "form-control edit-${toast_input_values[i]}" value="${games[viewed].get_stats_value(toast_input_values[i], index)}">
            <div class="invalid-feedback toast-invalid"></div>
        </div>
        `
    }

}

function edit_stat() {
    var toast_inputfield = NaN
    var valid = true
    var invalids = []
    for (let i = 0; i < toast_input_values.length; i++) {
        toast_inputfield = document.querySelector(`.edit-${toast_input_values[i]}`)
        toast_inputfield.classList.remove("is-invalid")

        if (Number.parseInt(toast_inputfield.value) < 0 || Number.parseInt(toast_inputfield.value) > 1000) {
            valid = false
            toast_inputfield.classList.add("is-invalid")
            invalids = document.querySelectorAll(".toast-invalid")
            invalids[i].innerHTML = "Nem adhatsz meg 0-nál kisebb vagy 1000-nél nagyobb értéket!"
        }
        else if (toast_input_values.length == 2 && toast_input_values[0] == "wins" &&
            Number.parseInt(document.querySelector(`.edit-${toast_input_values[0]}`).value) > Number.parseInt(toast_inputfield.value)) {
            valid = false
            document.querySelector(`.edit-${toast_input_values[0]}`).classList.add("is-invalid")
            document.querySelector(".invalid-feedback").innerHTML = "Nem lehet a győzelmek száma nagyobb mint a meccseké!"
        }
    }

    if (valid) {
        for (let i = 0; i < toast_input_values.length; i++) {
            var field = document.querySelector(`.edit-${toast_input_values[i]}`)
            games[viewed].add_stat_value(toast_input_values[i], edit_stat_index, Number.parseInt(field.value))
        }
        toast_input.hide()
        write()
    }

}


function delete_ID(index) {
    deleteID = index;

    document.querySelector(".delete-modal-body").innerHTML = `<p>Biztosan ki szeretnéd rúgni ezt a játékost a ${(viewed) ? "Rocket League" : "Valorant"} csapatból?</p>
                                                        <p class="m-0">${(viewed) ? `${rocket_league_players[index].get_name()} (${rocket_league_players[index].get_nick()})` : `${valorant_players[index].get_name()} (${valorant_players[index].get_nick()})`}</p>`

    delete_modal.show();
}

document.querySelector(".delete-btn").addEventListener('click', () => {
    show_toast("Szerződés felbontva!", `${players_used[deleteID].get_name()} szerződése törlődött.`, "danger");
    if (!viewed) {

        delete_in_bulk(games[0], players_used[deleteID].get_id())
        valorant_players.splice(deleteID, 1)

        players_used = valorant_players.slice();
    } else {

        delete_in_bulk(games[1], players_used[deleteID].get_id())
        rocket_league_players.splice(deleteID, 1)

        players_used = rocket_league_players.slice();
    }
    write();

})

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

rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";
rangeInput.addEventListener('input', () => {
    rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";
});

document.querySelector(".add-modalbtn").addEventListener('click', () => {
    if (players_used.length >= max_roster[viewed]) {
        show_toast("Megtelt a keret!", `A ${games[viewed].get_name()} csapatban legfeljebb ${max_roster[viewed]} játékos lehet.`, "danger")
        return
    }
    new_name.value = new_nick.value = new_date.value = new_time.value = "";
    new_pay.value = 20000;
    add_modal.show();
    new_name.classList.remove("is-invalid")
    new_nick.classList.remove("is-invalid")
    new_date.classList.remove("is-invalid")
    new_time.classList.remove("is-invalid")
    date_error.classList.remove("d-block")
    budget_error.classList.remove("d-block")

    document.querySelector(".add-header").classList.remove("bg-warning")
    document.querySelector(".add-header").classList.add("bg-success")
    document.querySelector(".add-header h5").innerHTML = "Új játékos igazolása"

    document.querySelector(".add-btn").classList.remove("btn-warning")
    document.querySelector(".add-btn").classList.add("btn-success")
    document.querySelector(".add-btn").setAttribute("onclick", "add_player()")
})



document.querySelector(".sim-modalbtn").addEventListener("click", () => {
    in_simulation = 0
    sim_modal.show()

    var inputs = document.querySelector(".sim-inputs")
    inputs.innerHTML = `<p class="text-secondary">Válaszd ki a meccsen játszó játékosokat (legfeljebb ${games[viewed].get_max_players_in_round()}):</p>`

    for (let i = 0; i < players_used.length; i++) {
        if (players_used[i].get_contractleft() != "Lejárt") {
            in_simulation++
            inputs.innerHTML +=
                `
                        <label class="sim-row d-flex flex-wrap align-items-center gap-3 border rounded p-3 mb-2">
                            <div>
                                <div class="fw-bold">${players_used[i].get_name()}</div>
                                <div class="small text-secondary">${players_used[i].get_nick()}</div>
                            </div>
                            <input type="checkbox" value="${players_used[i].get_id()}"
                                class="index-${in_simulation - 1} form-check-input ms-auto m-0">
                            <div class="invalid-feedback w-100">Több játékos mint
                                ${games[viewed].get_max_players_in_round()}!</div>
                        </label>
                        `
        }
    }

})

document.querySelector(".sim-btn").addEventListener("click", () => {

    var inputs = []
    var checkbox = ""
    for (let i = 0; i < in_simulation; i++) {
        checkbox = document.querySelector(`.index-${i}`)
        if (checkbox.checked) {
            inputs.push(checkbox)
            checkbox.classList.remove("is-invalid")
        }
    }

    in_simulation = 0

    var input_len = inputs.length
    var id = -1
    var wins = 0
    if (input_len <= games[viewed].get_max_players_in_round()) {
        wins = Math.floor(Math.random() * (0.51 * input_len))
        for (let i = 0; i < input_len; i++) {
            id = Number.parseInt(inputs[i].value)
            if (!viewed) {

                add_in_bulk(games[0], id, [
                    games[0].get_stats_value("kills", id) + Math.floor(Math.random() * (6.5 * input_len)),
                    games[0].get_stats_value("assists", id) + Math.floor(Math.random() * (6.5 * input_len)),
                    games[0].get_stats_value("deaths", id) + Math.floor(Math.random() * (80 / input_len)),
                    games[0].get_stats_value("spikes", id) + Math.floor(Math.random() * (1.5 * input_len)),
                    games[0].get_stats_value("defuses", id) + Math.floor(Math.random() * (1.5 * input_len)),
                    games[0].get_stats_value("wins", id) + wins,
                    games[0].get_stats_value("matches", id) + 1,
                ])
            }
            else {
                add_in_bulk(games[1], id, [
                    games[1].get_stats_value("goals", id) + Math.floor(Math.random() * (5.2 * input_len)),
                    games[1].get_stats_value("assists", id) + Math.floor(Math.random() * (5.2 * input_len)),
                    games[1].get_stats_value("saves", id) + Math.floor(Math.random() * (5.2 * input_len)),
                    games[1].get_stats_value("mvps", id) + Math.floor(Math.random() * 2),
                    games[1].get_stats_value("wins", id) + wins,
                    games[1].get_stats_value("matches", id) + 1,
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