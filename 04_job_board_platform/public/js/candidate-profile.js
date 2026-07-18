$(function () {
  $("#profileForm").on("submit", function (e) {
    e.preventDefault();
    var payload = {
      headline: $("input[name='headline']").val(),
      location: $("input[name='location']").val(),
      experienceYears: $("input[name='experienceYears']").val(),
      skills: $("input[name='skills']").val(),
    };
    $.ajax({
      url: "/api/candidate/profile", method: "PUT", contentType: "application/json", data: JSON.stringify(payload),
      success: function () { showToast("Profile updated"); },
      error: function (xhr) { showToast((xhr.responseJSON && xhr.responseJSON.message) || "Could not update profile", "error"); },
    });
  });
});
