$(function () {
  $.get("/api/admin/stats", function (res) {
    var d = res.data;
    $("#statOpenJobs").text(d.openJobs + " / " + d.totalJobs);
    $("#statApplications").text(d.totalApplications);
    $("#statCandidates").text(d.totalCandidates);
    $("#statEmployers").text(d.totalEmployers);

    var statuses = ["applied", "shortlisted", "interview", "hired", "rejected"];
    var max = Math.max.apply(null, statuses.map(function (s) { return d.statusBreakdown[s] || 0; })) || 1;
    var html = "";
    statuses.forEach(function (s) {
      var count = d.statusBreakdown[s] || 0;
      var pct = Math.round((count / max) * 100);
      html += '<div style="margin-bottom:14px;">' +
        '<div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;"><span style="text-transform:capitalize;">' + s + '</span><strong>' + count + '</strong></div>' +
        '<div style="height:8px; border-radius:999px; background:var(--surface-2); overflow:hidden;"><div style="height:100%; width:' + pct + '%; background:var(--primary); border-radius:999px;"></div></div>' +
      "</div>";
    });
    $("#statusBreakdown").html(html);
  });

  $.get("/api/admin/top-jobs", function (res) {
    if (res.data.length === 0) {
      $("#topJobsWrap").html('<div class="empty-state">No applications yet.</div>');
      return;
    }
    var html = "";
    res.data.forEach(function (j) {
      html += '<div class="stock-row" style="display:flex; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--border);"><span>' + j.title + '</span><strong>' + j.applicantCount + '</strong></div>';
    });
    $("#topJobsWrap").html(html);
  });
});
