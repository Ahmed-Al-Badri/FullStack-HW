import { Component } from "react";
import { connection } from "../App";
import TATserver from "./TATserver";
import "./style.css";
const player = {
  name: "Name of player",
  id: "undefined",
};

const command = {
  type: "create",
  args: [],
  result: true,
};

const lobby = {
  lobby: "name of Lobby",
  public: true,
  password: "",
};

const status__ = {
  stop: false,
  game: 3, //3 by three,
  table: [], //the [[]...];
  time: 5000,
  names: ["a"],
  current_turn: 0,
  in_charge: true,
  stop: true,
};

class TAT extends Component {
  constructor(probs) {
    super(probs);
    this.state = {
      connected: false,
      ondata: {},
      login: 0,
      lobby: false,
      create: false,
      search_lobby: "",
      Lobbys: [],
      publicprivate: false,
      loaded: undefined,
      status: { ...status__ },
      time: 0,
    };
    this.interval = 0;
    this.message = {};
    this.address = "";
    this.port = "";
    this.person = { ...player };
    this.createlobby = { ...lobby };
  }

  sttart() {
    clearInterval(this.interval);
    let hold = this.state.time;
    this.interval = setInterval(() => {
      console.log("the time is " + hold);
      hold -= 100;
      if (hold <= 0) {
        hold = 0;
      }
      this.setState({ time: hold });
      if (hold == 0) {
        this.stop();
      }
    }, 100);
  }

  stop() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    //console.log("Mounted");
    TATserver.set_open_close((res) => {
      //console.log("the value of the connect is " + res);
      this.setState({ connected: res }, () => {
        //console.log("the new state connect is " + this.state.connected);
      });
    });
    TATserver.set_table((res, ip) => {
      //console.log(res.data);
      this.message = JSON.parse(res.data) || {};
      //console.log("enter message");
      //console.log(this.message);
      if (this.message.type) {
        if (this.message.type == "login") {
          //console.log("login status");
          if (this.message.result == false) {
            //console.log("error logging in");
          } else {
            this.setState({ login: 1 }, () => {
              //console.log("the upcoming data");
              let data = { ...command };
              data.type = "view_lobbys";
              TATserver.send(data);
            });
          }
        }
        if (this.message.type == "create_player") {
          if (this.message.result) {
            this.person = this.message.args[0];
            this.message.type = "login";
            TATserver.send(this.message);
          }
        }
        if (this.message.type == "view_lobbys") {
          //console.log(this.message);
          if (this.message.result) {
            this.setState({ Lobbys: this.message.args[0] });
          }
        }
        if (this.message.type == "create_lobby") {
          if (this.message.result >= 0) {
            this.setState(
              {
                loaded: this.message.result,
                status: this.message.args[0],
                stop: this.message.args[0].stop,
              },
              this.watchTime
            );
          }
        }
        if (this.message.type == "join_game") {
          if (this.message.result >= 0) {
            this.setState(
              {
                loaded: this.message.result,
                status: this.message.args[0],
                stop: this.message.args[0].stop,
              },
              this.watchTime
            );
          }
        }
        if (this.message.type == "status") {
          console.log("user is ");
          console.log(this.message.args[0]);
          if (this.message.result) {
            this.setState(
              {
                status: this.message.args[0],
                stop: this.message.args[0].stop,
              },
              this.watchTime
            );
          }
        }
      }
    });
  }

  watchTime() {
    if (this.state.stop == false) {
      this.setState({ time: this.state.status.time }, () => {
        this.sttart();
      });
    } else {
      this.stop();
    }
  }

  type(a) {
    if (a) {
      a = "Connected";
    } else {
      a = "Disconnected";
    }
    return a;
  }

  render() {
    return (
      <>
        <div className="TAT">
          <div
            tabIndex={2}
            className={`server Hidden ${this.type(this.state.connected)}`}
          >
            <p>The game Ip address and port</p>
            {true ? (
              <>
                <div className="Inner">
                  <p>
                    The game Ip address{" "}
                    <input
                      type="text"
                      onChange={(prob) => {
                        this.address = prob.target.value;
                      }}
                    />
                  </p>

                  <p>
                    The game port{" "}
                    <input
                      type="number"
                      onChange={(prob) => {
                        this.port = prob.target.value;
                      }}
                    />
                  </p>

                  <div
                    className="Button"
                    onClick={() => {
                      //console.log("clicked");
                      TATserver.setvalues(this.address, this.port);
                    }}
                  >
                    Cick me to connect
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className={`header`}>
            <p>The main info</p>
            {this.state.login >= 1 ? (
              <>
                <div>
                  <p>Player name is : {this.person.name}</p>
                  <p>Player id is : {this.person.id}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p>Not logged in</p>
                </div>
              </>
            )}
          </div>
          <div className={`login Hidden ${this.type(this.state.login == 1)}`}>
            <p>Login Details</p>
            <div className="Inner">
              {true ? (
                <>
                  {this.state.connected == true ? (
                    <>
                      <p>Connected to The Game server</p>
                      <div>
                        {/* The view login status */}
                        {this.state.login == 0 ? (
                          <>
                            <div>
                              <div
                                className="Button"
                                onClick={() => {
                                  this.setState({ login: -1 });
                                }}
                              >
                                Click me to create user
                              </div>

                              <div
                                className="Button"
                                onClick={() => {
                                  this.setState({ login: -2 });
                                }}
                              >
                                Click me to Login
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {/* The view create or login */}
                        {this.state.login < 0 ? (
                          <>
                            {this.state.login == -1 ? (
                              <>
                                <div>
                                  <p>
                                    Wanted name{" "}
                                    <input
                                      type="text"
                                      onChange={(res) => {
                                        this.person.name = res.target.value;
                                      }}
                                    />
                                  </p>
                                  <div
                                    className="Button"
                                    onClick={() => {
                                      let commands = { ...command };
                                      commands.type = "create_player";
                                      commands.args = [this.person];
                                      //console.log("create account");
                                      TATserver.send(commands);
                                    }}
                                  >
                                    Create Account
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div>
                                <p>
                                  Name:{" "}
                                  <input
                                    type="text"
                                    onChange={(res) => {
                                      this.person.name = res.target.value;
                                    }}
                                  />
                                </p>
                                <p>
                                  User_id:{" "}
                                  <input
                                    type="text"
                                    onChange={(res) => {
                                      this.person.id = res.target.value;
                                    }}
                                  />
                                </p>
                                <div
                                  className="Button"
                                  onClick={() => {
                                    let commands = { ...command };
                                    commands.type = "login";
                                    commands.args = [this.person];
                                    TATserver.send(commands);
                                    //console.log("Login");
                                  }}
                                >
                                  Login
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </>
                  ) : (
                    <>You are not connected to Server</>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="TATs">
            The main body
            {this.state.login == 1 ? (
              <>
                <div>
                  <div
                    className={`Button Lobbys ${this.type(
                      this.state.lobby == false
                    )} `}
                    onClick={() => {
                      this.setState({ lobby: !this.state.lobby });
                    }}
                  >
                    {this.state.lobby == true ? (
                      <>
                        <div>Hide Lobbys</div>
                      </>
                    ) : (
                      <>
                        <div>Show Lobbys</div>
                      </>
                    )}
                  </div>
                  {this.state.lobby == true ? (
                    <>
                      Theses are the lob
                      <div className="LobbyOptions">
                        <div
                          className={`Button CreateLobby Lobbys ${this.type(
                            this.state.create == false
                          )}`}
                          onClick={() => {
                            this.setState(
                              { create: !this.state.create },
                              () => {
                                if (this.state.create == false) {
                                  let data = { ...command };
                                  data.type = "view_lobbys";
                                  TATserver.send(data);
                                }
                              }
                            );
                          }}
                        >
                          {this.state.create == true ? (
                            <>Shows Lobbys</>
                          ) : (
                            <>Create Lobby</>
                          )}
                        </div>
                        <div className="SearchLobby Lobbys">
                          {" "}
                          Search Lobby{" "}
                          <input
                            type="text"
                            onChange={(prob) => {
                              this.setState({
                                search_lobby: prob.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="LobbyInside">
                          {this.state.create == true ? (
                            <div>
                              Creating Lobby
                              <p>
                                Lobby name{" "}
                                <input
                                  type="text"
                                  onChange={(prob) => {
                                    this.createlobby.lobby = prob.target.value;
                                  }}
                                />
                              </p>
                              <p>
                                Password (empty for none){" "}
                                <input
                                  type="text"
                                  onChange={(prob) => {
                                    this.createlobby.password =
                                      prob.target.value;
                                  }}
                                />
                              </p>
                              <div
                                className={`Button ${this.type(
                                  this.state.publicprivate == false
                                )}`}
                                onClick={() => {
                                  this.setState(
                                    {
                                      publicprivate: !this.state.publicprivate,
                                    },
                                    () => {
                                      this.createlobby.public =
                                        !this.state.publicprivate;
                                      //console.log(this.createlobby);
                                    }
                                  );
                                }}
                              >
                                {this.state.publicprivate == true ? (
                                  <p>Private</p>
                                ) : (
                                  <p>Public</p>
                                )}
                              </div>
                              <div
                                className={`Button`}
                                onClick={() => {
                                  //console.log("create Lobby");
                                  if (this.createlobby.lobby != "") {
                                    let req = { ...command };
                                    req.type = "create_lobby";
                                    req.args = [this.person, this.createlobby];
                                    TATserver.send(req);
                                    //console.log("request for message sent");
                                    this.setState({ create: false });
                                  }
                                }}
                              >
                                Create Lobby
                              </div>
                            </div>
                          ) : (
                            <div className="ShowLobbys">
                              {this.state.Lobbys.map((res, val) => {
                                if (
                                  this.state.search_lobby == "" ||
                                  is_similar(res.lobby, this.state.search_lobby)
                                ) {
                                  return (
                                    <div
                                      key={val}
                                      onClick={() => {
                                        let conn = { ...command };
                                        conn.type = "join_game";
                                        conn.args = [this.person, res.game_id];
                                        TATserver.send(conn);
                                      }}
                                    >
                                      <p>Lobby name: {res.lobby}</p>
                                      <p>
                                        Players:
                                        {res.current_player.map((play) => {
                                          return ` ${play}`;
                                        })}
                                      </p>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {this.state.loaded != undefined ? (
                  <>
                    Game loaded: {this.state.loaded}
                    <div className="loaded">
                      <div className="incharge">
                        {this.state.status.in_charge == true ? (
                          <>
                            <div>
                              You are in charge
                              <div
                                className={`Button ${this.type(
                                  this.state.stop == false
                                )}`}
                                onClick={() => {
                                  let commands = { ...command };
                                  if (this.state.stop == true) {
                                    commands.type = "start_game";
                                  } else {
                                    commands.type = "stop_game";
                                  }
                                  commands.args = [
                                    this.person,
                                    this.state.loaded,
                                  ];
                                  TATserver.send(commands);
                                }}
                              >
                                <p>
                                  {this.state.stop == false ? (
                                    <>Start game</>
                                  ) : (
                                    <>Pause Game</>
                                  )}
                                </p>
                              </div>
                              <div className={`Button`}>restart game</div>
                            </div>
                          </>
                        ) : (
                          <>You are not in charge</>
                        )}
                        <div>
                          <div>{`It is ${
                            this.state.status.names[
                              this.state.status.current_turn
                            ]
                          } turn and the time is ${
                            this.state.time / 1000
                          } Seconds`}</div>
                          {this.state.status.table.map((res, val) => {
                            return (
                              <div key={`row ${val}`}>
                                {res.map((bloc, cur) => {
                                  return (
                                    <div key={`${bloc.taken} ${val} ${cur}`}>
                                      {`block at ${val} and ${cur} is `}
                                      {bloc.taken == -1 ? (
                                        <> Not Taken</>
                                      ) : (
                                        <>
                                          Taken by{" "}
                                          {this.state.status.names[
                                            bloc.taken || 0
                                          ] || "None"}
                                        </>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>Game not loaded</>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    );
  }
}

function is_similar(one, two) {
  if (one == two) {
    one = true;
  } else {
    one = false;
  }
  return one;
}

export default TAT;
