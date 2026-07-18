$(function () {
  function badge(status) { return '<span class="badge badge-' + status + '">' + status + '</span>'; }

  $.get("/api/applications/mine", function (res) {
    var apps = res.data;
    $("#statTotal").text(apps.length);
    $("#statShortlisted").text(apps.filter(function (a) { return a.status === "shortlisted"; }).length);
    $("#statInterview").text(apps.filter(function (a) { return a.status === "interview"; }).length);
    $("#statHired").text(apps.filter(function (a) { return a.status === "hired"; }).length);

    var recent = apps.slice(0, 6);
    if (recent.length === 0) {
      $("#recentAppsBody").html('<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No applications yet. <a href="/jobs" style="color:var(--primary);">Browse jobs &rarr;</a></td></tr>');
      return;
    }
    var html = "";
    recent.forEach(function (a) {
      html += "<tr>" +
        "<td><strong>" + (a.job ? a.job.title : "Job removed") + "</strong></td>" +
        "<td>" + (a.job && a.job.employer ? a.job.employer.companyName : "-") + "</td>" +
        "<td>" + new Date(a.createdAt).toLocaleDateString() + "</td>" +
        "<td>" + badge(a.status) + "</td>" +
      "</tr>";
    });
    $("#recentAppsBody").html(html);
  });
});
