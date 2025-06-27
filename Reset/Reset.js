const localhost = window.location.hostname;
const Reset = document.getElementById("btn");
Reset.addEventListener("click", async () => {
  let user = {
    username: document.getElementById("input-email-reset").value,
    password: document.getElementById("input-psw-reset").value,
  };
  await reset(user);
});
let ErrorMsgs = {
  NoName: document.createTextNode("Inserire nome utente"),
  NoPassword: document.createTextNode("Inserire Password"),
  ShortPassword: document.createTextNode(
    "La password deve avere almeno 8 caratteri"
  ),
  InvalidName: document.createTextNode(
    "Il nome utente deve avere almeno 3 caratteri"
  ),
  NoAccount: document.createTextNode("Account non esistente"),
  WrongPassword: document.createTextNode("Password errata"),
};
const ErrorP = document.getElementById("ErrorMsg");

//==========================================================

async function resetPswd(name, pswd) {
  await fetch(`http://${localhost}:3000/account`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      pswd: pswd,
      actual: "",
      reset: true,
    }),
  });
}

async function reset(user) {
  if (user.username) {
    if (user.username.length >= 3) {
      if (user.password) {
        if (user.password.length >= 8) {
          await resetPswd(user.username, user.password);
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
      ErrorP.appendChild(ErrorMsgs.InvalidName);
    }
  } else {
    if (ErrorP.hasChildNodes()) {
      ErrorP.removeChild(ErrorP.firstChild);
    }
    ErrorP.appendChild(ErrorMsgs.NoName);
  }
}
