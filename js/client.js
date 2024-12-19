class Client {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        this.main = document.querySelector("main");
        this.back = false;
        this.goToHomePage();
        window.addEventListener("popstate", () => this.poppingHistory());
    }

    replacePage(pageToReplace, page) {
        while (this.main.firstChild) {
            this.main.removeChild(this.main.lastChild);
        }
        let currentPage = page.content.cloneNode(true);
        this.main.append(currentPage);
        if (!this.back) {
            history.pushState({}, pageToReplace, `#${pageToReplace}`);
        }
        this.back = false;
        let logOutBtn = document.querySelector("#logOut");
        if (logOutBtn) {
            logOutBtn.addEventListener("click", () => location.reload());
        }
    }

    poppingHistory() {
        let hash = location.hash.replace('#', '');
        console.log(hash);
        this.back = true;
        switch (hash) {
            case 'homePage':
                this.goToHomePage();
                break;
            case 'registrPage':
                this.goToRegisterPage();
                break;
            case 'gmailPage':
                this.goToGmailPage();
                break;
        }
    }

    goToHomePage() {
        let homePage = document.querySelector("#login");
        this.replacePage("homePage", homePage);
        let registerLink = document.querySelector("#registerLink").addEventListener('click', () => this.goToRegisterPage());
        let startGmail = document.querySelector("#loginLink").addEventListener('click', () => this.logIn());
    }

    goToRegisterPage() {
        let registerPage = document.querySelector("#registration");
        this.replacePage("registrPage", registerPage);
        let loginLink = document.querySelector("#logInLink").addEventListener('click', () => this.goToHomePage());
        let startGmail = document.querySelector("#signUpLink").addEventListener('click', () => this.signUp());
    }

    goToGmailPage() {
        let gmailPage = document.querySelector("#gmail");
        this.replacePage("gmailPage", gmailPage);
        let logOut = document.querySelector("#logOut").addEventListener('click', () => this.goToHomePage());
        let msgControl = document.querySelector('#msgControl');
        let getBoardTmp = document.querySelector('#getBoard').content.cloneNode(true);
        document.querySelector('.send').addEventListener('click', createPackage);
        msgControl.append(getBoardTmp);
        this.refresh();
    }

    registerEvents() {
        //check if there was a user in our gmail
        let userData = localStorage.getItem('userData');
        if (userData) {
            let user = JSON.parse(userData);
        }
    }

    logIn(e) {
        if (e) {
            e.preventDefault();
        }

        // Get user input values.
        const userName = document.querySelector('#userName').value;
        const userEmail = document.querySelector('#userEmail').value.toString();
        const password = document.querySelector('#pwd').value;

        //Checks if all sections are complete
        if (!userName || !userEmail || !userEmail.match(/^(?=.*[a-zA-Z])(?=.*[@]).+$/) || !password)
            return alert("יש לוודא שכל הנתונים הוזנו תקין.")

        //Data for checking the correctness of the password.
        const checkIfCorrect = JSON.parse(localStorage.getItem(userEmail));
        //Checks if the email exists.
        if (!checkIfCorrect) alert("המשתמש אינו קיים אנא הירשם");
        //Checks the correctness of the password.
        if (checkIfCorrect.password !== password)
            alert("שם המשתמש או הסיסמה שגויים");
        else {
            localStorage.setItem("currentUser", JSON.stringify(checkIfCorrect));
            this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
            alert(`הי ${userName}, ההתחברות בוצעה בהצלחה!`)
            this.goToGmailPage();
        }
    }

    signUp(e) {
        if (e) {
            e.preventDefault();
        }
        console.log('Sign up button clicked!'); // Add this line to check if signUp function is called
        // Get user input values.
        let userName = document.querySelector('#userName').value;
        let userEmail = document.querySelector('#userEmail').value;
        let password = document.querySelector('#pwd').value;
        let check = JSON.parse(localStorage.getItem(userEmail));
        let messagesSent = [];
        let messagesReceived = [];

        //Checks if all sections are complete
        if (!userName || !userEmail || !userEmail.match(/^(?=.*[a-zA-Z])(?=.*[@]).+$/) || !password)
            return alert("יש לוודא שכל הנתונים הוזנו תקין.")
        // Check if the entered email already exists in the users array and send a wrong message in case it happened
        if (check != null)
            alert("המשתמש שהזנת קיים. אנא התחבר");
        else {
            let name = "userData";
            let userData = {
                name: userName,
                email: userEmail,
                password: password,
                messagesSent: messagesSent,
                messagesReceived: messagesReceived
            }
            init();
            localStorage.setItem(userEmail, JSON.stringify(userData));
            localStorage.setItem("currentUser", JSON.stringify(userData));
            this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
            alert(`הי ${userName}, ההרשמה בוצעה בהצלחה!`)
            let userCable = new Cable(userEmail);
            let help = JSON.parse(localStorage.getItem("cables"));
            help.push(userCable);
            localStorage.setItem("cables", JSON.stringify(help));
            this.goToGmailPage();
        }
        let cablesArr = JSON.parse(localStorage.getItem("cables"));
        localStorage.setItem("cables", JSON.stringify(cablesArr));
    }

    refresh() {
        let noMessages = document.createElement('p');
        let newGet = document.createElement('div');
        let newSent = document.createElement('div');
        let me = this.currentUser.email;
        let refreshCurrentUser = JSON.parse(localStorage.getItem(me));
        while (newSent.firstChild) {
            newSent.removeChild(newSent.lastChild);
        }
        while (newGet.firstChild) {
            newGet.removeChild(newGet.lastChild);
        }
        if (ifGetIsMsgControl) {
            let getMessage = document.getElementById('getMessage');
            if (getMessage.firstChild) {
                getMessage.removeChild(getMessage.lastChild);
            }
            if (refreshCurrentUser.messagesReceived.length == 0) {
                noMessages.innerHTML = "לא התקבלו הודעות";
                getMessage.appendChild(noMessages);
            }
            else {
                document.getElementById('sendAnimEnve').classList.remove("envelopeAnim");
                document.getElementById('getMessage').replaceChildren();
                let gPackage;
                for (let i = refreshCurrentUser.messagesReceived.length - 1; i >= 0; i--) {
                    gPackage = refreshCurrentUser.messagesReceived[i];
                    let myDiv = document.createElement('div');
                    myDiv.innerHTML = `<div class = "getMessage ${i}"
                  <p> מאת: ${gPackage.source}</p>
                  <p> נושא: ${gPackage.subject}</p>
                 <p> תוכן ההודעה: ${gPackage.messageContent}</p>
                 <i class="fa-sharp fa-solid fa-trash" id = "trush${i}"></i>
                 </div>`
                    document.getElementById('getMessage').appendChild(myDiv);
                }
            }
        }
        
        else if (ifSentIsMsgControl) {
            let sentMessage = document.getElementById('sentMessage');
            if (sentMessage.firstChild) {
                sentMessage.removeChild(sentMessage.lastChild);
            }
            if (refreshCurrentUser.messagesSent.length == 0) {
                noMessages.innerHTML = "לא נשלחו הודעות";
                document.getElementById('sentMessage').appendChild(noMessages);
            }
            else {
                document.getElementById('sentMessage').replaceChildren();
                let sPackage;
                for (let i = refreshCurrentUser.messagesSent.length - 1; i >= 0; i--) {
                    sPackage = refreshCurrentUser.messagesSent[i];
                    let mySecendDiv = document.createElement('div');
                    mySecendDiv.innerHTML = `<div class = "sentMessage" 
                     <p> אל: ${sPackage.addressee}</p>
                     <p> נושא: ${sPackage.subject}</p>
                    <p> תוכן ההודעה: ${sPackage.messageContent}</p>
                 <i class="fa-sharp fa-solid fa-trash" id = "trush${i}"></i>
                 </div>`
                    document.getElementById('sentMessage').appendChild(mySecendDiv);
                }
            }
        }
        let getBoard = document.getElementById('getBoard');
        let sentBoard = document.getElementById('sentBoard');
        document.querySelector('#goToSentBoard').addEventListener('click', () => { this.changeMsgControl(sentBoard, refreshCurrentUser) });
        document.querySelector('#goToGetBoard').addEventListener('click', () => { this.changeMsgControl(getBoard, refreshCurrentUser) });
        document.querySelector('#dropdownContentBtn').addEventListener('click', () => { this.dropdownConten() });
        document.querySelector('#onClickClose').addEventListener('click', () => { this.closeDropdownConten() })
        let sentMessageBord = document.querySelector('#sentMessage');
        if (sentMessageBord) {
            sentMessageBord.addEventListener('click', () => { this.deleteMsg('sent') });
        }
        let getMessageBord = document.querySelector('#getMessage');
        if (getMessageBord) {
            getMessageBord.addEventListener('click', () => { this.deleteMsg('get') });
        }
    }

    changeMsgControl(statePosition, currentUser) {
        let getBoard = document.getElementById('getBoard');
        let sentBoard = document.getElementById('sentBoard');
        if (statePosition == sentBoard) {
            ifSentIsMsgControl = true;
            ifGetIsMsgControl = false;
        }
        else if (statePosition == getBoard) {
            ifSentIsMsgControl = false;
            ifGetIsMsgControl = true;
        }
        let msgControl = document.querySelector('#msgControl');
        while (msgControl.firstChild) {
            msgControl.removeChild(msgControl.lastChild);
        }

        if (ifGetIsMsgControl) {
            let getBoardTmp = document.getElementById('getBoard').content.cloneNode(true);
            msgControl.append(getBoardTmp);
        }
        else if (ifSentIsMsgControl) {
            let sentBoardTmp = document.getElementById('sentBoard').content.cloneNode(true);
            msgControl.append(sentBoardTmp);
        }
        this.refresh();
    }

    deleteMsg(deleteMsgType) {
        let me = this.currentUser.email;
        let deleteMsgCurrentUser = JSON.parse(localStorage.getItem(me));
        if (deleteMsgType === 'sent') {
            for (let p = deleteMsgCurrentUser.messagesSent.length - 1; p >= 0; p--) {
                let y = document.getElementById('trush' + `${p}`)
                if (y) {
                    y.addEventListener('click', () => { this.deletUpdate(p, me, deleteMsgType) });
                }
            }
        }
        else if (deleteMsgType === 'get') {
            for (let p = deleteMsgCurrentUser.messagesReceived.length - 1; p >= 0; p--) {
                let y = document.getElementById('trush' + `${p}`)
                if (y) {
                    y.addEventListener('click', () => { this.deletUpdate(p, me, deleteMsgType) });
                }
            }
        }

    }

    deletUpdate(p, me, deleteMsgType) {
        let arr = JSON.parse(localStorage.getItem(me));
        if (deleteMsgType === 'sent') {
            arr.messagesSent.splice(p, 1);
        }
        else if (deleteMsgType === 'get') {
            arr.messagesReceived.splice(p, 1);
        }
        localStorage.setItem(me, JSON.stringify(arr));
        localStorage.setItem('currentUser', JSON.stringify(arr));
        this.refresh();
    }

    dropdownConten() {
        let users = JSON.parse(localStorage.getItem("cables"));
        let container = document.querySelector('#dropdownContent');
        let myContainerDiv = document.createElement('div');
        let closeBtn = document.querySelector('.closeBtnNone');
        closeBtn.classList.add("closeBtn")
        closeBtn.classList.remove("closeBtnNone")
        container.classList.remove("dropdownContent");
        for (let i = 0; i < users.length; i++) {
            let link = document.createElement('p');
            link.innerHTML = users[i].cabelName;
            myContainerDiv.appendChild(link);
        }
        container.appendChild(myContainerDiv);
    }

    closeDropdownConten() {
        let container = document.querySelector('#dropdownContent');
        while (container.firstChild) {
            container.removeChild(container.lastChild);
        }
        let closeBtn = document.querySelector('.closeBtn');
        closeBtn.classList.add("closeBtnNone");
        closeBtn.classList.remove("closeBtn");
        container.classList.add("dropdownContent");
    }
}
