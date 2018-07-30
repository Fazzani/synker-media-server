    $(() => {
        $("send").click(() => {
            var chatMessage = {
                name: $("#txtName").val(), chat: $("#txtMessage").val()
            }
            postChat(chat)
        });

    })
    function postChat(chat){
        console.log(chat)
    }

     // Initialize tooltip component
     $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
  
      // Initialize popover component
      $(function () {
        $('[data-toggle="popover"]').popover()
      })