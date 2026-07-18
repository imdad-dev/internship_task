$(function () {
  $.get("/api/reports/daily-sales?days=7", function (res) {
    var data = res.data;
    var max = Math.max.apply(null, data.map(function (d) { return d.totalSales; })) || 1;
    var html = "";
    data.forEach(function (d) {
      var pct = Math.round((d.totalSales / max) * 100);
      var dayLabel = new Date(d.date).toLocaleDateString(undefined, { weekday: "short" });
      html += '<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; height:100%; justify-content:flex-end;">' +
        '<div style="font-size:0.72rem; color:var(--accent-light); font-weight:700;">₹' + d.totalSales + '</div>' +
        '<div style="width:100%; max-width:44px; height:' + Math.max(pct, 3) + '%; background:linear-gradient(180deg, var(--accent-light), var(--accent)); border-radius:8px 8px 0 0;"></div>' +
        '<div style="font-size:0.72rem; color:var(--text-muted);">' + dayLabel + '</div>' +
      '</div>';
    });
    $("#salesChart").html(html);
  });

  $.get("/api/reports/top-selling", function (res) {
    if (res.data.length === 0) {
      $("#topSellingBody").html('<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">No sales yet.</td></tr>');
      return;
    }
    var html = "";
    res.data.forEach(function (item) {
      html += "<tr><td><strong>" + item.name + "</strong></td><td>" + item.quantitySold + "</td><td>₹" + item.revenue + "</td></tr>";
    });
    $("#topSellingBody").html(html);
  });

  $.get("/api/reports/stock-alerts", function (res) {
    if (res.data.length === 0) {
      $("#reportStockAlerts").html('<div class="empty-state"><div class="ic">&#9989;</div>All stock levels look healthy.</div>');
      return;
    }
    var html = "";
    res.data.forEach(function (i) {
      html += '<div class="stock-row"><div><strong>' + i.itemName + '</strong><br/><span style="font-size:0.76rem; color:var(--text-muted);">' +
        i.quantity + " " + i.unit + " left</span></div><span class=\"badge badge-cancelled\">Restock</span></div>";
    });
    $("#reportStockAlerts").html(html);
  });
});
