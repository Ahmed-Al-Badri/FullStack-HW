class Server_TAT {
  constructor() {
    this.connect = null;
    this.address = "";
    this.port = "";
    this.mess = (a) => {};
    this.open_close = (a) => {};
  }

  setvalues(ip = this.address, port = this.port) {
    this.address = ip;
    this.port = port;
    try {
      if (this.connect != null) {
        this.connect.close();
      }
      console.log("the ip is " + ip + " and the port is " + port);
      this.connect = new WebSocket(`ws://${this.address}:${this.port}`);
      this.connect.onopen = () => {
        console.log("the server opened");
        this.open_close(true);
      };
      this.connect.onerror = () => {
        this.open_close(false);
      };
      this.connect.onmessage = this.mess;
      return true;
    } catch (error) {
      return false;
    }
  }

  set_table(res = (a, b) => {}) {
    this.mess = res;
    if (this.connect) {
      if (this.connect.OPEN) {
        this.connect.onmessage = this.mess;
      }
    }
  }

  set_open_close(res = (a) => {}) {
    this.open_close = res;
    if (this.connect) {
      if (this.connect.OPEN) {
        this.connect.onopen = () => {
          this.open_close(true);
        };
        this.connect.onerror = () => {
          this.open_close(false);
        };
        res(true);
      } else {
        res(false);
      }
    }
  }

  send(prob) {
    if (this.connect) {
      if (this.connect.OPEN) {
        this.connect.send(JSON.stringify(prob));
        prob = true;
      } else {
        prob = false;
      }
    } else {
      prob = false;
    }
    return prob;
  }
}

let TATserver = new Server_TAT();

export default TATserver;
