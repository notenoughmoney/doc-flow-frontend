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

// иконка для загрузки файла
function fileFormatter(value, row) {
  if (value == null) {
    return `
    <button 
    class="btn btn-primary btn-sm"
    id="uploadButton" 
    data-bs-toggle="modal" 
    data-bs-target="#fileUpload">
      <i class="bi bi-upload"></i>
    </button>`;
  } else {
    return `
    <button 
    class="btn btn-success btn-sm"
    id="downloadButton" 
    data-bs-toggle="modal" 
    data-bs-target="#fileDownload" 
    onclick="location.href='https://localhost:7263/api/FactDocs/download?filename=${value}'">
      <i class="bi bi-download"></i>
    </button>`;
  }
}

// проверка загрузки файла
$('#form').on('change', function () {
  var fileEmpty = $('#formFile').get(0).files.length === 0;
  if (fileEmpty) {
      $('#sendButton').prop('disabled', true);
      $('#formFile').removeClass('is-valid');
      $('#formFile').addClass('is-invalid');
  } else {
      $('#sendButton').prop('disabled', false);
      $('#formFile').removeClass('is-invalid');
      $('#formFile').addClass('is-valid');
  }
});

function send() {

  // получаем форму
  var form = $('#form')[0];
	// создаём новый объект формы 
  var data = new FormData(form);
  // получаем количество файликов в форме
  // это число должно быть равно 1
  var totalFiles = document.getElementById("formFile").files.length;
  console.log(totalFiles);
  // заносим их в data
  for (var i = 0; i < totalFiles; i++) {
    var file = document.getElementById("formFile").files[i];
    data.append("files", file);
  }

  console.log(data);

	// disabled the submit button
  $("#btnSubmit").prop("disabled", true);

  $.ajax({
    type: "PUT",
    enctype: 'multipart/form-data',
    url: `https://localhost:7263/api/FactDocs/${redux.id}`,
    data: data,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 600000,
    success: function (data) {
      $("#result").text(data);
      console.log("SUCCESS : ", data);

      // кидаем уведомление об успешной загрузке
      $('#fileUpload').modal('hide');
      $('#uploadSuccess').modal('show');
      
    },
    error: function (e) {
      $("#result").text(e.responseText);
      console.log("ERROR : ", e);

    }
  });

  // ждём 1 секунду и обновляем таблицу 
  setTimeout(function(){
    initTableWithMine();
  }, 1000);
  
}

var redux = null;

// инициализация таблицы с собственным (завуча) расписанием
function initTableWithMine() {

  // получаем id работника
  const workerId = localStorage.getItem('id');

  // формируем запрос
  const url = `https://localhost:7263/api/FactDocs/${workerId}`;
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
    if (data[i].dateToPass != null)
      data[i].dateToPass = dateFormat(data[i].dateToPass.substring(0, 10), 'dd-MM-yyyy');
    if (data[i].dateOfPass != null)
      data[i].dateOfPass = dateFormat(data[i].dateOfPass.substring(0, 10), 'dd-MM-yyyy');
    data[i].isRelevant = (data[i].isRelevant === true) ? "Да" : "Нет";
  }

  if (data == "P0001: Для данного пользователя нет назначенных документов") {
    $("#table").remove();
    $("#label").text("У вас нет документов, представленных к сдаче");
  }

  $table.bootstrapTable("destroy").bootstrapTable({
    height: 550,
    locale: "ru-RU",
    data: data,
  });

  // ненужные пользователю столбцы не отображаем
  $table.bootstrapTable('hideColumn', 'id');
  $table.bootstrapTable('hideColumn', 'workerId');
  $table.bootstrapTable('hideColumn', 'job');
  $table.bootstrapTable('hideColumn', 'docType');
  $table.bootstrapTable('hideColumn', 'fullName');
  $table.bootstrapTable('hideColumn', 'jobTitle');

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
      $('#typeToShow').text(redux.docTypeTitle);
      $('#dateToShow').text(redux.dateToPass);
    }
  });
}

// инициализация таблицы с расписанием других учителей
function initTableWithTeachers() {

  // формируем запрос
  const url = `https://localhost:7263/api/FactDocs`;
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

  // полученные доки отфильтруем и возмем только учителей
  var filtered = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].job === 1 || data[i].job === 2) {
      filtered.push(data[i]);
    }
  }
  
  // приводим полученные данные в читаемый вид
  for(let i = 0; i < filtered.length; i++){
    if (filtered[i].dateToPass != null)
      filtered[i].dateToPass = dateFormat(filtered[i].dateToPass.substring(0, 10), 'dd-MM-yyyy');
    if (filtered[i].dateOfPass != null)
      filtered[i].dateOfPass = dateFormat(filtered[i].dateOfPass.substring(0, 10), 'dd-MM-yyyy');
    filtered[i].isRelevant = (filtered[i].isRelevant === true) ? "Да" : "Нет";
  }

  $table.bootstrapTable("destroy").bootstrapTable({
    height: 550,
    locale: "ru-RU",
    data: filtered,
  });

  // ненужные пользователю столбцы не отображаем
  $table.bootstrapTable('hideColumn', 'id');
  $table.bootstrapTable('hideColumn', 'workerId');
  $table.bootstrapTable('hideColumn', 'job');
  $table.bootstrapTable('hideColumn', 'docType');
  $table.bootstrapTable('hideColumn', 'linkToFile');
}

// инициализация таблицы с расписанием директора
function initTableWithDirector() {

  // формируем запрос
  const url = `https://localhost:7263/api/FactDocs`;
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

  // полученные доки отфильтруем и возмем только директора
  var filtered = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].job === 9) {
      filtered.push(data[i]);
    }
  }
  
  // приводим полученные данные в читаемый вид
  for(let i = 0; i < filtered.length; i++){
    if (filtered[i].dateToPass != null)
      filtered[i].dateToPass = dateFormat(filtered[i].dateToPass.substring(0, 10), 'dd-MM-yyyy');
    if (filtered[i].dateOfPass != null)
      filtered[i].dateOfPass = dateFormat(filtered[i].dateOfPass.substring(0, 10), 'dd-MM-yyyy');
    filtered[i].isRelevant = (filtered[i].isRelevant === true) ? "Да" : "Нет";
  }

  $table.bootstrapTable("destroy").bootstrapTable({
    height: 550,
    locale: "ru-RU",
    data: filtered,
  });

  // ненужные пользователю столбцы не отображаем
  $table.bootstrapTable('hideColumn', 'id');
  $table.bootstrapTable('hideColumn', 'workerId');
  $table.bootstrapTable('hideColumn', 'job');
  $table.bootstrapTable('hideColumn', 'docType');
  $table.bootstrapTable('hideColumn', 'linkToFile');
}

// инициализация таблицы с расписанием директора
function initTableWithOthers() {

  // формируем запрос
  const url = `https://localhost:7263/api/FactDocs`;
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

  // полученные доки отфильтруем и возмем только директора
  var filtered = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].job >= 6 && data[i].job <= 8) {
      filtered.push(data[i]);
    }
  }
  
  // приводим полученные данные в читаемый вид
  for(let i = 0; i < filtered.length; i++){
    if (filtered[i].dateToPass != null)
      filtered[i].dateToPass = dateFormat(filtered[i].dateToPass.substring(0, 10), 'dd-MM-yyyy');
    if (filtered[i].dateOfPass != null)
      filtered[i].dateOfPass = dateFormat(filtered[i].dateOfPass.substring(0, 10), 'dd-MM-yyyy');
    filtered[i].isRelevant = (filtered[i].isRelevant === true) ? "Да" : "Нет";
  }

  $table.bootstrapTable("destroy").bootstrapTable({
    height: 550,
    locale: "ru-RU",
    data: filtered,
  });

  // ненужные пользователю столбцы не отображаем
  $table.bootstrapTable('hideColumn', 'id');
  $table.bootstrapTable('hideColumn', 'workerId');
  $table.bootstrapTable('hideColumn', 'job');
  $table.bootstrapTable('hideColumn', 'docType');
  $table.bootstrapTable('hideColumn', 'linkToFile');
}

initTableWithMine();

setInterval(() => {
  $('tr').each(function(){    
  var plan = $(this)[0].cells[1].innerText;
  var fact = $(this)[0].cells[2].innerText;
  if (fact == "-") fact = moment().format('DD-MM-YYYY');

  console.log(fact);
  if (dateSorter(plan, fact) < 0)
      $(this).addClass("table-danger");
  if (plan == fact)
      $(this).addClass("table-warning");
  });
}, 1000);