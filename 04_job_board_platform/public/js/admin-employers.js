$(function () {
  function loadEmployers() {
    $.get("/api/admin/employers", function (res) {
      if (res.data.length === 0) {
        $("#employersBody").html('<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No employers yet.</td></tr>');
        return;
      }
      var html = "";
      res.data.forEach(function (e) {
        html += "<tr>" +
          "<td><strong>" + e.companyName + "</strong></td>" +
          "<td>" + e.contactName + "</td>" +
          "<td>" + e.email + "</td>" +
          "<td>" + e.industry + "</td>" +
          "<td>" + new Date(e.createdAt).toLocaleDateString() + "</td>" +
          '<td><button class="btn btn-danger btn-icon del-employer-btn" data-id="' + e._id + '">&#128465;</button></td>' +
        "</tr>";
      });
      $("#employersBody").html(html);
    });
  }

  $("#employersBody").on("click", ".del-employer-btn", function () {
    if (!confirm("Remove this employer and all their job listings? This cannot be undone.")) return;
    var id = $(this).data("id");
    $.ajax({ url: "/api/admin/employers/" + id, method: "DELETE", success: function () { loadEmployers(); showToast("Employer removed"); } });
  });

  loadEmployers();
});
