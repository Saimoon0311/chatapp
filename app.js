// function loading() {
//     setTimeout(function() {
//         document.getElementById('loading').style.display = "none";
//     }, 400);
    
// }


var firebaseConfig = {
    apiKey: "AIzaSyCVvzlbnf_DvATvvQxtSma_1Kq4s539u2A",
    authDomain: "my-chat-e335a.firebaseapp.com",
    databaseURL: "https://my-chat-e335a.firebaseio.com",
    projectId: "my-chat-e335a",
    storageBucket: "my-chat-e335a.appspot.com",
    messagingSenderId: "883822160264",
    appId: "1:883822160264:web:d49fcd8a1f345765d0b23d",
    measurementId: "G-CMPJ8BFHVQ"
  };

firebase.initializeApp(firebaseConfig);

let myName;
let username = document.getElementById('username');
let orCreatacc = document.getElementById('orcreateAcc');
let logmyacc = document.getElementById('logmyacc');
let login_form = document.getElementById('login_form');
let signup_form = document.getElementById('signup_form');
let signup_email = document.getElementById('signup_email');
let signup_password = document.getElementById('signup_password');
let login_email = document.getElementById("login_email");
let login_password = document.getElementById("login_password");
let chatapp = document.getElementById('chatapp');
let logout_btn = document.querySelector('.logout-btn');
let errorMessage = document.getElementById('userErrors');
let succesMessege = document.getElementById('succesMessege');
let user_profile_name = document.getElementById('user-profile-name');


orCreatacc.addEventListener('click', registerNewUser);
logmyacc.addEventListener('click', loginolduser);

// User login / signup Authentication 

function registerNewUser() {
    signup_form.style.display = "flex";
    login_form.style.display = "none";
}


function loginolduser() {
    login_form.style.display = "flex";
    signup_form.style.display = "none";
}


function signup() {
    firebase.auth().createUserWithEmailAndPassword(signup_email.value, signup_password.value)
        .then(function(result) {
            myName = signup_email.value;
            errorMessage.style.display = "none";
            signup_email.value = "";
            signup_password.value = "";
            firebase.database().ref("messages").push().set({
                "sender": myName,
                "message": 'new user connected!'
            });
            user_profile_name.innerHTML = myName + "&nbsp (Online)";
        })
        .catch(function(error) {
            // Handle Errors here.
            errorMessage.innerHTML = error.message;
            errorMessage.style.display = "block";
            // ...
        });
}

function login() {
    firebase.auth().signInWithEmailAndPassword(login_email.value, login_password.value)
        .then(function(result) {
            myName = login_email.value;
            errorMessage.style.display = "none";
            firebase.database().ref("messages").push().set({
                "sender": myName,
                "message": 'new user connected!'
            });
            user_profile_name.innerHTML = myName + "&nbsp (Online)";
            login_email.value = "";
            login_password.value = "";
        })
        .catch(function(error) {
            // Handle Errors here.
            errorMessage.innerHTML = error.message;
            errorMessage.style.display = "block";
        });
}


firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
        // User is signed in.
        login_form.style.display = "none";
        signup_form.style.display = "none";
        chatapp.style.display = "flex";
        logout_btn.style.display = "block";
        var user = firebase.auth().currentUser;
        myName = user.email;
    } else {
        // No user is signed in.
        login_form.style.display = "flex";
        signup_form.style.display = "none";
        chatapp.style.display = "none";
        logout_btn.style.display = "none";
    }
});

function logout() {
    firebase.auth().signOut();
    let ssMess = document.getElementById('succesMessege');
    if (ssMess) {
        ssMess.style.display = "none";
    }
    window.location.reload();
}

function removeNoti(notification) {
    notification.parentNode.remove();;
}


// chat app code
let ourmsg = document.getElementById('ourmsg');
let msgbox = document.getElementById('msgbox');

function sendMessage() {
    let chck = ourmsg.value.split(' ').join('');
    if (chck === "") {
        alert("Please Enter your messege!");
        return false;
    } else {
        // save in database
        firebase.database().ref("messages").push().set({
            "sender": myName,
            "message": ourmsg.value
        });
        ourmsg.value = "";
        msgbox.scrollTop = msgbox.scrollHeight;
        return false
    }
}


firebase.database().ref("messages").on("child_added", function(snapshot) {

    if (snapshot.val().message == "new user connected!") {
        msgbox.innerHTML += `<li class="newusercont">
        <i class="fa fa-circle"></i>
        ${snapshot.val().message} &nbsp (${snapshot.val().sender})
        </li>`
        user_profile_name.innerHTML = myName + "&nbsp (Online)";
    } else if (snapshot.val().sender == myName) {
        msgbox.innerHTML += `<li class="me" id="message-${snapshot.key}">
                    <p class="profile">Me: </p>
                      ${snapshot.val().message}
                    <i class="fa fa-trash delbtn" data-id="${snapshot.key}" onclick=deleteMessage(this)></i>
                 </li>`
        user_profile_name.innerHTML = myName + "&nbsp (Online)";
    } else {
        msgbox.innerHTML += `<li class="other">
                    <p class="profile">Messege is sent By: ${snapshot.val().sender} </p>
                     ${snapshot.val().message}</li>`
        user_profile_name.innerHTML = myName + "&nbsp (Online)";
    }
    msgbox.scrollTop = msgbox.scrollHeight;
});


function deleteMessage(self) {
    var messageId = self.getAttribute("data-id");
    firebase.database().ref("messages").child(messageId).remove();

};
firebase.database().ref("messages").on("child_removed", function(snapshot) {
    document.getElementById(`message-${snapshot.key}`).innerHTML = "This message has been removed";
});