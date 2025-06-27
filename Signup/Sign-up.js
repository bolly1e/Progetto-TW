const localhost = window.location.hostname;
const Singin = document.getElementById("btn");
Singin.addEventListener("click", async () => {
  let user = {
    username: document.getElementById("input-email-signup").value,
    password: document.getElementById("input-psw-signup").value,
    name: document.getElementById("input-name-signup").value,
    lastname: document.getElementById("input-lastname-signup").value,
  };
  await signin(user);
});
let ErrorMsgs = {
  NoUserName: document.createTextNode("Inserire nome utente"),
  NoPassword: document.createTextNode("Inserire Password"),
  ShortPassword: document.createTextNode(
    "La password deve avere almeno 8 caratteri"
  ),
  InvalidName: document.createTextNode(
    "Il nome utente deve avere almeno 3 caratteri"
  ),
  NoName: document.createTextNode("Inserire nome vero"),
  NoLastname: document.createTextNode("Inserire il cognome"),
  ExistingAccount: document.createTextNode(
    "Il nome utente inserito è già in uso"
  ),
};
const ErrorP = document.getElementById("ErrorMsg");

//=======================================================================

async function searchName(nameCmp) {
  await fetch(`http://${localhost}:3000/account`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      response.names.forEach((names) => {
        if (names.name != undefined && names.name.localeCompare(nameCmp) == 0)
          return true; //come strcmp del C
      });
      return false;
    });
}

async function addName(name, pswd) {
  await fetch(`http://${localhost}:3000/account`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      pswd: pswd,
      actual: name,
      add: true,
    }),
  });
}

async function render(name) {
  await fetch(`http://${localhost}:3000/account`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "",
      pswd: "",
      actual: name,
      render: true,
    }),
  });
  window.location.href = `http://${localhost}:3000/Home?usr=${name}`;
}

async function signin(user) {
  console.log(user);
  if (user.username) {
    if (user.username.length >= 3) {
      if (user.name) {
        if (user.lastname) {
          if (user.password) {
            if (user.password.length >= 8) {
              //get quelli attuali, verificare se c'e' gia ed eventualmente aggiungerlo
              if (!(await searchName(user.name))) {
                //nel caso il signup è avvenuto con successo
                await addName(user.name, user.password);
                await render(user.username);
              } else {
                if (ErrorP.hasChildNodes()) {
                  ErrorP.removeChild(ErrorP.firstChild);
                }
                ErrorP.appendChild(ErrorMsgs.ExistingAccount);
              }
            } else {
              if (ErrorP.hasChildNodes()) {
                ErrorP.removeChild(ErrorP.firstChild);
              }
              ErrorP.appendChild(ErrorMsgs.ShortPassword);
            }
          } else {
            if (ErrorP.hasChildNodes()) {
              ErrorP.removeChild(ErrorP.firstChild);
            }
            ErrorP.appendChild(ErrorMsgs.NoPassword);
          }
        } else {
          if (ErrorP.hasChildNodes()) {
            ErrorP.removeChild(ErrorP.firstChild);
          }
          ErrorP.appendChild(ErrorMsgs.NoLastname);
        }
      } else {
        if (ErrorP.hasChildNodes()) {
          ErrorP.removeChild(ErrorP.firstChild);
        }
        ErrorP.appendChild(ErrorMsgs.NoName);
      }
    } else {
      if (ErrorP.hasChildNodes()) {
        ErrorP.removeChild(ErrorP.firstChild);
      }
      ErrorP.appendChild(ErrorMsgs.InvalidName);
    }
  } else {
    if (ErrorP.hasChildNodes()) {
      ErrorP.removeChild(ErrorP.firstChild);
    }
    ErrorP.appendChild(ErrorMsgs.NoUserName);
  }
}
