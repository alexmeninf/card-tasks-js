var storageList;

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


listar = () => {
  storageList = JSON.parse(localStorage.getItem("storageList")); //get data from storage

  let list = $("#orderedList");
  let listArchived = $("#orderedListArchived");

  if (list != null) {
    list.html("");    
  }

  if (listArchived != null) {
    listArchived.html("");
  }

  if (storageList !== null) {
    //if data exist (todos are in storage)
    storageList.forEach(function (v, index) {
      //append each element into the dom
      let task = JSON.parse(storageList[index]);
      let cardItem,
        status,
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

      cardItem = `<div class="col-sm-6 col-md-4 col-lg-3 mt-4">
          <div class="card-task ${task.color} ${status}">
            <div class="card-head">
              <button type="button" class="checked-list" onClick="editar(this.id)" 
              data-id="${index}" id="check-${index}">
                <img src="${img}" alt="unchecked">
              </button>
              ${text}
            </div>
            <div class="card-body">
              ${task.description}
            </div>
            <div class="card-footer">
              <button class="action-task archived" ${action1} 
              data-id="${index}" id="archived-${index}" title="Arquivar">
                <img src="${imgArchive}" alt="arquivar">
              </button>
              <button class="action-task remove" title="Excluir" 
              ${action2} data-id="${index}" id="remove-${index}">
                <img src="${imgExcluir}" alt="excluir">
              </button>
            </div>
          </div>
        </div>`;

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
    storageList = [];
  }

  if ($.trim($(list).html())=='') {
    list.html('<div class="col-12">Ainda não existem tarefas aqui. :)</div>');    
  }

  if ($.trim($(listArchived).html())=='') {
    listArchived.html('<div class="col-12">Sem tarefas arquivadas.</div>');
  }
}


adicionar = () => {
  let inputDesc = $("#input_description").val();
  let inputColor = $("input[name=input_color]:checked");

  if (inputDesc.trim() == "") {
    alert("Campo obrigatório! Coloque uma descrição");

  } else if (!!inputColor.val() === false) {
    alert("Campo obrigatório! Escolha a cor do seu cartão");

  } else {

    $("#submitForm").val("Adicionando...");

    // Add item
    let cliente = JSON.stringify({
      description: inputDesc,
      color: inputColor.val(),
      status: false,
      archived: false,
    });

    storageList.push(cliente);
    localStorage.setItem("storageList", JSON.stringify(storageList));
  
    setTimeout(() => {
      // clear inputs
      $("#input_description").val("");
      $("input[name=input_color]").prop('checked', false);
    
      $("#submitForm").val("Adicionar");
  
      $("#btn-open-form").css({ display: "block" });
      $("#hide").css({display: "none"});
    }, 500);

    return true;
  }
}


arquivar = (clicked_id) => {
  let indice = $("#" + clicked_id).attr("data-id");
  let items = JSON.parse(localStorage.getItem("storageList"));
  let item = JSON.parse(items[indice]);
  let arquivedValue = true;

  if (item.archived == true) {
    arquivedValue = false;
    alert("Item Retirado!");

  } else {
    alert("O seu item foi arquivado.");
  }

  storageList[indice] = JSON.stringify({
    description: item.description,
    color: item.color,
    status: true,
    archived: arquivedValue,
  }); //Altera o item selecionado na tabela

  localStorage.setItem("storageList", JSON.stringify(storageList));
  listar();
}


editar = (clicked_id) => {
  let indice = $("#" + clicked_id).attr("data-id");
  let items = JSON.parse(localStorage.getItem("storageList"));
  let item = JSON.parse(items[indice]);
  let statusValue = true;

  if (item.archived == false) {
    if (item.status == true) {
      statusValue = false;
    }

    storageList[indice] = JSON.stringify({
      description: item.description,
      color: item.color,
      status: statusValue,
      archived: false,
    }); //Altera o item selecionado na tabela

    localStorage.setItem("storageList", JSON.stringify(storageList));
    listar();

  } else {
    alert("Ação inválida! Desarquive para desmarcar");
  }
}


excluir = (clicked_id) => {
  let indice = $("#" + clicked_id).attr('data-id');

  storageList = JSON.parse(localStorage.getItem("storageList"));
  storageList.splice(indice, 1);
  localStorage.setItem("storageList", JSON.stringify(storageList));

  alert("Excluído com sucesso!");
  listar();
}