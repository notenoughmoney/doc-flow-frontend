var redux = {};

// наполнение form-select для типов документов
$.ajax({
  type: "GET",
  url: `https://localhost:7263/api/DocTypes`,
  contentType: 'application/json',
  dataType: "json",
  cache: false,
  timeout: 600000,
  success: function (data) {
    for (let i = 0; i < data.length; i++){
      $('.form-select-docType').append(`<option value="${data[i].id}">${data[i].title}</option>`);
    }
  },
  error: function (e) {
    $("#result").text(e.responseText);
    console.log("ERROR : ", e);
  }
});

// наполнение form-select для должностей
$.ajax({
  type: "GET",
  url: `https://localhost:7263/api/Jobs`,
  contentType: 'application/json',
  dataType: "json",
  cache: false,
  timeout: 600000,
  success: function (data) {
    for (let i = 0; i < data.length; i++){
      $('.form-select-job').append(`<option value="${data[i].id}">${data[i].title}</option>`);
    }
  },
  error: function (e) {
    $("#result").text(e.responseText);
    console.log("ERROR : ", e);
  }
});

// наполнение form-select для периодичностей
$.ajax({
  type: "GET",
  url: `https://localhost:7263/api/Periodicities`,
  contentType: 'application/json',
  dataType: "json",
  cache: false,
  timeout: 600000,
  success: function (data) {
    for (let i = 0; i < data.length; i++){
      $('.form-select-period').append(`<option value="${data[i].id}">${data[i].title}</option>`);
    }
  },
  error: function (e) {
    $("#result").text(e.responseText);
    console.log("ERROR : ", e);
  }
});


// // проверка нормального ввода
// $('#createFullName').on('input', function () {
//   console.log($('#createFullName').val());
//   if ($('#createFullName').val() != "" && $('#createMail').val() != "") {
//     $('#createButton').prop('disabled', false);
//   } else {
//     $('#createButton').prop('disabled', true);
//   }
// });
// // проверка нормального ввода
// $('#createMail').on('input', function () {
//   console.log($('#createMail').val());
//   if ($('#createFullName').val() != "" && $('#createMail').val() != "") {
//     $('#createButton').prop('disabled', false);
//   } else {
//     $('#createButton').prop('disabled', true);
//   }
// });

// проверка совершённых изменений
$('#editFullname').on('input', function () {
  console.log($('#editFullname').val());
  if ($('#editFullname').val() != redux.fullName) {
    $('#editButton').prop('disabled', false);
  } else {
    $('#editButton').prop('disabled', true);
  }
});

// проверка совершённых изменений
$('#editMail').on('input', function () {
  console.log($('#editMail').val());
  if ($('#editMail').val() != redux.mail) {
    $('#editButton').prop('disabled', false);
  } else {
    $('#editButton').prop('disabled', true);
  }
});



// иконки для действий
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
  
