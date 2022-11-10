// ставим имя работника
$('#fio').text(localStorage.getItem('fullName'));
$('#job').text(localStorage.getItem('job'));

var $table = $("#table");
var $remove = $("#remove");
var selections = []; 

function getIdSelections() {
  return $.map($table.bootstrapTable("getSelections"), function (row) {
    return row.id;
  });
}

function responseHandler(res) {
  $.each(res.rows, function (i, row) {
    row.state = $.inArray(row.id, selections) !== -1;
  });
  return res;
}

window.operateEvents = {
  "click .like": function (e, value, row, index) {
    alert("You click like action, row: " + JSON.stringify(row));
  },
  "click .remove": function (e, value, row, index) {
    $table.bootstrapTable("remove", {
      field: "id",
      values: [row.id],
    });
  },
};

// проверка нормального ввода
$('#createTitle').on('input', function () {
  if ($('#createTitle').val() != "") {
    $('#createButton').prop('disabled', false);
  } else {
    $('#createButton').prop('disabled', true);
  }
});

// проверка совершённых изменений
$('#editTitle').on('input', function () {
  console.log($('#editTitle').val());
  if ($('#editTitle').val() != redux.title) {
    $('#editButton').prop('disabled', false);
  } else {
    $('#editButton').prop('disabled', true);
  }
});

function create() {
  
  // получаем форму
  var form = $('#form')[0];
  // создаём новый объект формы 
  var data = new FormData(form);
  // получаем количество файликов в форме
  // это число должно быть равно 1
  var totalFiles = document.getElementById("formCreateFile").files.length;
  console.log(totalFiles);
  // заносим их в data
  for (var i = 0; i < totalFiles; i++) {
    var file = document.getElementById("formCreateFile").files[i];
    data.append("files", file);
  }

  const titleObj = {"title": $('#createTitle').val()}

  data.append("docTypes", JSON.stringify(titleObj));

  console.log(data);

  $.ajax({
    type: "POST",
    url: `https://localhost:7263/api/DocTypes`,
    data: data,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    cache: false,
    timeout: 600000,
    success: function (data) {
      console.log("SUCCESS : ", data);

      // кидаем уведомление об успешной загрузке
      $('#createRecordModal').modal('hide');
      $('#createSuccessModal').modal('show');
      
    },
    error: function (e) {
      $("#result").text(e.responseText);
      console.log("ERROR : ", e);
    }
  });

  // ждём 1 секунду и обновляем таблицу 
  setTimeout(function(){
    initTable();
  }, 1000);
}

function edit() {
  
  // получаем форму
  var form = $('#form')[0];
  // создаём новый объект формы 
  var data = new FormData(form);
  // получаем количество файликов в форме
  // это число должно быть равно 1
  var totalFiles = document.getElementById("formEditFile").files.length;
  console.log(totalFiles);
  // заносим их в data
  for (var i = 0; i < totalFiles; i++) {
    var file = document.getElementById("formEditFile").files[i];
    data.append("files", file);
  }

  const titleObj = {
    "docTypeId": redux.id,
    "title": $('#editTitle').val()
  }

  data.append("docTypes", JSON.stringify(titleObj));

  console.log(data);

  $.ajax({
    type: "PUT",
    url: `https://localhost:7263/api/DocTypes`,
    data: data,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    cache: false,
    timeout: 600000,
    success: function (data) {
      console.log("SUCCESS : ", data);

      // кидаем уведомление об успешной загрузке
      $('#updateRecordModal').modal('hide');
      $('#updateSuccessModal').modal('show');
      
    },
    error: function (e) {
      $("#result").text(e.responseText);
      console.log("ERROR : ", e);
    }
  });

  // ждём 1 секунду и обновляем таблицу 
  setTimeout(function(){
    initTable();
  }, 1000);
}

function delete_() {

  $.ajax({
    type: "DELETE",
    url: `https://localhost:7263/api/DocTypes/${redux.id}`,
    contentType: 'application/json',
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      console.log("SUCCESS : ", data);

      // кидаем уведомление об успешном удалении
      $('#deleteRecordModal').modal('hide');
      $('#deleteSuccessModal').modal('show');
      
    },
    error: function (e) {
      $("#result").text(e.responseText);
      console.log("ERROR : ", e);
    }
  });

  // ждём 1 секунду и обновляем таблицу 
  setTimeout(function(){
    initTable();
  }, 1000);
}

// иконка для действий
function actionFormatter(value, row) {
    return `
    <button 
    class="btn btn-primary btn-sm"
    id="updateButton" 
    data-bs-toggle="modal" 
    data-bs-target="#updateRecordModal">
      <i class="bi bi-pen"></i>
    </button>
    &nbsp&nbsp&nbsp&nbsp
    <button
    class="btn btn-danger btn-sm"
    id="trashButton" 
    data-bs-toggle="modal" 
    data-bs-target="#deleteRecordModal">
      <i class="bi bi-trash"></i>
    </button>`;
}

function datesFormatter(value, row) {
  var string = "";
  for (let i = 0; i < value.length; i++) {
    console.log(value[i].substring(2, 5));
    if (value[i].substring(2, 5) == "-01") value[i] = value[i].replace("-01", " января");
    if (value[i].substring(2, 5) == "-02") value[i] = value[i].replace("-02", " февраля");
    if (value[i].substring(2, 5) == "-03") value[i] = value[i].replace("-03", " марта");
    if (value[i].substring(2, 5) == "-04") value[i] = value[i].replace("-04", " апреля");
    if (value[i].substring(2, 5) == "-05") value[i] = value[i].replace("-05", " мая");
    if (value[i].substring(2, 5) == "-06") value[i] = value[i].replace("-06", " июня");
    if (value[i].substring(2, 5) == "-07") value[i] = value[i].replace("-07", " июля");
    if (value[i].substring(2, 5) == "-08") value[i] = value[i].replace("-08", " августа");
    if (value[i].substring(2, 5) == "-09") value[i] = value[i].replace("-09", " сентября");
    if (value[i].substring(2, 5) == "-10") value[i] = value[i].replace("-10", " октября");
    if (value[i].substring(2, 5) == "-11") value[i] = value[i].replace("-11", " ноября");
    if (value[i].substring(2, 5) == "-12") value[i] = value[i].replace("-12", " декабря");
    string += value[i] + "<br>";
  }
  return string;
}
  
var redux = null;

// инициализация таблицы с периодичностями
function initTable() {

  // формируем запрос
  const url = `https://localhost:7263/api/Periodicities`;
  var data = [];

  $.ajax({
    contentType: 'application/json',
    type: "GET",
    url: url,
    data: JSON.stringify(data),
    dataType: "json",
    async: false,
    success: function(result) {
      data = result;
      console.log(data);
    },
    error: function(error){
        console.log(error);
    }
  })

  // приводим полученные данные в читаемый вид
  for(let i = 0; i < data.length; i++){
    for(let j = 0; j < data[i].dates.length; j++){
      data[i].dates[j] = dateFormat(data[i].dates[j].substring(0, 10), 'dd-MM-yyyy');
      data[i].dates[j] = data[i].dates[j].substring(0, 5);  
    }
  }

  $table.bootstrapTable("destroy").bootstrapTable({
    height: 550,
    locale: "ru-RU",
    data: data,
  });

  // ненужные пользователю столбцы не отображаем
  $table.bootstrapTable('hideColumn', 'id');

  $table.on(
    "check.bs.table uncheck.bs.table " +
      "check-all.bs.table uncheck-all.bs.table",
    function () {
      $remove.prop("disabled", !$table.bootstrapTable("getSelections").length);

      // save your data, here just save the current page
      selections = getIdSelections();
      // push or splice the selections if you want to save all data selections
    }
  );

  // короче вот эта фигня реагирует на все нажатия мыши по таблице
  // ну и соответственно она логирует строку и клетку, которые были нажаты
  $table.on("all.bs.table", function (e, name, args) {
    // меня же в данной ситуации волнует строка
    // поэтому в redux буду заносить данные с последней нажатой строки
    if (args.length === 3) {
      redux = args[0];
      console.log(redux);
      $('#editTitle').val(redux.title);
      $('#deleteTitle').text(redux.title);
    }
  });
}

initTable();