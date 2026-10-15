const games = [
    new Game("Valorant", ["kills", "assists", "deaths", "spikes", "defuses", "wins", "matches"], 5),
    new Game("Rocket League", ["goals", "assists", "saves", "mvps", "wins", "matches"], 3)
]


const valorant_players = [new Player("Béla a tesztből", "test_bela1", 0, 150_000, games[0])]
const rocket_league_players = [new Player("Nagy Feró", "nyolc_ora_munka", 0, 100_000, games[1])]
var players_used = valorant_players

var chart = NaN

const add_modal = new bootstrap.Modal(".add-modal")
const sim_modal = new bootstrap.Modal(".sim-modal")

var toast = NaN
var toast_values = []
const toast_live = document.getElementById('live-toast')

var new_name = document.querySelector(".add-name");
var new_nick = document.querySelector(".add-nick");
var new_pay = document.querySelector(".add-pay");
var new_date = document.querySelector(".add-date");
var new_time = document.querySelector(".add-time");
var date_error = document.querySelector(".date-error")

var edit_index = -1
var edit_stat_index = -1
var edit_stat_name = ""

var viewed = 0//0 = valorant 1 = rocket_league

//Teszt adat feltöltés
function add_in_bulk(game_index, id, values){
    var keys = Object.keys(games[game_index].get_stats())
    for(let i = 0; i < keys.length; i++){
        games[game_index].add_stat_value(keys[i], id, values[i])
    }
}

//Nem használt de ha akarjuk feltudjuk használni egy keresőhöz pl
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
    if(chart){
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

function write(){
    var output_accordion = document.querySelector(".output")
    output_accordion.innerHTML = ""
    var id = -1

    //Játéktól függően, accordion-item-ek hozzáadása
    if(! viewed){
        for(let i = 0; i < players_used.length; i++){
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
                        <button type="button" class="btn btn-warning edit-player" onclick = "start_edit(${i})">Szerződés szerkesztése</button>
                        <div class="row g-2">
                            <div class = "d-flex flex-row">
                                    <div class = "p-2 flex-grow-1">
                                    <p class = "p-2 fw-bold">Spikes: ${games[viewed].get_stats_value("spikes", id)} <i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['spikes'], ${id})"> </i></p>
                                    <p class = "p-2 fw-bold">Defuses: ${games[viewed].get_stats_value("defuses", id)} <i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['defuses'], ${id})"> </i></p>
                                    <p class = "p-2 fw-bold">K/D: ${games[viewed].get_stats_value("kills", id) / games[viewed].get_stats_value("deaths", id)} <i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['kills', 'deaths'], ${id})"> </i></p>
                                    <p class = "p-2">Assists: ${games[viewed].get_stats_value("assists", id)} <i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['assists'], ${id})"> </i></p>
                                </div>
                                <div class = "p-2 flex-grow-1"><canvas class = "chart-${id}"><canvas></div><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['wins', 'matches'], ${id})"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }
    else{
        for(let i = 0; i < players_used.length; i++){
            id = rocket_league_players[i].get_id()

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
                        <button type="button" class="btn btn-warning edit-player" onclick = "start_edit(${i})">Szerződés szerkesztése</button>
                        <div class="row g-2">
                            <div class = "d-flex flex-row">
                                <div class = "p-2 flex-grow-1">
                                    <p class = "p-2 fw-bold">Goals: ${games[viewed].get_stats_value("goals", id)} <i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['goals'], ${id})"> </i></p>
                                    <p class = "p-2 fw-bold">Saves: ${games[viewed].get_stats_value("saves",id)} <i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['saves'], ${id})"> </i></p>
                                    <p class = "p-2 fw-bold">MVPs: ${games[viewed].get_stats_value("mvps", id)} <i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['mvps'], ${id})"> </i></p>
                                    <p class = "p-2">Assists: ${games[viewed].get_stats_value("assists", id)} <i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['assists'], ${id})"> </i></p>
                                </div>
                                <div class = "p-2 flex-grow-1"><canvas class = "chart-${id}"><canvas></div><i class = "px-2 bi bi-pencil-fill" onclick = "start_edit_stat(['wins', 'matches'], ${id})"></i>
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

document.querySelector(".add-modalbtn").addEventListener('click', () => {
    add_modal.show();
    new_name.classList.remove("is-invalid")
    new_nick.classList.remove("is-invalid")
    new_date.classList.remove("is-invalid")
    new_time.classList.remove("is-invalid")
    date_error.classList.remove("d-block")

    document.querySelector(".add-header").classList.remove("bg-warning")
    document.querySelector(".add-header").classList.add("bg-success")
    document.querySelector(".add-header h5").innerHTML = "Új játékos felvétele"

    document.querySelector(".add-btn").classList.remove("btn-warning")
    document.querySelector(".add-btn").classList.add("btn-success")
    document.querySelector(".add-btn").setAttribute("onclick", "add_player()")
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

function add_player(){
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

        var p = new Player(new_name.value, new_nick.value, players_used.length, new_pay.value, games[viewed], date_time);
        if (! viewed) {
            add_in_bulk(viewed, players_used.length, [0,0,0,0,0,0,0])
            valorant_players.push(p);
            players_used = valorant_players.slice()
        } else{
            add_in_bulk(viewed, players_used.length, [0,0,0,0,0,0])
            rocket_league_players.push(p);
            players_used = rocket_league_players.slice()
        }

        add_modal.hide();
        write();

        new_name.value = new_nick.value = new_date.value = "";
        new_pay.value = 20000;
        rangeOutput.textContent = Intl.NumberFormat().format(rangeInput.value) + " Ft";
    }
}

//Szerződés szerkesztése
function start_edit(index){
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

    new_date.classList.remove("is-invalid")
    new_time.classList.remove("is-invalid")

    date_error.classList.remove("d-block")

}

function edit_player(){
    console.log("fut")
    if (!is_valid_input()) {
        return;
    }
    else{
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

function start_edit_stat(values, index){
    toast_values = values
    edit_stat_index = index
    toast = bootstrap.Toast.getOrCreateInstance(toast_live)
    toast.show()
    toast_form = document.querySelector(".toast-form")
    toast_form.innerHTML = ""

    for(let i = 0; i < values.length; i++){
        toast_form.innerHTML += 
        `
        <div class="p-2">
            <label>${toast_values[i]}</label>
            <input type = "number" class = "form-control edit-${toast_values[i]}"></input>
            <div class="invalid-feedback"></div>
        </div>
        `
    }

}

function edit_stat(){
    var toast_input = NaN
    var valid = true
    for(let i = 0; i < toast_values.length; i++){
        toast_input = document.querySelector(`.edit-${toast_values[i]}`)
        toast_input.classList.remove("is-invalid")

        if(Number.parseInt(toast_input.value) < 0 || Number.parseInt(toast_input.value) > 1000){
            valid = false
            toast_input.classList.add("is-invalid")
            document.querySelector(".invalid-feedback").innerHTML = "Nem adhatsz meg 0-nál kisebb vagy 1000-nél nagyobb értéket!"
        }
        else if(toast_values.length == 2 && toast_values[0] == "wins" && 
            Number.parseInt(document.querySelector(`.edit-${toast_values[0]}`).value) > Number.parseInt(toast_input.value)){
            valid = false
            document.querySelector(`.edit-${toast_values[0]}`).classList.add("is-invalid")
            document.querySelector(".invalid-feedback").innerHTML = "Nem lehet a győzelmek száma nagyobb mint a meccseké!"
            }
        else if(valid){
            games[viewed].add_stat_value(toast_values[i], edit_stat_index, Number.parseInt(toast_input.value))
        }
    }

    if(valid){
        toast.hide()
        write()
    }

}

document.querySelector(".sim-modalbtn").addEventListener("click", () => {
    sim_modal.show()

    var inputs = document.querySelector(".sim-inputs")
    inputs.innerHTML = ""

    for(let i = 0; i < players_used.length; i++){
        inputs.innerHTML += 
        `
        <div class = "p-2 d-flex flex-row flex-wrap justify-content-center form-check">
            <p class = "p-1 flex-grow-1">${i + 1}. Játékos:</p>
            <p class = "p-1 flex-grow-1">${players_used[i].get_nick()}</p>
            <p class = "p-1 flex-grow-1">Játszott:</p>
            <input type = "checkbox" value = "${i}" class = "index-${i} form-check-input">
            <div class="invalid-feedback w-100 p-1">Több játékos mint ${games[viewed].get_max_players_in_round()}!</div>
        </div>
        `
    }

})

//szimuláció indítása
//TODO: ellenőrizni, hogy ne lépje át a maximum játékos számot a meccs
document.querySelector(".sim-btn").addEventListener("click", () => {

    var inputs = []
    var checkbox = ""
    for(let i = 0; i < players_used.length; i++){
        checkbox = document.querySelector(`.index-${i}`)
        if(checkbox.checked){
            inputs.push(checkbox)
            checkbox.classList.remove("is-invalid")
        }
    }

    var input_len =inputs.length
    var id = -1
    if(input_len <= games[viewed].get_max_players_in_round()){
        for(let i = 0; i < input_len; i++){
            id = Number.parseInt(inputs[i].value)
            if(! viewed){
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
            else{
                add_in_bulk(viewed, id, [
                            games[viewed].get_stats_value("goals", id) + Math.floor(Math.random() * 21),
                            games[viewed].get_stats_value("assists", id) + Math.floor(Math.random() * 21),
                            games[viewed].get_stats_value("saves", id) + Math.floor(Math.random() * 21),
                            games[viewed].get_stats_value("mvps", id) + Math.floor(Math.random() * 2.1),
                            games[viewed].get_stats_value("wins", id) + Math.floor(Math.random() * 2),
                            games[viewed].get_stats_value("matches", id) + 1,
            ])
            }
        }
        sim_modal.hide()
        write()
    }
    else{
        for(let i = 1; i <= input_len - games[viewed].get_max_players_in_round(); i++){
            inputs[inputs.length - i].classList.add("is-invalid")
        }
    }

})