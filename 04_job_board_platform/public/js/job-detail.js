$(function () {
  function openModal() { $("#applyModalOverlay").addClass("open"); loadResumes(); }
  function closeModal() { $("#applyModalOverlay").removeClass("open"); }

  $("#applyBtn").on("click", openModal);
  $("#applyModalClose, #applyModalOverlay").on("click", function (e) { if (e.target === this) closeModal(); });

  function loadResumes() {
    $("#applyLoggedOut").hide();
    $("#applyForm").show();
    $("#resumePickerWrap").html("Loading your resumes...");

    $.get("/api/resumes", function (res) {
      if (res.data.length === 0) {
        $("#resumePickerWrap").html('<p style="color:var(--danger); font-size:0.85rem;">No resume on file yet. <a href="/candidate/resume" style="color:var(--primary); font-weight:600;">Upload one first &rarr;</a></p>');
        $("#applyForm button[type=submit]").prop("disabled", true);
        return;
      }
      $("#applyForm button[type=submit]").prop("disabled", false);
      var html = "";
      res.data.forEach(function (r, idx) {
        html += '<label style="display:flex; align-items:center; gap:8px; padding:8px 0; font-size:0.86rem;">' +
          '<input type="radio" name="resumeId" value="' + r._id + '" ' + (r.isPrimary ? "checked" : "") + " />" +
          r.fileName + (r.isPrimary ? ' <span class="badge badge-hired" style="margin-left:6px;">Primary</span>' : "") +
        "</label>";
      });
      $("#resumePickerWrap").html(html);
    }).fail(function (xhr) {
      if (xhr.status === 401) {
        $("#applyLoggedOut").show();
        $("#applyForm").hide();
      } else {
        $("#resumePickerWrap").html('<p style="color:var(--danger);">Could not load resumes.</p>');
      }
    });
  }

  $("#applyForm").on("submit", function (e) {
    e.preventDefault();
    var resumeId = $("input[name='resumeId']:checked").val();
    var payload = { jobId: jobId, coverLetter: $("textarea[name='coverLetter']").val(), resumeId: resumeId };

    var $btn = $(this).find("button[type='submit']");
    $btn.prop("disabled", true).text("Submitting...");

    $.ajax({
      url: "/api/applications", method: "POST", contentType: "application/json", data: JSON.stringify(payload),
      success: function () {
        showToast("Application submitted!");
        closeModal();
        $btn.text("Submit Application");
        setTimeout(function () { window.location.href = "/candidate/applications"; }, 1200);
      },
      error: function (xhr) {
        showToast((xhr.responseJSON && xhr.responseJSON.message) || "Could not submit application", "error");
        $btn.prop("disabled", false).text("Submit Application");
      },
    });
  });
});
