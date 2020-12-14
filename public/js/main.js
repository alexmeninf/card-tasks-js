var listaTarefas;

jQuery(function () {

  $(window).on("load", function() {
    listar();
  });

  $("#formCard").on("submit", function(evt) {
    evt.preventDefault();
    adicionar();
    listar();
  });
  
  $("#btn-open-form").on("click", function() {
    $("#hide").css({display: 'block'});
    $(this).css({display: 'none'});
  });
});

function listar() {
  listaTarefas = JSON.parse(localStorage.getItem("listaTarefas")); //get data from storage

  var list = $("#orderedList");
  var listArchived = $("#orderedListArchived");

  if (list != null) {
    list.html("");
  }

  if (listArchived != null) {
    listArchived.html("");
  }

  if (listaTarefas !== null) {
    //if data exist (todos are in storage)
    listaTarefas.forEach(function (v, index) {
      //append each element into the dom
      var task = JSON.parse(listaTarefas[index]);
      var cardItem = document.createElement("div"); //2
      var status,
        img,
        text,
        imgArchive = "",
        imgExcluir = "",
        action1 = "",
        action2 = "";

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
        imgExcluir = "./public/assets/trash-color.png";
      } else {
        imgExcluir = "./public/assets/trash-gray-scale.png";
      }

      cardItem.className = "col"; // add classe na div anterior
      cardItem.innerHTML =
        '<div class="card-task ' +
        task.color +
        " " +
        status +
        '">' +
        '<div class="card-head">' +
        '<button type="button" class="checked-list" onClick="editar(this.id)" data-id="' +
        index +
        '" id="check-' +
        index +
        '"><img src="' +
        img +
        '" alt="unchecked"></button>' +
        text +
        "</div>" +
        '<div class="card-body">' +
        task.description +
        "</div>" +
        '<div class="card-footer">' +
        '<button class="action-task archived" ' +
        action1 +
        ' data-id="' +
        index +
        '" id="archived-' +
        index +
        '" title="Arquivar">' +
        '<img src="' +
        imgArchive +
        '" alt="arquivar">' +
        "</button>" +
        '<button class="action-task remove" title="Excluir" ' +
        action2 +
        ' data-id="' +
        index +
        '" id="remove-' +
        index +
        '">' +
        '<img src="' +
        imgExcluir +
        '" alt="excluir">' +
        "</button>" +
        "</div>" +
        "</div>";

      if (task.archived == true) {
        if (listArchived != null) {
          listArchived.append(cardItem);
        }
      } else {
        if (list != null) {
          list.append(cardItem);
        }
      }
    });
  } else {
    //if nothing exist in storage, keep todos array empty
    listaTarefas = [];
  }
}

function adicionar() {
  var inputDesc = $("#input_description").val();
  var inputColor = $("input[name=input_color]:checked");

  if (inputDesc.trim() == "") {
    message("Coloque uma descrição", "Campo obrigatório");
  } else if (!!inputColor.val() === false) {
    message("Escolha a cor do seu cartão", "Campo obrigatório");
  } else {
    // Add item
    var cliente = JSON.stringify({
      description: inputDesc.value,
      color: inputColor,
      status: false,
      archived: false,
    });
    listaTarefas.push(cliente);
    localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));

    // clear inputs
    var inputColor = $("input[name=input_color]").attr('checked', false);


    $("#btn-open-form").css({ display: "block" });
    $("#hide").css({display: "none"});

    return true;
  }
}

function arquivar(clicked_id) {

  var indice = $("#" + clicked_id).attr("data-id");

  var items = JSON.parse(localStorage.getItem("listaTarefas"));
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
    archived: arquivedValue,
  }); //Altera o item selecionado na tabela
  localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));
  listar();
}

function editar(clicked_id) {
  var itemSelected = document.getElementById(clicked_id);
  var indice = itemSelected.getAttribute("data-id");

  var items = JSON.parse(localStorage.getItem("listaTarefas"));
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
      archived: false,
    }); //Altera o item selecionado na tabela
    localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));
    listar();
  } else {
    message("Desarquive para desmarcar", "Ação inválida");
  }
}

function excluir(clicked_id) {
  var removeItem = document.getElementById(clicked_id);
  var indice = removeItem.getAttribute("data-id");

  listaTarefas = JSON.parse(localStorage.getItem("listaTarefas"));
  listaTarefas.splice(indice, 1);
  localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));

  message("Excluído com sucesso!", "Item apagado");
  listar();
}