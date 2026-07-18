$(function () {
  var statuses = ["applied", "shortlisted", "interview", "rejected", "hired"];

  function statusSelect(app) {
    var opts = statuses.map(function (s) {
      return '<option value="' + s + '"' + (s === app.status ? " selected" : "") + ">" + s + "</option>";
    }).join("");
    return '<select class="form-control app-status-select" data-id="' + app._id + '" style="padding:7px 10px; font-size:0.82rem; width:auto;">' + opts + "</select>";
  }

  function loadJobOptions(preselect) {
    $.get("/api/jobs/mine", function (res) {
      var html = '<option value="">Select a job listing...</option>';
      res.data.forEach(function (j) {
        html += '<option value="' + j._id + '"' + (preselect === j._id ? " selected" : "") + ">" + j.title + " (" + j.applicantCount + ")</option>";
      });
      $("#jobSelect").html(html);
      if (preselect) loadApplicants(preselect);
    });
  }

  function loadApplicants(jobId) {
    if (!jobId) {
      $("#applicantsWrap").html('<div class="empty-state">Choose a job above to view its applicants.</div>');
      return;
    }
    $("#applicantsWrap").html('<div class="empty-state">Loading applicants...</div>');

    $.get("/api/applications/job/" + jobId, function (res) {
      if (res.data.length === 0) {
        $("#applicantsWrap").html('<div class="empty-state"><div class="ic">&#128100;</div>No applicants yet for this role.</div>');
        return;
      }
      var html = "";
      res.data.forEach(function (a) {
        var c = a.candidate;
        html += '<div class="applicant-card">' +
          "<div style='flex:1; min-width:220px;'>" +
            "<strong>" + c.name + "</strong> &middot; <span style='color:var(--text-muted); font-size:0.85rem;'>" + c.headline + "</span><br/>" +
            "<span style='font-size:0.8rem; color:var(--text-muted);'>" + c.email + " &middot; " + (c.location || "-") + " &middot; " + c.experienceYears + " yrs exp</span><br/>" +
            (c.skills || []).map(function (s) { return '<span class="skill-chip">' + s + "</span>"; }).join("") +
            (a.coverLetter ? "<p style='font-size:0.85rem; color:var(--text-muted); margin-top:8px;'>" + a.coverLetter + "</p>" : "") +
          "</div>" +
          "<div style='display:flex; flex-direction:column; align-items:flex-end; gap:10px;'>" +
            "<a href='" + a.resume.filePath + "' target='_blank' class='btn btn-outline btn-sm'>View Resume</a>" +
            statusSelect(a) +
          "</div>" +
        "</div>";
      });
      $("#applicantsWrap").html(html);
    });
  }

  $("#jobSelect").on("change", function () { loadApplicants($(this).val()); });

  $("#applicantsWrap").on("change", ".app-status-select", function () {
    var id = $(this).data("id");
    $.ajax({
      url: "/api/applications/" + id + "/status", method: "PATCH", contentType: "application/json",
      data: JSON.stringify({ status: $(this).val() }),
      success: function () { showToast("Applicant status updated"); },
      error: function () { showToast("Could not update status", "error"); },
    });
  });

  var params = new URLSearchParams(window.location.search);
  loadJobOptions(params.get("job"));
});
