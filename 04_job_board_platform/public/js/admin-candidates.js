$(function () {
  function loadCandidates() {
    $.get("/api/admin/candidates", function (res) {
      if (res.data.length === 0) {
        $("#candidatesBody").html('<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No candidates yet.</td></tr>');
        return;
      }
      var html = "";
      res.data.forEach(function (c) {
        html += "<tr>" +
          "<td><strong>" + c.name + "</strong></td>" +
          "<td>" + c.email + "</td>" +
          "<td>" + (c.headline || "-") + "</td>" +
          "<td>" + (c.location || "-") + "</td>" +
          "<td>" + new Date(c.createdAt).toLocaleDateString() + "</td>" +
          '<td><button class="btn btn-danger btn-icon del-candidate-btn" data-id="' + c._id + '">&#128465;</button></td>' +
        "</tr>";
      });
      $("#candidatesBody").html(html);
    });
  }

  $("#candidatesBody").on("click", ".del-candidate-btn", function () {
    if (!confirm("Remove this candidate account? This cannot be undone.")) return;
    var id = $(this).data("id");
    $.ajax({ url: "/api/admin/candidates/" + id, method: "DELETE", success: function () { loadCandidates(); showToast("Candidate removed"); } });
  });

  loadCandidates();
});
