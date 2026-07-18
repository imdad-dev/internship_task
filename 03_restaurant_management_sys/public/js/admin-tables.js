$(function () {
  function loadTables() {
    $.get("/api/tables", function (res) {
      if (res.data.length === 0) {
        $("#tablesBody").html('<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No tables yet.</td></tr>');
        return;
      }
      var html = "";
      res.data.forEach(function (t) {
        html += "<tr>" +
          "<td><strong>Table " + t.tableNumber + "</strong></td>" +
          "<td>" + t.capacity + " seats</td>" +
          "<td>" + t.location + "</td>" +
          "<td>" +
            '<select class="form-control status-select" data-id="' + t._id + '" style="padding:6px 10px; font-size:0.78rem; width:auto;">' +
              ["available", "occupied", "reserved"].map(function (s) {
                return '<option value="' + s + '"' + (s === t.status ? " selected" : "") + ">" + s + "</option>";
              }).join("") +
            "</select>" +
          "</td>" +
          "<td>" +
            '<button class="btn btn-outline btn-icon edit-table-btn" data-item=\'' + JSON.stringify(t) + '\'>&#9998;</button> ' +
            '<button class="btn btn-danger btn-icon del-table-btn" data-id="' + t._id + '">&#128465;</button>' +
          "</td>" +
        "</tr>";
      });
      $("#tablesBody").html(html);
    });
  }

  function openModal(title) { $("#tableModalTitle").text(title); $("#tableModalOverlay").addClass("open"); }
  function closeModal() { $("#tableModalOverlay").removeClass("open"); $("#tableForm")[0].reset(); $("#tableForm input[name='_id']").val(""); }

  $("#addTableBtn").on("click", function () { openModal("Add Table"); });
  $("#tableModalClose, #tableCancelBtn, #tableModalOverlay").on("click", function (e) { if (e.target === this) closeModal(); });

  $("#tablesBody").on("click", ".edit-table-btn", function () {
    var t = JSON.parse($(this).attr("data-item"));
    openModal("Edit Table");
    $("#tableForm input[name='_id']").val(t._id);
    $("#tableForm input[name='tableNumber']").val(t.tableNumber);
    $("#tableForm input[name='capacity']").val(t.capacity);
    $("#tableForm input[name='location']").val(t.location);
    $("#tableForm select[name='status']").val(t.status);
  });

  $("#tablesBody").on("change", ".status-select", function () {
    var id = $(this).data("id");
    $.ajax({
      url: "/api/tables/" + id + "/status", method: "PATCH", contentType: "application/json",
      data: JSON.stringify({ status: $(this).val() }),
      success: function () { showToast("Table status updated"); loadTables(); },
    });
  });

  $("#tablesBody").on("click", ".del-table-btn", function () {
    if (!confirm("Delete this table?")) return;
    var id = $(this).data("id");
    $.ajax({ url: "/api/tables/" + id, method: "DELETE", success: function () { loadTables(); showToast("Table deleted"); } });
  });

  $("#tableSaveBtn").on("click", function () {
    var id = $("#tableForm input[name='_id']").val();
    var payload = {
      tableNumber: $("#tableForm input[name='tableNumber']").val(),
      capacity: $("#tableForm input[name='capacity']").val(),
      location: $("#tableForm input[name='location']").val() || "Main Hall",
      status: $("#tableForm select[name='status']").val(),
    };
    $.ajax({
      url: id ? "/api/tables/" + id : "/api/tables",
      method: id ? "PUT" : "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function () { closeModal(); loadTables(); showToast(id ? "Table updated" : "Table added"); },
      error: function (xhr) { showToast((xhr.responseJSON && xhr.responseJSON.message) || "Could not save table", "error"); },
    });
  });

  loadTables();
});
