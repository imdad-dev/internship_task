$(function () {
  function badge(status) { return '<span class="badge badge-' + status + '">' + status + '</span>'; }

  $.get("/api/jobs/stats", function (res) {
    $("#statJobs").text(res.data.activeListings);
    $("#statApplicants").text(res.data.totalApplicants);
    $("#statInterview").text(res.data.interview);
    $("#statHired").text(res.data.hired);
  });

  $.get("/api/jobs/mine", function (res) {
    var jobs = res.data.slice(0, 6);
    if (jobs.length === 0) {
      $("#jobsBody").html('<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No listings yet. <a href="/employer/jobs" style="color:var(--primary);">Post your first job &rarr;</a></td></tr>');
      return;
    }
    var html = "";
    jobs.forEach(function (j) {
      html += "<tr>" +
        "<td><strong>" + j.title + "</strong></td>" +
        "<td>" + j.jobType + "</td>" +
        "<td>" + j.applicantCount + "</td>" +
        "<td>" + badge(j.status) + "</td>" +
      "</tr>";
    });
    $("#jobsBody").html(html);
  });
});
