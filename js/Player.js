class Player {
    #name;
    #nick;
    #id;
    #pay;
    #game;

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
            this.#val = 0;
        }
        else {
            this.#val = val;
        }
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

    to_string() {
        return `{${this.get_name()};${this.get_nick()};${this.get_id()};${this.get_game()};${this.get_pay()}}`
    }
}
