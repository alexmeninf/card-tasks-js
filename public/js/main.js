var listCards;
var indice_selecionado = -1; //Índice do item selecionado na lista


window.onload = function () {
  listar();
  excluir();
}

document.onclick = function () {
  excluir();
}

document.getElementById('formCard').addEventListener('submit', function (evt) {
  evt.preventDefault();
  adicionar();
  listar();
});

function listar() {
  listCards = JSON.parse(localStorage.getItem('listCards')); //get data from storage

  var list = document.getElementById('orderedList'); //2
  list.innerHTML = '';

  if (listCards !== null) { //if data exist (todos are in storage)
    listCards.forEach(function (v, index) { //append each element into the dom
      var task = JSON.parse(listCards[index]);
      var cardItem = document.createElement('div'); //2

      cardItem.className = "col"; // add classe na div anterior 
      cardItem.innerHTML =
        '<div class="card-task ' + task.color + '">' +
        '<div class="card-head bg-no-check txt-no-check">' +
        '<img src="./public/assets/unchecked.png" alt="unchecked">' +
        'Não concluída' +
        '</div>' +
        '<div class="card-body">' + task.description + '</div>' +
        '<div class="card-footer">' +
        '<button class="action-task archive" title="Arquivar">' +
        '<img src="./public/assets/archive-gray-scale.png" alt="arquivar">' +
        '</button>' +
        '<button class="action-task remove" title="Excluir" data-id="' + index + '">' +
        '<img src="./public/assets/trash-gray-scale.png" alt="excluir">' +
        '</button>' +
        '</div>' +
        '</div>';

      list.appendChild(cardItem); //2
    });
  } else { //if nothing exist in storage, keep todos array empty
    listCards = [];
  }
}

function adicionar() {
  var inputDesc = document.getElementById("input_description");
  var inputColor = document.getElementsByName('input_color');
  var colorChecked = '';

  for (var i = 0; i < inputColor.length; i++) {
    if (inputColor[i].checked) {
      colorChecked = inputColor[i].value;
    }
  }

  if (trim(inputDesc) == '' || is_empty(inputDesc)) {
    alert('Coloque uma descrição');

  } else if (colorChecked == '') {
    alert('Escolha a cor do seu cartão');

  } else {
    // Add item
    var cliente = JSON.stringify({
      description: inputDesc.value,
      color: colorChecked
    });
    listCards.push(cliente);
    localStorage.setItem("listCards", JSON.stringify(listCards));

    // clear inputs
    inputDesc.value = '';
    for (let i = 0; i < inputColor.length; i++) {
      inputColor[i].checked = false;
    }

    alert("Registro adicionado.");

    return true;
  }
}

function trim(myString) {
  return myString.value.replace(/^\s+|\s+$/g, '');
}

function is_empty(myString) {
  return myString.value.length == 0;
}

// function Editar() {
//     listCards[indice_selecionado] = JSON.stringify({
//             Codigo   : document.getElementById("txtCodigo").value,
//             Nome     : document.getElementById("txtNome").value,
//             Telefone : document.getElementById("txtTelefone").value,
//             Email    : document.getElementById("txtEmail").value
//         });//Altera o item selecionado na tabela
//     localStorage.setItem("listCards", JSON.stringify(listCards));
//     alert("Informações editadas.")
//     operacao = "A"; //Volta ao padrão
//     return true;
// }

function excluir() {
  var removeItem = document.getElementsByClassName('remove');

  for (i = 0; i < removeItem.length; i++) {
    removeItem[i].addEventListener("click", function (evt) {
      evt.preventDefault();
      var indice = this.getAttribute('data-id');

      listCards = JSON.parse(localStorage.getItem('listCards'));
      listCards.splice(indice, 1);
      localStorage.setItem("listCards", JSON.stringify(listCards));
      
      alert("Registro excluído.");
      listar();
    });
  }
}


// $("#orderedList").on("click", ".btnEditar", function() {
//     operacao = "E";
//     indice_selecionado = parseInt($(this).attr("alt"));
//     var cli = JSON.parse(listCards[indice_selecionado]);
//     $("#txtCodigo").val(cli.Codigo);
//     $("#txtNome").val(cli.Nome);
//     $("#txtTelefone").val(cli.Telefone);
//     $("#txtEmail").val(cli.Email);
// $("#txtCodigo").attr("readonly","readonly");
//     $("#txtNome").focus();
// });

// $("#orderedList").on("click", ".btnExcluir",function() {
//     indice_selecionado = parseInt($(this).attr("alt"));
//     excluir();
//     listar();
// });