$(function () {
  function badge(status) {
    return '<span class="badge badge-' + status + '">' + status + '</span>';
  }

  $.get("/api/reports/dashboard", function (res) {
    var d = res.data;
    $("#statSales").text("₹" + d.todaySales.toLocaleString());
    $("#statOrders").text(d.todayOrderCount);
    $("#statTables").text(d.occupiedTables + " / " + d.totalTables);
    $("#statLowStock").text(d.lowStockCount);
  });

  $.get("/api/orders", function (res) {
    var orders = res.data.slice(0, 8);
    if (orders.length === 0) {
      $("#recentOrdersBody").html('<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No orders yet.</td></tr>');
      return;
    }
    var html = "";
    orders.forEach(function (o) {
      html += "<tr>" +
        "<td><strong>" + o.orderNumber + "</strong></td>" +
        "<td>" + o.customerName + "</td>" +
        "<td style='text-transform:capitalize;'>" + o.orderType + "</td>" +
        "<td>₹" + o.totalAmount + "</td>" +
        "<td>" + badge(o.status) + "</td>" +
        "</tr>";
    });
    $("#recentOrdersBody").html(html);
  });

  $.get("/api/reports/stock-alerts", function (res) {
    if (res.data.length === 0) {
      $("#stockAlertsWrap").html('<div class="empty-state"><div class="ic">&#9989;</div>All stock levels look healthy.</div>');
      return;
    }
    var html = "";
    res.data.forEach(function (i) {
      html += '<div class="stock-row"><div>' +
        "<strong>" + i.itemName + "</strong><br/>" +
        '<span style="font-size:0.76rem; color:var(--text-muted);">' + i.quantity + " " + i.unit + " left (threshold " + i.thresholdLevel + ")</span>" +
        "</div><span class=\"badge badge-cancelled\">Low</span></div>";
    });
    $("#stockAlertsWrap").html(html);
  });
});
