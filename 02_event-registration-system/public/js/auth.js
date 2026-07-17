// Handles login & registration forms via AJAX

function loginUser(email, password) {
  $.ajax({
    url: "/api/auth/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email, password }),
    success: function (res) {
      setStoredUser(res.user);
      window.location.href = res.user.role === "organizer" ? "/admin/events" : "/dashboard";
    },
    error: function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : "Login failed";
      showAlert(msg, "danger", "#loginAlert");
    },
  });
}

function registerUser({ name, email, password, role }) {
  $.ajax({
    url: "/api/auth/register",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ name, email, password, role }),
    success: function (res) {
      setStoredUser(res.user);
      window.location.href = res.user.role === "organizer" ? "/admin/events" : "/dashboard";
    },
    error: function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : "Registration failed";
      showAlert(msg, "danger", "#registerAlert");
    },
  });
}
