$(function () {
  function badge(status) { return '<span class="badge badge-' + status + '">' + status + '</span>'; }

  function loadJobs() {
    $.get("/api/jobs/mine", function (res) {
      if (res.data.length === 0) {
        $("#jobsTableBody").html('<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No listings yet. Post your first job.</td></tr>');
        return;
      }
      var html = "";
      res.data.forEach(function (j) {
        html += "<tr>" +
          "<td><strong>" + j.title + "</strong></td>" +
          "<td>" + j.category + " &middot; " + j.jobType + "</td>" +
          "<td>" + j.location + "</td>" +
          "<td><a href='/employer/applicants?job=" + j._id + "' style='color:var(--primary); font-weight:600;'>" + j.applicantCount + " applicant" + (j.applicantCount === 1 ? "" : "s") + "</a></td>" +
          "<td>" + badge(j.status) + "</td>" +
          "<td style='white-space:nowrap;'>" +
            '<button class="btn btn-outline btn-icon toggle-job-btn" data-id="' + j._id + '" title="Toggle open/closed">&#128274;</button> ' +
            '<button class="btn btn-outline btn-icon edit-job-btn" data-item=\'' + JSON.stringify(j).replace(/'/g, "&apos;") + '\'>&#9998;</button> ' +
            '<button class="btn btn-danger btn-icon del-job-btn" data-id="' + j._id + '">&#128465;</button>' +
          "</td>" +
        "</tr>";
      });
      $("#jobsTableBody").html(html);
    });
  }

  function openModal(title) { $("#jobModalTitle").text(title); $("#jobModalOverlay").addClass("open"); }
  function closeModal() { $("#jobModalOverlay").removeClass("open"); $("#jobForm")[0].reset(); $("#jobForm input[name='_id']").val(""); }

  $("#addJobBtn").on("click", function () { openModal("Post a Job"); });
  $("#jobModalClose, #jobCancelBtn, #jobModalOverlay").on("click", function (e) { if (e.target === this) closeModal(); });

  $("#jobsTableBody").on("click", ".edit-job-btn", function () {
    var j = JSON.parse($(this).attr("data-item").replace(/&apos;/g, "'"));
    openModal("Edit Job");
    $("#jobForm input[name='_id']").val(j._id);
    $("#jobForm input[name='title']").val(j.title);
    $("#jobForm textarea[name='description']").val(j.description);
    $("#jobForm textarea[name='requirements']").val(j.requirements);
    $("#jobForm select[name='category']").val(j.category);
    $("#jobForm select[name='jobType']").val(j.jobType);
    $("#jobForm input[name='location']").val(j.location);
    $("#jobForm input[name='skillsRequired']").val((j.skillsRequired || []).join(", "));
    $("#jobForm input[name='salaryMin']").val(j.salaryMin);
    $("#jobForm input[name='salaryMax']").val(j.salaryMax);
  });

  $("#jobsTableBody").on("click", ".toggle-job-btn", function () {
    var id = $(this).data("id");
    $.ajax({ url: "/api/jobs/" + id + "/toggle-status", method: "PATCH", success: function () { loadJobs(); showToast("Job status updated"); } });
  });

  $("#jobsTableBody").on("click", ".del-job-btn", function () {
    if (!confirm("Delete this job listing? All applications for it will be removed too.")) return;
    var id = $(this).data("id");
    $.ajax({ url: "/api/jobs/" + id, method: "DELETE", success: function () { loadJobs(); showToast("Job deleted"); } });
  });

  $("#jobSaveBtn").on("click", function () {
    var id = $("#jobForm input[name='_id']").val();
    var payload = {
      title: $("#jobForm input[name='title']").val(),
      description: $("#jobForm textarea[name='description']").val(),
      requirements: $("#jobForm textarea[name='requirements']").val(),
      category: $("#jobForm select[name='category']").val(),
      jobType: $("#jobForm select[name='jobType']").val(),
      location: $("#jobForm input[name='location']").val() || "Remote",
      skillsRequired: $("#jobForm input[name='skillsRequired']").val(),
      salaryMin: $("#jobForm input[name='salaryMin']").val() || 0,
      salaryMax: $("#jobForm input[name='salaryMax']").val() || 0,
    };
    if (!payload.title || !payload.description) { showToast("Title and description are required", "error"); return; }

    $.ajax({
      url: id ? "/api/jobs/" + id : "/api/jobs",
      method: id ? "PUT" : "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function () { closeModal(); loadJobs(); showToast(id ? "Job updated" : "Job posted"); },
      error: function (xhr) { showToast((xhr.responseJSON && xhr.responseJSON.message) || "Could not save job", "error"); },
    });
  });

  loadJobs();
});
