class Package {
    constructor(messageContent, source, addressee, subject) {
        this.messageContent = messageContent;
        this.source = source;
        this.addressee = addressee;
        this.subject = subject;
    }

    findCable() {
        let cablesArr = JSON.parse(localStorage.getItem("cables"));
        let myCable = new Cable();
        for (let i = 0; i < cablesArr.length; i++) {
            if (cablesArr[i].cabelName == this.source) {
                myCable.inUse = cablesArr[i].inUse;
                myCable.cabelName = cablesArr[i].cabelName;
                myCable.setCable(this);
            }
        }
    }
}