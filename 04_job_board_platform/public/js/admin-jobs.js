$(function () {
  function badge(status) { return '<span class="badge badge-' + status + '">' + status + '</span>'; }

  $.get("/api/admin/jobs", function (res) {
    if (res.data.length === 0) {
      $("#adminJobsBody").html('<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No jobs posted yet.</td></tr>');
      return;
    }
    var html = "";
    res.data.forEach(function (j) {
      html += "<tr>" +
        "<td><strong>" + j.title + "</strong></td>" +
        "<td>" + (j.employer ? j.employer.companyName : "-") + "</td>" +
        "<td>" + j.category + " &middot; " + j.jobType + "</td>" +
        "<td>" + j.location + "</td>" +
        "<td>" + badge(j.status) + "</td>" +
        "<td>" + new Date(j.createdAt).toLocaleDateString() + "</td>" +
      "</tr>";
    });
    $("#adminJobsBody").html(html);
  });
});
