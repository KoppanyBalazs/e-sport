class Game{
    #name //Játék neve
    #stats //Milyen stat-ok lesznek a játékban (pl.: kills vagy goals)
    #max_players_in_round //Mennyi játékos lehet egy meccsben

    constructor(name, stat_names, max_players){
        this.set_name(name)
        this.set_max_players_in_round(max_players)
        this.#stats = {}
        this.set_stats(stat_names)
    }

    //Név validitásának ellenőrzése
    is_valid_name(name){
        return name.length >= 4 
    }

    //Új név ha valid
    set_name(name){
        if(this.is_valid_name(name)){
            this.#name = name
        }
    }

    //Meccsenkénti max játékosok beállítása
    set_max_players_in_round(max_players){
        if(Number.isInteger(max_players) && max_players > 0){
            this.#max_players_in_round = max_players
        }
    }

    //#stats feltöltése üres listákkal --> ide jönnek majd a konkrét játékosok meccs adatai
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

    get_stats_value(stat_name, index){
        if(index < this.get_stats()[stat_name].length && index > -1){
            return this.get_stats()[stat_name][index]
        }
    }

    //Új érték adása egy meglévő stathoz, ha az index eggyel nagyobb a legnagyobbnál, új értékként pusholja, egyébként meg csak módosítja a meglévőt
    add_stat_value(stat_name, index, value){
        if(Number.isInteger(value) && index < this.get_stats()[stat_name].length){
            this.get_stats()[stat_name][index] = value
            return true
        }
        else if(Number.isInteger(value) && index == this.get_stats()[stat_name].length){
            this.get_stats()[stat_name].push(value)
            return true
        }
        return false
    }

    //Meglévő stathoz tartozó érték kitörlése, ha létezik
    remove_stat_value(stat_name, index){
        if(index < this.get_stats()[stat_name].length){
            this.get_stats()[stat_name][index] = 0
            return true
        }
        return false;
    }

    //Üres érték listák törlése --> 2d lista visszadása a feltöltött listákkal
    remove_empty(){
        var stat_values = Object.values(this.get_stats())
        var output_values = []
        for(let i = 0; i < stat_values.length; i++){
            if(stat_values[i].length > 0){
                output_values.push(stat_values[i])
            }
        }
        return output_values
    }

    to_string(){
        return `{${this.get_name()};${(this.remove_empty().length > 0) ? JSON.stringify(this.remove_empty()) : "Üres"};${this.get_max_players_in_round()}}`
        
    }
}