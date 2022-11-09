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

// проверка совершённых изменений
$('#editTitle').on('input', function () {
  console.log($('#editTitle').val());
  if ($('#editTitle').val() != redux.title) {
    $('#editButton').prop('disabled', false);
  } else {
    $('#editButton').prop('disabled', true);
  }
});

function edit() {

  const data = {
    "jobId": redux.id,
    "jobTitle": $('#editTitle').val()
  }

  console.log(data);

  $.ajax({
    type: "PUT",
    url: `https://localhost:7263/api/Jobs`,
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: "json",
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


// иконка для загрузки файла
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
  
var redux = null;

// инициализация таблицы с должностями
function initTable() {

  // формируем запрос
  const url = `https://localhost:7263/api/Jobs`;
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