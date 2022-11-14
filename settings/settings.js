// ставим имя работника
$('#fio').text(localStorage.getItem('fullName'));
$('#job').text(localStorage.getItem('job'));

// если не директор и не завуч, то тупа скрываем блоки
if (
    localStorage.getItem('jobId') != 3 &&
    localStorage.getItem('jobId') != 4 &&
    localStorage.getItem('jobId') != 5 &&
    localStorage.getItem('jobId') != 9) {
        $('#directory').hide();
        $('#reports').hide();
    }