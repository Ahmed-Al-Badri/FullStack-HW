import { WebSocketServer } from "ws";
let wss = new WebSocketServer({ port: 1000 });

class ttt_games {
  constructor() {
    this.games = {};
    this.cur = 0;
    this.hold = [];
  }

  lobby(prob) {
    let info = [];
    Object.entries(this.games).map(([name, res]) => {
      if (res.public) {
        info.push(res.game_info());
      }
    });
    prob.args = [info];
    return true;
  }

  status(player, game_id, on_change) {
    if (player) {
      if (this.games[game_id]) {
        player = this.games[game_id].status(player, on_change);
      } else {
        player = false;
      }
    } else {
      player = false;
    }
    return player;
  }

  create_game(Player, game_details) {
    if (Player != undefined) {
      let hold = this.hold.pop() || this.cur++;
      this.games[hold] = new game(Player, game_details, hold);
      Player = hold;
    } else {
      Player = undefined;
    }
    return Player;
  }

  join_game(player, game_id) {
    if (player) {
      player = this.games[game_id].join_game(player);
    }
    return player;
  }

  start_game(player, game_id) {
    if (player) {
      //console.log("the game id" + game_id);
      //console.log(this.games);
      player = this.games[game_id].start_game(player);
    } else {
      player = false;
    }
    return player;
  }

  stop_game(player, game_id) {
    if (player) {
      player = this.games[game_id].stops_game(player);
    }
    return player;
  }

  restart_game(player, game_id) {
    if (player) {
      player = this.games[game_id].restarts_game(player);
    }
    return player;
  }

  ready_player(game_id, player) {
    return this.games[game_id].player_ready(player);
  }
}

let player = {
  name: "Name of player",
  id: 123,
  status: false,
  server: [],
};

const status__ = {
  stop: false, // dd second dd
  game: 3, // 3 by 3; dd
  table: [], //[ [3][3][3] 3] dd
  turn: "Name", //player name, dd
  yours: false, //if the current turn player did not request the status dd
  time: 5000, // usally 5 seconds but this is one Second. dd
  over: false, // true when won or stoped.
  status: -1, // no body won, 1 their is a winner
  names: [], // dd
  current_turn: 0,
};

const block = {
  taken: -1, //0 or more for players
};

const game_info = {
  lobby: "lobby of game",
  current_player: [], //players name
  has_pass: false, //if password is empty
  game_id: 0,
};

const game_details = {
  lobby: "name of lobby",
  public: true,
  password: "", // none
};

class game {
  constructor(Players = {}, lobby, game_id = 0) {
    this.players = {};
    //this.players[Players.id] = Players;
    this.blocks = [];
    this.started = false;
    this.public = lobby.public;
    this.password = lobby.password;
    this.game_name = lobby.lobby;
    this.game_id = game_id;
    this.interval = 0;

    this.turn = 0;
    this.amount = 0; // player amount;
    this.turns = [];
    this.turnsNames = [];

    this.cur_status = { ...status__ };
    this.join_game(Players);
    //game settings
    this.temp_wins = {};
  }

  game_info() {
    return {
      ...game_info,
      lobby: this.game_name,
      current_player: this.turnsNames,
      has_pass: this.password == "" ? false : true,
      game_id: this.game_id,
    };
  }

  restarts_game(player) {
    if (player.id == this.turns[0]) {
      this.restart_game();
      this.contact_all();
    }
  }

  restart_game() {
    console.log("blocks started");
    this.blocks = [];
    let sizes = this.amount + 1;
    let some = [];
    for (let i = 0; i < sizes; i++) {
      some = [];
      for (let a = 0; a < sizes; a++) {
        some.push({ ...block });
      }
      this.blocks.push(some);
    }
    this.cur_status.table = this.blocks; // dd
    this.cur_status.game = sizes; // dd
  }

  start_game(player) {
    if (player.id == this.turns[0]) {
      if (this.started == false) {
        this.restart_game();
      }
      this.started = true;
      this.cur_status.stop = false;
      this.run_game();
    }
  }

  join_game(player) {
    if (this.players[player.id] == undefined) {
      this.amount++;
      this.players[player.id] = player;
      this.turns.push(player.id);
      this.turnsNames.push(player.name);
      this.cur_status.names = this.turnsNames; // dd
    } else {
    }
    return this.game_id;
  }

  player_ready(player) {
    this.players[player.id].status = !this.player_ready[player.id].status;
  }

  status(player, on_change) {
    if (player.id == this.turns[this.turn]) {
      //player = true;
      on_change.args = [{ ...this.cur_status, yours: true }];
    } else {
      on_change.args = [this.cur_status];
      //player = true;
    }

    if (player.id == this.turns[0]) {
      on_change.args[0].in_charge = true;
    }
    return true;
  }

  run_game() {
    this.interval = setInterval(() => {
      this.game_runned();
    }, 100);
    this.contact_all();
  }

  stops_game(player) {
    if (player.id == this.turns[0]) {
      this.stop_game();
    }
  }

  stop_game() {
    clearInterval(this.interval);
    this.cur_status.time = 5000;
    this.cur_status.stop = true; // dd
    this.contact_all();
  }

  game_runned() {
    this.temp_wins = this.check_victor();

    if (this.temp_wins.win == true) {
      this.stop_game();
    } else {
      this.cur_status.time -= 100;
      if (this.cur_status.time <= 0) {
        this.update_status();
      }
    }
  }

  update_status() {
    this.turn++;
    this.turn %= this.amount;
    this.cur_status.turn = this.turnsNames[this.turn];
    this.cur_status.current_turn = this.turn; // dd
    //this.names = this.turnsNames;
    this.cur_status.time = 5000;
    this.contact_all();
  }

  do_event(player, did) {
    try {
      if (this.blocks[did.loc[0]][did.loc[1]].taken == -1) {
        if (player.id == this.turns[this.turn]) {
          this.blocks[did.loc[0]][did.loc[1]].taken = this.turn;
          this.cur_status.table = this.blocks;
          this.update_status();
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  contact_all() {
    console.log("Contacted");
    let request = { ...command };
    request.type = "status";
    request.args = [this.cur_status];
    request.result = true;
    Object.entries(this.players).map(([id, data]) => {
      this.status(data, request);
      data.server.map((object) => {
        if (object) {
          if (object.OPEN) {
            object.send(JSON.stringify(request));
          }
        }
      });
    });
  }

  check_victor() {
    return {
      wins: false,
    };
  }
}

const did = {
  loc: [0, 0],
};

class players {
  constructor() {
    this.players = [];
    this.cur = 0;
    this.his = [];
  }

  add(player_json) {
    //console.log(player_json);
    //console.log("on create");
    let hold = this.cur++;
    this.players[hold] = { ...player, ...player_json, id: hold };
    player_json.id = hold;
    return true;
  }

  login(player_json, server) {
    //console.log(player_json);
    //console.log("on login");
    if (this.players[player_json.id] != undefined) {
      if (this.players[player_json.id].name == player_json.name) {
        this.players[player_json.id].server.push(server);
        return true;
      }
    }
    return false;
    //this.players[player_json].server.push(server);
  }

  get_player(player) {
    if (player.id != undefined) {
      player = this.players[player.id];
    } else {
      player = undefined;
    }
    return player;
  }
} //Create_player, login_player
let Players = new players();
let Games = new ttt_games();
/*
let Player1 = { ...player };
let Player2 = { ...player };
Player2.name = "temp 2";
Player2.id = 2;
let game_id = Games.create_game(Player1);
Games.join_game(game_id, Player2);
Games.start_game(game_id);
let aa = {};
setInterval(() => {
  aa = Games.status(game_id, Player1);
  //console.log(aa);
}, 200);
*/

let command = {
  type: "create", //status, create_game,
  // join_game, start_game, ready_game,
  // valid_user
  args: [], //args
  result: true,
};
let curss = 0;
wss.on("connection", (ws, req) => {
  //console.log("client connected");
  let currents = curss++;
  ws.on("message", (message) => {
    // message is command
    let data = JSON.parse(message);
    //console.log(data);
    //console.log(ws);
    //console.log("data from " + currents);
    if (data.type) {
      if (data.type == "status") {
        data.result = Games.status(
          Players.get_player(data.args[0]),
          data.args[1],
          data
        );
        wa.send(JSON.stringify(data));
      }
      if (data.type == "view_lobbys") {
        data.result = Games.lobby(data);
        ws.send(JSON.stringify(data));
      }
      if (data.type == "create_lobby") {
        data.result = Games.create_game(
          Players.get_player(data.args[0]),
          data.args[1]
        );
        Games.status(Players.get_player(data.args[0]), data.result, data);
        ws.send(JSON.stringify(data));
      }

      if (data.type == "join_game") {
        data.result = Games.join_game(
          Players.get_player(data.args[0]),
          data.args[1]
        );
        Games.status(Players.get_player(data.args[0]), data.result, data);
        ws.send(JSON.stringify(data));
      }

      if (data.type == "start_game") {
        console.log("Start game");
        data.result = Games.start_game(
          Players.get_player(data.args[0]),
          data.args[1]
        );
        ws.send(JSON.stringify(data));
      }

      if (data.type == "stop_game") {
        console.log("Stop game");
        data.result = Games.stop_game(
          Players.get_player(data.args[0]),
          data.args[1]
        );
        ws.send(JSON.stringify(data));
      }

      if (data.type == "restart_game") {
        data.result = Games.restart_game(
          Players.get_player(data.args[0]),
          data.args[1]
        );
      }

      if (data.type == "create_player") {
        data.result = Players.add(data.args[0]);
        //console.log("the given id is " + data.args[0].id);
        ws.send(JSON.stringify(data));
      }
      if (data.type == "login") {
        data.result = Players.login(data.args[0], ws);
        ws.send(JSON.stringify(data));
      }
    }
  });

  ws.on("close", () => {
    //console.log("Client closed");
  });
});
