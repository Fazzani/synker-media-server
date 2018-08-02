$(() => {
    let $messages = $('#messages');
    $('[data-toggle="tooltip"]').tooltip();

    $('[data-toggle="popover"]').popover();

    $('#play').click(function () {
        console.log('playing video');
        if (flvjs.isSupported()) {
            console.log('flvjs is supported by this browser!!');
            var videoElement = document.getElementById('videoElement');
            var flvPlayer = flvjs.createPlayer({
                "type": "flv",
                "isLive": true,
                "url": document.getElementById('sURL').nodeValue
            });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play();
        }
    })

    /**
     * Stream info
     */
    $('#info-stream-btn').click(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this).closest('form');
        $messages.empty();

        $.ajax({
            type: "POST",
            url: '/stream/info',
            data: form.serialize(), // serializes the form's elements.
            success: (data) => {
                $messages.append("<li>" + data.command + "</li>")
            }
        });
    });

    /**
     * live stream
     */
    $("#sendCommandStreamForm").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this);
        var url = form.attr('action');
        $messages.empty();

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: (data) => {
                $messages.append(`<li><a href="${data.streamUrl}">Watch</a></li>`);
                $messages.append("<li>" + data.commandline + "</li>")
            }
        });
    });

    /**
     * Shell execute
     */
    $("#sendCommandShellForm").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        console.log('Form sendCommandShellForm was submitted');

        var form = $(this);
        var url = form.attr('action');
        $messages.empty();

        $.ajax({
            type: "POST",
            url: url,
            dataType: 'json',
            data: form.serialize(), // serializes the form's elements.
            success: (data) => {
                $messages.append("<li>" + data + "</li>")
            }
        });
    });

    /**
     * Sockets 
     */
    var socket = io()
    socket.on('shellResultEvent', (data) => {
        $messages.append("<li>" + data + "</li>")
    });
});