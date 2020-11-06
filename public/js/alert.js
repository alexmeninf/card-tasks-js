(function (proxied) {
  window.alert = function () {
    message(arguments[0], arguments[1]);
  };
})(window.alert);

function message() {
  try {
    var $alert = document.querySelector(".alert");
    $alert.parentElement.removeChild($alert);
  } catch ($error) {}

  var $alert = document.createElement("span");
  if (arguments[0] == null) {
    arguments[0] = "Mensagem indisponível.";
  }
  if (arguments[1] == null) {
    arguments[1] = "Título";
  }
  $alert.innerHTML =
    '<div class="alert-wrap"><div class="alert"><div class="inner"><div class="title">' +
    arguments[1] +
    '</div><div class="text">' +
    arguments[0] +
    '</div></div><button type="button" class="button">Ok</button></div></div>';
  document.querySelector("body").appendChild($alert);
  setTimeout(function () {
    document
      .querySelector(".alert .button:last-child")
      .addEventListener("click", function () {
        $alert.parentElement.removeChild($alert);
      });
  });
  return false;
}