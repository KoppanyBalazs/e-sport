class Player {
    #name;
    #nick;
    #id;
    #pay;
    #game;
    #contracttime;

    constructor(name, nick, id, pay, game) {
        this.set_name(name);
        this.set_nick(nick);
        this.set_id(id);
        this.set_pay(pay);
        this.set_game(game);
    }

    set_name(name) {
        if (name.length <= 5) {
            this.#name = "Ismeretlen játékos"
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
        if (val < 0 || val > 1_000_000) {
            this.#pay = 0;
        }
        else {
            this.#pay = val;
        }
    }

    set_contracttime(date, time) {
        // date formátum: yyyy-mm-dd
        // time formátum: hh:mm
        var dateParts = date.split("-");
        var timeParts = time.split(":");

        this.#contracttime = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1])
        );

    }

    set_game(game) {
        this.#game = game;
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
        var now = new Date();

        var from = Math.floor((dateTime.getTime() - now.getTime()) / 1000);

        return (from < 0) ? "Lejárt" : from;
    }

    to_string() {
        return `{${this.get_name()};${this.get_nick()};${this.get_id()};${this.get_game().get_name()};${this.get_pay()};${this.get_contracttime()}}`
    }
}
