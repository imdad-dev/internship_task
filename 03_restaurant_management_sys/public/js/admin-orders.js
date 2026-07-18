$(function () {
  var statuses = ["pending", "preparing", "ready", "served", "completed", "cancelled"];

  function statusSelect(order) {
    var opts = statuses.map(function (s) {
      return '<option value="' + s + '"' + (s === order.status ? " selected" : "") + ">" + s + "</option>";
    }).join("");
    return '<select class="form-control status-select" data-id="' + order._id + '" style="padding:6px 10px; font-size:0.78rem;">' + opts + "</select>";
  }

  function paymentToggle(order) {
    var isPaid = order.paymentStatus === "paid";
    return '<span class="badge badge-' + (isPaid ? "paid" : "unpaid") + ' payment-toggle" data-id="' + order._id + '" data-current="' + order.paymentStatus + '" style="cursor:pointer;">' + order.paymentStatus + "</span>";
  }

  function loadOrders() {
    var status = $("#statusFilter").val();
    $.get("/api/orders" + (status ? "?status=" + status : ""), function (res) {
      if (res.data.length === 0) {
        $("#ordersTableBody").html('<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No orders found.</td></tr>');
        return;
      }
      var html = "";
      res.data.forEach(function (o) {
        var itemsSummary = o.items.map(function (i) { return i.quantity + "× " + i.name; }).join(", ");
        html += "<tr>" +
          "<td><strong>" + o.orderNumber + "</strong><br/><span style='font-size:0.72rem;color:var(--text-muted);'>" + new Date(o.createdAt).toLocaleString() + "</span></td>" +
          "<td>" + o.customerName + "<br/><span style='font-size:0.76rem;color:var(--text-muted);'>" + (o.phone || "") + "</span></td>" +
          "<td style='text-transform:capitalize;'>" + o.orderType + (o.table ? " · T" + o.table.tableNumber : "") + "</td>" +
          "<td style='max-width:220px; font-size:0.8rem; color:var(--text-muted);'>" + itemsSummary + "</td>" +
          "<td><strong>₹" + o.totalAmount + "</strong></td>" +
          "<td>" + paymentToggle(o) + "</td>" +
          "<td>" + statusSelect(o) + "</td>" +
          '<td><button class="btn btn-danger btn-icon del-order-btn" data-id="' + o._id + '" title="Delete">&#128465;</button></td>' +
        "</tr>";
      });
      $("#ordersTableBody").html(html);
    });
  }

  $("#statusFilter").on("change", loadOrders);

  $("#ordersTableBody").on("change", ".status-select", function () {
    var id = $(this).data("id");
    var status = $(this).val();
    $.ajax({
      url: "/api/orders/" + id + "/status", method: "PATCH", contentType: "application/json",
      data: JSON.stringify({ status: status }),
      success: function () { showToast("Order status updated"); loadOrders(); },
      error: function () { showToast("Could not update order", "error"); },
    });
  });

  $("#ordersTableBody").on("click", ".payment-toggle", function () {
    var id = $(this).data("id");
    var current = $(this).data("current");
    var next = current === "paid" ? "unpaid" : "paid";
    $.ajax({
      url: "/api/orders/" + id + "/payment", method: "PATCH", contentType: "application/json",
      data: JSON.stringify({ paymentStatus: next }),
      success: function () { loadOrders(); },
    });
  });

  $("#ordersTableBody").on("click", ".del-order-btn", function () {
    if (!confirm("Delete this order record?")) return;
    var id = $(this).data("id");
    $.ajax({ url: "/api/orders/" + id, method: "DELETE", success: function () { loadOrders(); showToast("Order deleted"); } });
  });

  loadOrders();
  setInterval(loadOrders, 15000); // light polling so the board stays current
});
