$(function () {
  function paramsFromUrl() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) $("input[name='q']").val(params.get("q"));
    if (params.get("category")) $("select[name='category']").val(params.get("category"));
    if (params.get("jobType")) $("select[name='jobType']").val(params.get("jobType"));
    if (params.get("location")) $("input[name='location']").val(params.get("location"));
    return params;
  }

  function loadJobs() {
    var query = {
      q: $("input[name='q']").val(),
      category: $("select[name='category']").val(),
      jobType: $("select[name='jobType']").val(),
      location: $("input[name='location']").val(),
    };
    var qs = Object.keys(query).filter(function (k) { return query[k]; }).map(function (k) { return k + "=" + encodeURIComponent(query[k]); }).join("&");

    $("#jobGrid").html('<div class="empty-state">Searching...</div>');

    $.get("/api/jobs" + (qs ? "?" + qs : ""), function (res) {
      $("#jobResultsMeta").text(res.count + " role" + (res.count === 1 ? "" : "s") + " found");
      if (res.data.length === 0) {
        $("#jobGrid").html('<div class="empty-state"><div class="ic">&#128269;</div>No jobs match your search. Try different filters.</div>');
        return;
      }
      var html = "";
      res.data.forEach(function (job) {
        var salary = job.salaryMax ? "₹" + job.salaryMin.toLocaleString() + " - ₹" + job.salaryMax.toLocaleString() : "Not disclosed";
        html += '<a href="/jobs/' + job._id + '" class="job-card">' +
          '<div class="job-card-top">' +
            '<div class="job-logo">' + (job.employer.logoLetter || job.employer.companyName.charAt(0)) + "</div>" +
            "<div><h3>" + job.title + "</h3><div class='job-company'>" + job.employer.companyName + "</div></div>" +
          "</div>" +
          '<div class="job-meta">' +
            '<span class="job-tag type">' + job.jobType + "</span>" +
            '<span class="job-tag">' + job.location + "</span>" +
            '<span class="job-tag">' + job.category + "</span>" +
          "</div>" +
          '<div class="job-card-foot"><div class="job-salary">' + salary + '</div><span style="font-size:0.8rem; color:var(--primary); font-weight:600;">View &rarr;</span></div>' +
        "</a>";
      });
      $("#jobGrid").html(html);
    });
  }

  $("#filterForm").on("submit", function (e) {
    e.preventDefault();
    loadJobs();
  });

  paramsFromUrl();
  loadJobs();
});
