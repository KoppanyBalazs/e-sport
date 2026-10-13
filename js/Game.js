class Game{
    #name
    #starting_pay
    #stats
    #max_players_in_round

    constructor(name, stat_names, max_players){
        this.set_name(name)
        this.set_max_players_in_round(max_players)
        this.#stats = {}
        this.set_stats(stat_names)
    }

    is_valid_name(name){
        return name.length >= 4 
    }
    set_name(name){
        if(this.is_valid_name(name)){
            this.#name = name
        }
    }

    set_max_players_in_round(max_players){
        if(Number.isInteger(max_players) && max_players > 0){
            this.#max_players_in_round = max_players
        }
    }

    set_stats(stat_names){
        if(Array.isArray(stat_names)){
            for(let i = 0; i < stat_names.length; i++){
                this.#stats[stat_names[i]] = []
            }
        }
    }

    get_name(){
        return this.#name
    }

    get_max_players_in_round(){
        return this.#max_players_in_round
    }

    get_stats(){
        return this.#stats
    }

    add_stat(stat_name, index, value){
        if(index < this.get_stats()[stat_name].length && Number.isInteger(value)){
            this.get_stats()[stat_name][index] = value
            return true
        }
        else if(Number.isInteger(value)){
            this.get_stats()[stat_name].push(value)
            return true
        }
        return false
    }

    remove_stat(stat_name, index, value){
        if(index < this.get_stats()[stat_name].length && Number.isInteger(value)){
            this.get_stats()[stat_name].splice(index, 1)
            return true
        }        
    }

    remove_empty(){
        var stat_values = this.get_stats().values
        var output_values = []
        for(let i; i < stat_values; i++){
            if(stat_values[i].length > 0){
                output_values.push(stat_values)
            }
        }
        return output_values
    }

    to_string(){
        return `{${this.get_name()};${(this.remove_empty().length > 0) ? this.get_stats() : "Üres"};${this.get_max_players_in_round()}}`

    }
}