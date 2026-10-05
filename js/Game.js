class Game{
    #name
    #starting_pay
    #stats
    #max_players_in_round

    constructor(name, starting_pay, stat_names, max_players){
        this.set_name(name)
        this.set_starting_pay(starting_pay)
        this.set_max_players_in_round(max_players)
        this.#stats = {}
        this.set_stats(stat_names)
    }

    is_valid_name(name){
        name = name.toLowerCase()
        if(! name.contains(" ") || ! name.length >= 4){
            return false
        }

        for(let i = 0; i < name.length; i++){
            if((nev[i] < "a" || nev[i] > "z") && nev[i] != " "){
                return false
            }
        }
        return true
    }
    set_name(name){
        if(is_valid_name(name)){
            this.#name = name
        }
    }
    
    set_starting_pay(starting_pay){
        if(Number.isInteger(starting_pay) && starting_pay > 0){
            this.#starting_pay = starting_pay
        }
    }

    set_max_players_in_round(max_players){
        if(Number.isInteger(max_players) && max_players > 0){
            this.#max_players_in_round = max_players
        }
    }

    set_stats(stat_names){
        if(Array.isArray()){
            for(let i; i < stat_names.length; i++){
                this.#stats[stat_names[i]] = []
            }
        }
    }

    get_name(){
        return this.#name
    }

    get_staring_pay(){
        return this.#starting_pay
    }

    get_max_players_in_round(){
        return this.#max_players_in_round
    }

    get_stats(){
        return this.#stats
    }
    /*
    TODO:
    add_value
    remove_value
    */

    remove_empty(){
        var stat_values = this.get_stats().values()
        var output_values = []
        for(let i; i < stat_values; i++){
            if(stat_values[i].length > 0){
                output_values.push(stat_values)
            }
        }
        return output_values
    }

    to_string(){
        return `{${this.get_name()};${this.get_staring_pay()};${(this.remove_empty().length > 0) ? this.get_stats() : "Üres"};${this.get_max_players_in_round()}}`

    }
}