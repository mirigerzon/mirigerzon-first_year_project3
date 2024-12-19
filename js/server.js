class Server {
    constructor() {
        this.myCable;
        this.package;
    }

    deliverPackage() {
        let currentAddressee = this.package.addressee;
        let cablesArr = JSON.parse(localStorage.getItem('cables'));
        let receiveCable;
        if (!JSON.parse(localStorage.getItem(currentAddressee))) {
            receiveCable = new Cable;
            receiveCable.cabelName = this.myCable.cabelName;
            receiveCable.inUse = this.myCable.inUse;
            this.package.messageContent = "שליחה נכשלה - נמען לא קיים";
            this.package.source = "server"
            receiveCable.package = this.package;
        }
        else {
            receiveCable = new Cable;
            for (let i = 0; i < cablesArr.length; i++) {
                if (cablesArr[i].cabelName == currentAddressee) {
                    receiveCable.cabelName = cablesArr[i].cabelName;
                    receiveCable.package = this.package;
                }
            }
            setTimeout(this.animation, 2000);
        }
        let myCurrentCable = new Cable;
        myCurrentCable.cabelName = this.myCable.cabelName;
        myCurrentCable.inUse = this.myCable.inUse;
        myCurrentCable.package = this.package;
        if (JSON.parse(localStorage.getItem(currentAddressee))) {
            myCurrentCable.sentUpdate();
        }
        receiveCable.getUpdate();
        myCurrentCable.inUse = false;
        for (let w = 0; w < cablesArr.length; w++) {
            if (cablesArr[w].cabelName == myCurrentCable.cabelName) {
                cablesArr[w].inUse = false;
            }
        }
        localStorage.setItem('cables', JSON.stringify(cablesArr));
        if (!JSON.parse(localStorage.getItem(currentAddressee))) {
            setTimeout(() => { pageManager.refresh() }, 2000);
            setTimeout(() => { correctAudio.play() }, 2000);
        }
        else {
            setTimeout(() => { pageManager.refresh() }, 6000);
            document.getElementById('sendAnimTruck').classList.remove("driveAnim");
            setTimeout(() => { correctAudio.play() }, 6000);
        }
    }

    animation() {
        document.getElementById('sendAnimTruck').classList.add("driveAnim");
    }

}