$(function () {
  var minDate = new Date().toISOString().slice(0, 10);
  $("input[name='date']").attr("min", minDate);

  $(".table-picker").on("click", ".table-chip", function () {
    $(".table-chip").removeClass("selected");
    $(this).addClass("selected");
    $(this).find("input").prop("checked", true);
  });

  $("#reserveForm").on("submit", function (e) {
    e.preventDefault();

    var tableId = $("input[name='tableId']:checked").val();
    if (!tableId) {
      showToast("Please choose a table", "error");
      return;
    }

    var payload = {
      customerName: $("input[name='customerName']").val(),
      phone: $("input[name='phone']").val(),
      email: $("input[name='email']").val(),
      date: $("input[name='date']").val(),
      time: $("input[name='time']").val(),
      guests: $("input[name='guests']").val(),
      tableId: tableId,
      specialRequest: $("textarea[name='specialRequest']").val(),
    };

    var $btn = $(this).find("button[type='submit']");
    $btn.prop("disabled", true).text("Booking...");

    $.ajax({
      url: "/api/reservations",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function () {
        showToast("Table reserved! We'll see you soon.");
        $("#reserveForm")[0].reset();
        $(".table-chip").removeClass("selected");
        $btn.prop("disabled", false).text("Confirm Reservation");
        setTimeout(function () { window.location.href = "/"; }, 1600);
      },
      error: function (xhr) {
        var msg = (xhr.responseJSON && xhr.responseJSON.message) || "Could not complete reservation.";
        showToast(msg, "error");
        $btn.prop("disabled", false).text("Confirm Reservation");
      },
    });
  });
});
