$(function () {
  var statuses = ["pending", "confirmed", "completed", "cancelled"];

  function loadReservations() {
    var status = $("#resStatusFilter").val();
    $.get("/api/reservations" + (status ? "?status=" + status : ""), function (res) {
      if (res.data.length === 0) {
        $("#resBody").html('<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No reservations found.</td></tr>');
        return;
      }
      var html = "";
      res.data.forEach(function (r) {
        var opts = statuses.map(function (s) {
          return '<option value="' + s + '"' + (s === r.status ? " selected" : "") + ">" + s + "</option>";
        }).join("");
        html += "<tr>" +
          "<td><strong>" + r.customerName + "</strong><br/><span style='font-size:0.76rem;color:var(--text-muted);'>" + r.phone + "</span></td>" +
          "<td>" + r.date + " · " + r.time + "</td>" +
          "<td>" + (r.table ? "T" + r.table.tableNumber + " (" + r.table.capacity + " seats)" : "-") + "</td>" +
          "<td>" + r.guests + "</td>" +
          "<td style='max-width:180px; font-size:0.8rem; color:var(--text-muted);'>" + (r.specialRequest || "-") + "</td>" +
          "<td><select class='form-control res-status-select' data-id='" + r._id + "' style='padding:6px 10px; font-size:0.78rem; width:auto;'>" + opts + "</select></td>" +
          '<td><button class="btn btn-danger btn-icon del-res-btn" data-id="' + r._id + '">&#128465;</button></td>' +
        "</tr>";
      });
      $("#resBody").html(html);
    });
  }

  $("#resStatusFilter").on("change", loadReservations);

  $("#resBody").on("change", ".res-status-select", function () {
    var id = $(this).data("id");
    $.ajax({
      url: "/api/reservations/" + id + "/status", method: "PATCH", contentType: "application/json",
      data: JSON.stringify({ status: $(this).val() }),
      success: function () { showToast("Reservation updated"); loadReservations(); },
    });
  });

  $("#resBody").on("click", ".del-res-btn", function () {
    if (!confirm("Delete this reservation?")) return;
    var id = $(this).data("id");
    $.ajax({ url: "/api/reservations/" + id, method: "DELETE", success: function () { loadReservations(); showToast("Reservation deleted"); } });
  });

  loadReservations();
});
