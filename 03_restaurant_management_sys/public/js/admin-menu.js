$(function () {
  function loadMenu() {
    $.get("/api/menu", function (res) {
      if (res.data.length === 0) {
        $("#menuTableBody").html('<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No dishes yet. Add your first one.</td></tr>');
        return;
      }
      var html = "";
      res.data.forEach(function (item) {
        html += "<tr>" +
          "<td><strong>" + item.name + "</strong><br/><span style='color:var(--text-muted); font-size:0.78rem;'>" + (item.description || "") + "</span></td>" +
          "<td>" + item.category + "</td>" +
          "<td>₹" + item.price + "</td>" +
          "<td>" + (item.isVeg ? "🟢 Veg" : "🔴 Non-Veg") + "</td>" +
          "<td>" + (item.isAvailable ? '<span class="badge badge-available">Available</span>' : '<span class="badge badge-cancelled">Hidden</span>') + "</td>" +
          "<td style='white-space:nowrap;'>" +
            '<button class="btn btn-outline btn-icon toggle-btn" data-id="' + item._id + '" title="Toggle availability">&#128065;</button> ' +
            '<button class="btn btn-outline btn-icon edit-btn" data-item=\'' + JSON.stringify(item).replace(/'/g, "&apos;") + '\' title="Edit">&#9998;</button> ' +
            '<button class="btn btn-danger btn-icon del-btn" data-id="' + item._id + '" title="Delete">&#128465;</button>' +
          "</td>" +
        "</tr>";
      });
      $("#menuTableBody").html(html);
    });
  }

  function openModal(title) {
    $("#menuModalTitle").text(title);
    $("#menuModalOverlay").addClass("open");
  }
  function closeModal() {
    $("#menuModalOverlay").removeClass("open");
    $("#menuForm")[0].reset();
    $("#menuForm input[name='_id']").val("");
  }

  $("#addMenuBtn").on("click", function () { openModal("Add Dish"); });
  $("#menuModalClose, #menuCancelBtn, #menuModalOverlay").on("click", function (e) {
    if (e.target === this) closeModal();
  });

  $("#menuTableBody").on("click", ".edit-btn", function () {
    var item = JSON.parse($(this).attr("data-item").replace(/&apos;/g, "'"));
    openModal("Edit Dish");
    $("#menuForm input[name='_id']").val(item._id);
    $("#menuForm input[name='name']").val(item.name);
    $("#menuForm textarea[name='description']").val(item.description);
    $("#menuForm input[name='price']").val(item.price);
    $("#menuForm select[name='category']").val(item.category);
    $("#menuForm input[name='isVeg']").prop("checked", item.isVeg);
    $("#menuForm input[name='isFeatured']").prop("checked", item.isFeatured);
    $("#menuForm input[name='isAvailable']").prop("checked", item.isAvailable);
  });

  $("#menuTableBody").on("click", ".toggle-btn", function () {
    var id = $(this).data("id");
    $.ajax({ url: "/api/menu/" + id + "/toggle", method: "PATCH", success: function () { loadMenu(); showToast("Availability updated"); } });
  });

  $("#menuTableBody").on("click", ".del-btn", function () {
    if (!confirm("Delete this dish permanently?")) return;
    var id = $(this).data("id");
    $.ajax({
      url: "/api/menu/" + id, method: "DELETE",
      success: function () { loadMenu(); showToast("Dish deleted"); },
    });
  });

  $("#menuSaveBtn").on("click", function () {
    var id = $("#menuForm input[name='_id']").val();
    var payload = {
      name: $("#menuForm input[name='name']").val(),
      description: $("#menuForm textarea[name='description']").val(),
      price: $("#menuForm input[name='price']").val(),
      category: $("#menuForm select[name='category']").val(),
      isVeg: $("#menuForm input[name='isVeg']").is(":checked"),
      isFeatured: $("#menuForm input[name='isFeatured']").is(":checked"),
      isAvailable: $("#menuForm input[name='isAvailable']").is(":checked"),
    };

    if (!payload.name || !payload.price) { showToast("Name and price are required", "error"); return; }

    $.ajax({
      url: id ? "/api/menu/" + id : "/api/menu",
      method: id ? "PUT" : "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function () {
        closeModal();
        loadMenu();
        showToast(id ? "Dish updated" : "Dish added");
      },
      error: function (xhr) {
        showToast((xhr.responseJSON && xhr.responseJSON.message) || "Could not save dish", "error");
      },
    });
  });

  loadMenu();
});
