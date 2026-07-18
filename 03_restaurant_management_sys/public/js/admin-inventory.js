$(function () {
  function loadInventory() {
    $.get("/api/inventory", function (res) {
      if (res.data.length === 0) {
        $("#invBody").html('<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No inventory items yet.</td></tr>');
        return;
      }
      var html = "";
      res.data.forEach(function (i) {
        var low = i.quantity <= i.thresholdLevel;
        html += "<tr>" +
          "<td><strong>" + i.itemName + "</strong> " + (low ? '<span class="badge badge-cancelled">Low</span>' : "") + "</td>" +
          "<td>" + i.category + "</td>" +
          "<td>" +
            '<button class="btn btn-outline btn-icon adjust-btn" data-id="' + i._id + '" data-delta="-1" style="width:26px;height:26px;">−</button> ' +
            "<strong>" + i.quantity + " " + i.unit + "</strong> " +
            '<button class="btn btn-outline btn-icon adjust-btn" data-id="' + i._id + '" data-delta="1" style="width:26px;height:26px;">+</button>' +
          "</td>" +
          "<td>" + i.thresholdLevel + " " + i.unit + "</td>" +
          "<td>₹" + (i.costPerUnit || 0) + "</td>" +
          "<td>" +
            '<button class="btn btn-outline btn-icon edit-inv-btn" data-item=\'' + JSON.stringify(i) + '\'>&#9998;</button> ' +
            '<button class="btn btn-danger btn-icon del-inv-btn" data-id="' + i._id + '">&#128465;</button>' +
          "</td>" +
        "</tr>";
      });
      $("#invBody").html(html);
    });
  }

  function openModal(title) { $("#invModalTitle").text(title); $("#invModalOverlay").addClass("open"); }
  function closeModal() { $("#invModalOverlay").removeClass("open"); $("#invForm")[0].reset(); $("#invForm input[name='_id']").val(""); }

  $("#addInvBtn").on("click", function () { openModal("Add Inventory Item"); });
  $("#invModalClose, #invCancelBtn, #invModalOverlay").on("click", function (e) { if (e.target === this) closeModal(); });

  $("#invBody").on("click", ".edit-inv-btn", function () {
    var i = JSON.parse($(this).attr("data-item"));
    openModal("Edit Inventory Item");
    $("#invForm input[name='_id']").val(i._id);
    $("#invForm input[name='itemName']").val(i.itemName);
    $("#invForm input[name='quantity']").val(i.quantity);
    $("#invForm select[name='unit']").val(i.unit);
    $("#invForm input[name='thresholdLevel']").val(i.thresholdLevel);
    $("#invForm input[name='costPerUnit']").val(i.costPerUnit);
    $("#invForm input[name='category']").val(i.category);
  });

  $("#invBody").on("click", ".adjust-btn", function () {
    var id = $(this).data("id");
    var delta = $(this).data("delta");
    $.ajax({
      url: "/api/inventory/" + id + "/adjust", method: "PATCH", contentType: "application/json",
      data: JSON.stringify({ adjustment: delta }),
      success: function () { loadInventory(); },
    });
  });

  $("#invBody").on("click", ".del-inv-btn", function () {
    if (!confirm("Delete this inventory item?")) return;
    var id = $(this).data("id");
    $.ajax({ url: "/api/inventory/" + id, method: "DELETE", success: function () { loadInventory(); showToast("Item deleted"); } });
  });

  $("#invSaveBtn").on("click", function () {
    var id = $("#invForm input[name='_id']").val();
    var payload = {
      itemName: $("#invForm input[name='itemName']").val(),
      quantity: $("#invForm input[name='quantity']").val(),
      unit: $("#invForm select[name='unit']").val(),
      thresholdLevel: $("#invForm input[name='thresholdLevel']").val(),
      costPerUnit: $("#invForm input[name='costPerUnit']").val() || 0,
      category: $("#invForm input[name='category']").val() || "General",
    };
    if (!payload.itemName) { showToast("Item name is required", "error"); return; }

    $.ajax({
      url: id ? "/api/inventory/" + id : "/api/inventory",
      method: id ? "PUT" : "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function () { closeModal(); loadInventory(); showToast(id ? "Item updated" : "Item added"); },
      error: function (xhr) { showToast((xhr.responseJSON && xhr.responseJSON.message) || "Could not save item", "error"); },
    });
  });

  loadInventory();
});
