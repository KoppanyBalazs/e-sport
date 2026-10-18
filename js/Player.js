class Player {
    #name;
    #nick;
    #id;
    #pay;
    #game;
    #contracttime;

    constructor(name, nick, id, pay, game, date_time) {
        this.set_name(name);
        this.set_nick(nick);
        this.set_id(id);
        this.set_pay(pay);
        this.set_game(game);
        this.set_contracttime(date_time);
    }

    set_name(name) {
        var hibas = false;
        for (let i = 0; i < name.length; i++) {
            if ("0123456789".includes(name[i])) {
                hibas = true;
            }
        }
        if (name.length <= 5 || hibas) {
            this.#name = "Ismeretlen Játékos"
        }
        else {
            var name_array = name.split(" ")
            if (name_array.length > 1) {
                name = "";
                for (let i = 0; i < name_array.length; i++) {
                    name += (name_array[i].charAt(0).toUpperCase() + name_array[i].slice(1) + " ");
                }
                this.#name = name.trim();
            }
            else {
                this.#name = (name.charAt(0).toUpperCase() + name.slice(1));
            }
        }
    }

    set_nick(nick) {
        if (nick.length <= 2) {
            this.#nick = "Anonymus"
        }
        else {
            this.#nick = nick;
        }
    }

    set_id(id) {
        if (id >= 0) {
            this.#id = id;
        }
    }

    set_pay(val) {
        val = Number.parseInt(val)
        if (Number.isNaN(val) || val < 0 || val > 1_000_000) {
            this.#pay = 0;
        }
        else {
            this.#pay = val;
        }
    }

    set_contracttime(date_time) {
        this.#contracttime = date_time;
    }

    set_game(game) {
        if (!(game instanceof Game)) {
            this.#game = "Nincs játék hozzárendelve"
        } else {
            this.#game = game;
        }
       
    }

    get_name() {
        return this.#name;
    }
    get_id() {
        return this.#id;
    }
    get_pay() {
        return this.#pay;
    }
    get_game() {
        return this.#game;
    }
    get_nick() {
        return this.#nick;
    }

    get_contracttime() {
        return this.#contracttime;
    }

    get_contractleft() {
        var now = new Date();

        var from = Math.floor((this.#contracttime.getTime() - now.getTime()) / 1000);

        return (from < 0) ? "Lejárt" : from;
    }

    to_string() {
        return `{${this.get_name()};${this.get_nick()};${this.get_id()};${(((this.get_game() instanceof Game))) ? this.get_game().get_name() : this.get_game()};${this.get_pay()};${this.get_contracttime()}}`
    }
}
