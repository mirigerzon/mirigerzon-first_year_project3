class Cable {
    constructor(cabelName) {
        this.cabelName = cabelName;
        this.inUse = false;
        this.package;
    }

    setCable(pckg) {
        let cablesArr = JSON.parse(localStorage.getItem('cables'));
        for (let w = 0; w < cablesArr.length; w++) {
            if (cablesArr[w].cabelName == this.cabelName) {
                cablesArr[w].inUse = true;
            }
        }
        localStorage.setItem('cables', JSON.stringify(cablesArr));
        this.package = pckg;
        server.myCable = this;
        server.package = pckg;
        server.deliverPackage();
    }

    getUpdate() {
        let object = JSON.parse(localStorage.getItem(this.cabelName));
        let messagesReceived = object.messagesReceived;
        messagesReceived.push(this.package);
        localStorage.setItem(this.cabelName, JSON.stringify(object));
    }

    sentUpdate() {
        let object = JSON.parse(localStorage.getItem(this.cabelName));
        let messagesSent = object.messagesSent;
        messagesSent.push(this.package);
        localStorage.setItem(this.cabelName, JSON.stringify(object));
    }

}