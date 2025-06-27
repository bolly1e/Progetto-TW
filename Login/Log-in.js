const localhost = window.location.hostname;
const Login = document.getElementById("btn");
Login.addEventListener("click", async () => {
  let user = {
    username: document.getElementById("input-email").value,
    password: document.getElementById("input-psw").value,
  };
  await login(user);
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

async function searchNameAndPswd(nameCmp, pswdCmp) {
  const response = await fetch(`http://${localhost}:3000/account`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const match = data.names.find(
    (names) =>
      names.name &&
      names.pswd &&
      names.name.localeCompare(nameCmp) === 0 &&
      names.pswd.localeCompare(pswdCmp) === 0
  );
  return match ? true : false;
}

async function updateActual(name) {
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
      update: true,
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

async function login(user) {
  if (user.username) {
    if (user.username.length >= 3) {
      if (user.password) {
        if (user.password.length >= 8) {
          let comp = await searchNameAndPswd(user.username, user.password);
          if (comp) {
            await updateActual(user.username);
            await render(user.username);
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
      ErrorP.appendChild(ErrorMsgs.InvalidName);
    }
  } else {
    if (ErrorP.hasChildNodes()) {
      ErrorP.removeChild(ErrorP.firstChild);
    }
    ErrorP.appendChild(ErrorMsgs.NoName);
  }
}