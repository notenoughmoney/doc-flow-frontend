$(document).ready(function() {

  // ставим имя работника
  $('#fio').text(localStorage.getItem('fullName'));
  $('#job').text(localStorage.getItem('job'));

  $('#example').DataTable( {
      language: {
          url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/ru.json'
      }
  } );
} );