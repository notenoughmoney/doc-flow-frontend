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

// инициализация таблицы с работниками
function initTable() {

  // формируем запрос
  const url = `https://localhost:7263/api/Schedule`;
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
  $table.bootstrapTable('hideColumn', 'docTypeId');
  $table.bootstrapTable('hideColumn', 'jobOfResponsibleId');
  $table.bootstrapTable('hideColumn', 'periodId');

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
      $('#form-select-docType-edit').val(redux.docTypeId);
      $('#form-select-job-edit').val(redux.jobOfResponsibleId);
      $('#form-select-period-edit').val(redux.periodId);

      $('#deleteDocType').text(redux.docType);
      $('#deleteJob').text(redux.jobOfResponsible);
      $('#deletePeriod').text(redux.period);
    }
  });
}

initTable();

function create() {
  
    const data = {
        "docTypeId": $('#form-select-docType-create').val(),
        "jobId": $('#form-select-job-create').val(),
        "periodId": $('#form-select-period-create').val()
    }
  
    console.log(data);
  
    $.ajax({
      type: "POST",
      url: `https://localhost:7263/api/Schedule`,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: "json",
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
  
    const data = {
      "scheduleId": redux.id,
      "docTypeId": $('#form-select-docType-edit').val(),
      "jobId": $('#form-select-job-edit').val(),
      "periodId": $('#form-select-period-edit').val()
  }
  
    console.log(data);
  
    $.ajax({
      type: "PUT",
      url: `https://localhost:7263/api/Schedule`,
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
  
  function delete_() {
  
    $.ajax({
      type: "DELETE",
      url: `https://localhost:7263/api/Schedule/${redux.id}`,
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