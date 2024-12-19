let pageManager = new Client();
let server = new Server();
pageManager.registerEvents();
let ifSentIsMsgControl = false;
let ifGetIsMsgControl = true;

function createPackage(e) {
    if (e) {
        e.preventDefault();
    }
    document.getElementById('sendAnimEnve').classList.add("envelopeAnim");
    let source = JSON.parse(localStorage.getItem('currentUser')).email;
    let message = document.querySelector('#message').value;
    let addressee = document.querySelector('#addressee').value;
    let subject = document.querySelector('#subject').value;
    let package1 = new Package(message, source, addressee, subject);
    document.querySelector('#message').value = "";
    document.querySelector('#addressee').value = "";
    document.querySelector('#subject').value = "";
    package1.findCable();
}

function init() {
    let help = JSON.parse(localStorage.getItem('cables'));
    if (!help) {
        let cables = [];
        localStorage.setItem('cables', JSON.stringify(cables));
    }
}

