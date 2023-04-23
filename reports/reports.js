
  // $('table').on('click', function() {   
  //   console.log(123); 
  //   $('tr').each(function(){    
  //       var plan = $(this)[0].cells[2].innerText;
  //       var fact = $(this)[0].cells[3].innerText;
  //       console.log(plan);
  //       if (dateSorter(plan, fact) < 0)
  //           $(this).addClass("table-danger");
  //       if (plan == fact)
  //           $(this).addClass("table-warning");
  //     });
  // });

  setInterval(() => {
    $('tr').each(function(){    
    var plan = $(this)[0].cells[2].innerText;
    var fact = $(this)[0].cells[3].innerText;
    if (dateSorter(plan, fact) < 0)
        $(this).addClass("table-danger");
    if (plan == fact)
        $(this).addClass("table-warning");
    });
  }, 1000);

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

// наполнение form-select для работников
$.ajax({
  type: "GET",
  url: `https://localhost:7263/api/Workers`,
  contentType: 'application/json',
  dataType: "json",
  cache: false,
  timeout: 600000,
  success: function (data) {
    $('#form-select-worker').append(`<option value="-1">Все</option>`);
    for (let i = 0; i < data.length; i++){
      $('#form-select-worker').append(`<option value="${data[i].id}">${data[i].fullName}</option>`);
    }
  },
  error: function (e) {
    $("#result").text(e.responseText);
    console.log("ERROR : ", e);
  }
});

// наполнение form-select для типов документов
$.ajax({
  type: "GET",
  url: `https://localhost:7263/api/DocTypes`,
  contentType: 'application/json',
  dataType: "json",
  cache: false,
  timeout: 600000,
  success: function (data) {
    $('#form-select-docType').append(`<option value="-1">Все</option>`);
    for (let i = 0; i < data.length; i++){
      $('#form-select-docType').append(`<option value="${data[i].id}">${data[i].title}</option>`);
    }
  },
  error: function (e) {
    $("#result").text(e.responseText);
    console.log("ERROR : ", e);
  }
});

// иконка для скачаивания файла
function fileFormatter(value, row) {
  if (value == null) {
    return `<i class="bi bi-dash-lg"></i>`;
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

// иконка для скачаивания файла
function dateFormatter(value, row) {
  if (value == null) {
    return `<i class="bi bi-dash-lg"></i>`;
  } else {
    return dateFormat(value.substring(0, 10), 'dd-MM-yyyy');
  }
}

var redux = null;

// инициализация таблицы с собственным (завуча) расписанием
function formReport() {

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
  
  // приводим полученные данные в читаемый вид
  for(let i = 0; i < data.length; i++){
    if (data[i].dateToPass != null)
      data[i].dateToPass = dateFormat(data[i].dateToPass.substring(0, 10), 'dd-MM-yyyy');
    if (data[i].dateOfPass != null)
      data[i].dateOfPass = dateFormat(data[i].dateOfPass.substring(0, 10), 'dd-MM-yyyy');
    data[i].isRelevant = (data[i].isRelevant === true) ? "Да" : "Нет";
  }

  // фильтруем по датам
  if ($('#startDate').val() != "") {
    for (let i = 0; i < data.length; i++) {
      if (data[i].dateToPass <= $('#startDate').val()) {
        data[i] = 0;
      }
    }
  }
  if ($('#endDate').val() != "") {
    for (let i = 0; i < data.length; i++) {
      if (data[i].dateToPass >= $('#endDate').val()) {
        data[i] = 0;
      }
    }
  }
  
  // фильтруем по работнику
  if ($('#form-select-worker').val() != -1) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] != 0 && data[i].workerId != $('#form-select-worker').val()) {
        data[i] = 0;
      }
    }
  }

  // фильтруем по типу документа
  if ($('#form-select-docType').val() != -1) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] != 0 && data[i].docType != $('#form-select-docType').val()) {
        data[i] = 0;
      }
    }
  }
  
  var filtered = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] != 0) {
      filtered.push(data[i]);
    }
  }

  // console.log(workerFiltered);

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

  $('tr').each(function(){    
    var plan = $(this)[0].cells[2].innerText;
    var fact = $(this)[0].cells[3].innerText;
    console.log(plan);
    if (dateSorter(plan, fact) < 0)
        $(this).addClass("table-danger");
    if (plan == fact)
        $(this).addClass("table-warning");
  }); 

  // показываем таблицу
  $table.show();   
}