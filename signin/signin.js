$(document).ready(function(){
    const url="https://localhost:7263/api/LogIn";
    $('#login').click(function(){

        // проверяем на правильность mail
        if (!$('#mail').val().includes('@')) {
            $('#mailEx').modal('show');
            return;
        }
        
        const data = {
            mail: $('#mail').val(),
            password: $('#password').val()
        }

        $.ajax({
            contentType: 'application/json',
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            success: function(result) {
                if (result.length === 0) {
                    $('#enterEx').modal('show');
                } else {
                    console.log(result[0]);
                    // устанавиливаем local storage
                    localStorage.setItem("id", result[0].id);
                    localStorage.setItem("fullName", result[0].fullName);
                    localStorage.setItem("job", result[0].job);
                    if (result[0].jobId >= 3 && result[0].jobId <= 5) {
                        window.location.href = '..\\head-teacher\\head-teacher.html';
                    }
                }
            },
            error: function(error){
                console.log(error);
            }
        })
    })
})