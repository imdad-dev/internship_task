$(function () {
  function badge(status) { return '<span class="badge badge-' + status + '">' + status + '</span>'; }

  function loadApps() {
    var status = $("#statusFilter").val();
    $.get("/api/applications/mine", function (res) {
      var apps = res.data;
      if (status) apps = apps.filter(function (a) { return a.status === status; });

      if (apps.length === 0) {
        $("#appsBody").html('<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No applications found. <a href="/jobs" style="color:var(--primary);">Browse jobs &rarr;</a></td></tr>');
        return;
      }
      var html = "";
      apps.forEach(function (a) {
        html += "<tr>" +
          "<td><strong>" + (a.job ? "<a href='/jobs/" + a.job._id + "' style='color:var(--text);'>" + a.job.title + "</a>" : "Job removed") + "</strong></td>" +
          "<td>" + (a.job && a.job.employer ? a.job.employer.companyName : "-") + "</td>" +
          "<td>" + (a.job ? a.job.jobType : "-") + "</td>" +
          "<td>" + new Date(a.createdAt).toLocaleDateString() + "</td>" +
          "<td>" + badge(a.status) + "</td>" +
        "</tr>";
      });
      $("#appsBody").html(html);
    });
  }

  $("#statusFilter").on("change", loadApps);
  loadApps();
});
