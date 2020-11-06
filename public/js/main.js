var listaTarefas;

function listar() {
  listaTarefas = JSON.parse(localStorage.getItem('listaTarefas')); //get data from storage

  var list = document.getElementById('orderedList'); 
  var listArchived = document.getElementById('orderedListArchived'); 

  if (list != null) {
    list.innerHTML = '';
  }

  if (listArchived != null) {
    listArchived.innerHTML = '';
  }

  if (listaTarefas !== null) { //if data exist (todos are in storage)
    listaTarefas.forEach(function (v, index) { //append each element into the dom
      var task = JSON.parse(listaTarefas[index]);
      var cardItem = document.createElement('div'); //2
      var status, img, text, imgArchive = "", imgExcluir = '', action1 = '', action2 = "";

      if (task.status == false) {
        status = "bg-no-check txt-no-check";
        img = "./public/assets/unchecked.png";
        text = "Não incluída";
        imgArchive = "./public/assets/archive-gray-scale.png";
      } else {
        status = "bg-yes-check txt-yes-check";
        img = "./public/assets/checked.png";
        text = "Incluída";
        imgArchive = "./public/assets/archive-color.png";
        action1 = 'onClick="arquivar(this.id)"';
      }

      if (task.archived == true) {
        action2 = 'onClick="excluir(this.id)"';
        imgExcluir = './public/assets/trash-color.png';
      } else {
        imgExcluir = './public/assets/trash-gray-scale.png';
      }

      cardItem.className = "col"; // add classe na div anterior 
      cardItem.innerHTML =
        '<div class="card-task ' + task.color + ' ' + status + '">' +
        '<div class="card-head">' +
        '<button type="button" class="checked-list" onClick="editar(this.id)" data-id="' + index + '" id="check-' + index + '"><img src="' + img + '" alt="unchecked"></button>' +
        text +
        '</div>' +
        '<div class="card-body">' + task.description + '</div>' +
        '<div class="card-footer">' +
        '<button class="action-task archived" ' + action1 + ' data-id="' + index + '" id="archived-' + index + '" title="Arquivar">' +
        '<img src="'+imgArchive+'" alt="arquivar">' +
        '</button>' +
        '<button class="action-task remove" title="Excluir" ' + action2 + ' data-id="' + index + '" id="remove-' + index + '">' +
        '<img src="'+imgExcluir+'" alt="excluir">' +
        '</button>' +
        '</div>' +
        '</div>';

      if (task.archived == true) {
        if (listArchived != null) {
            listArchived.appendChild(cardItem);
          }
      } else {
        if (list != null) {
          list.appendChild(cardItem);
        }
      }
    });
  } else { //if nothing exist in storage, keep todos array empty
    listaTarefas = [];
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
    message('Coloque uma descrição', 'Campo obrigatório');

  } else if (colorChecked == '') {
    message('Escolha a cor do seu cartão', 'Campo obrigatório');

  } else {
    // Add item
    var cliente = JSON.stringify({
      description: inputDesc.value,
      color: colorChecked,
      status: false,
      archived: false
    });
    listaTarefas.push(cliente);
    localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));

    // clear inputs
    inputDesc.value = '';
    for (let i = 0; i < inputColor.length; i++) {
      inputColor[i].checked = false;
    }

    document.getElementById("btn-open-form").style.display = "block";
    document.getElementById("hide").style.display = "none";

    return true;
  }
}


function arquivar(clicked_id) {
  var itemSelected = document.getElementById(clicked_id);
  var indice = itemSelected.getAttribute('data-id');

  var items = JSON.parse(localStorage.getItem('listaTarefas'));
  var item = JSON.parse(items[indice]);

  var arquivedValue = true;

  if (item.archived == true) {
    arquivedValue = false;
    message("O seu item foi desarquivado.", "Item Retirado");
  } else {
    message("O seu item foi arquivado.", "Item Arquivado");
  }

  listaTarefas[indice] = JSON.stringify({
    description: item.description,
    color: item.color,
    status: true,
    archived: arquivedValue
  }); //Altera o item selecionado na tabela
  localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));
  listar();
}

function editar(clicked_id) {
  var itemSelected = document.getElementById(clicked_id);
  var indice = itemSelected.getAttribute('data-id');

  var items = JSON.parse(localStorage.getItem('listaTarefas'));
  var item = JSON.parse(items[indice]);

  var statusValue = true;

  if (item.archived == false) {
    if (item.status == true) {
      statusValue = false;
    }
  
    listaTarefas[indice] = JSON.stringify({
      description: item.description,
      color: item.color,
      status: statusValue,
      archived: false
    }); //Altera o item selecionado na tabela
    localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));
    listar();
  } else {
    message("Desarquive para desmarcar", "Ação inválida");
  }
}

function excluir(clicked_id) {
  var removeItem = document.getElementById(clicked_id);
  var indice = removeItem.getAttribute('data-id');

  listaTarefas = JSON.parse(localStorage.getItem('listaTarefas'));
  listaTarefas.splice(indice, 1);
  localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));

  message("Excluído com sucesso!", "Item apagado");
  listar();
}

function trim(myString) {
  return myString.value.replace(/^\s+|\s+$/g, '');
}

function is_empty(myString) {
  return myString.value.length == 0;
}

window.onload = function () {
  listar();
}

if (document.getElementById('formCard') != null && document.getElementById('btn-open-form') != null) {
  document.getElementById('formCard').addEventListener('submit', function (evt) {
    evt.preventDefault();
    adicionar();
    listar();
  });

  document.getElementById("btn-open-form").addEventListener("click", function () {
    document.getElementById("hide").style.display = "block";
    this.style.display = "none";
  });
}