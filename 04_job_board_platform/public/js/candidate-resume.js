$(function () {
  function loadResumes() {
    $.get("/api/resumes", function (res) {
      if (res.data.length === 0) {
        $("#resumeList").html('<div class="empty-state"><div class="ic">&#128196;</div>No resume uploaded yet.</div>');
        return;
      }
      var html = "";
      res.data.forEach(function (r) {
        html += '<div class="applicant-card">' +
          "<div><strong>" + r.fileName + "</strong> " + (r.isPrimary ? '<span class="badge badge-hired">Primary</span>' : "") +
          '<br/><span style="font-size:0.78rem; color:var(--text-muted);">' + (r.fileSize / 1024).toFixed(0) + " KB &middot; uploaded " + new Date(r.createdAt).toLocaleDateString() + "</span></div>" +
          '<div style="display:flex; gap:8px;">' +
            '<a href="' + r.filePath + '" target="_blank" class="btn btn-outline btn-sm">View</a>' +
            '<button class="btn btn-danger btn-sm del-resume-btn" data-id="' + r._id + '">Delete</button>' +
          "</div>" +
        "</div>";
      });
      $("#resumeList").html(html);
    });
  }

  $("#resumeUploadForm").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var $btn = $(this).find("button[type='submit']");
    $btn.prop("disabled", true).text("Uploading...");

    $.ajax({
      url: "/api/resumes", method: "POST", data: formData, processData: false, contentType: false,
      success: function () {
        showToast("Resume uploaded");
        $("#resumeUploadForm")[0].reset();
        loadResumes();
        $btn.prop("disabled", false).text("Upload");
      },
      error: function (xhr) {
        showToast((xhr.responseJSON && xhr.responseJSON.message) || "Upload failed", "error");
        $btn.prop("disabled", false).text("Upload");
      },
    });
  });

  $("#resumeList").on("click", ".del-resume-btn", function () {
    if (!confirm("Delete this resume?")) return;
    var id = $(this).data("id");
    $.ajax({ url: "/api/resumes/" + id, method: "DELETE", success: function () { loadResumes(); showToast("Resume removed"); } });
  });

  loadResumes();
});
