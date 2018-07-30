    $(() => {
        $('[data-toggle="tooltip"]').tooltip();

        $('[data-toggle="popover"]').popover();

        $("#sendCommandShellForm").submit(function (e) {
            e.preventDefault(); // avoid to execute the actual submit of the form.
            console.log('Form sendCommandShellForm was submitted');

            var form = $(this);
            var url = form.attr('action');
            $('#messages').empty();
            
            $.ajax({
                type: "POST",
                url: url,
                dataType: 'json',
                data: form.serialize(), // serializes the form's elements.
                success: (data) => {
                    // alert(data); // show response from the php script.
                }
            });
        });

        /**
         * Sockets 
         */
        var socket = io()
        socket.on('shellResultEvent', (data) => {
            $('#messages').append("<li>" + data + "</li>")
        });
    });