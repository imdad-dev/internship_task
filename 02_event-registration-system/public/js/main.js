// Shared helpers used across all pages

function showAlert(message, type = "danger", target = "#alertBox") {
  const html = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  $(target).html(html);
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("eh_user"));
  } catch (e) {
    return null;
  }
}

function setStoredUser(user) {
  localStorage.setItem("eh_user", JSON.stringify(user));
}

function clearStoredUser() {
  localStorage.removeItem("eh_user");
}

// Build the nav links based on auth state (server also passes user via EJS,
// but we refresh client-side too so nav updates instantly after login/logout)
function renderNav() {
  const user = getStoredUser();
  const $nav = $("#navLinks");
  // Remove any previously injected dynamic items
  $nav.find(".dynamic-link").remove();

  if (user) {
    if (user.role === "organizer") {
      $nav.append(
        `<li class="nav-item dynamic-link"><a class="nav-link" href="/admin/events">Manage Events</a></li>`
      );
    }
    $nav.append(
      `<li class="nav-item dynamic-link"><a class="nav-link" href="/dashboard">My Dashboard</a></li>`
    );
    $nav.append(
      `<li class="nav-item dynamic-link"><a class="nav-link" href="#" id="logoutBtn">Logout (${user.name})</a></li>`
    );
  } else {
    $nav.append(`<li class="nav-item dynamic-link"><a class="nav-link" href="/login">Login</a></li>`);
    $nav.append(
      `<li class="nav-item dynamic-link"><a class="btn eh-btn-primary btn-sm ms-lg-2" href="/register">Sign Up</a></li>`
    );
  }
}

$(function () {
  $("#year").text(new Date().getFullYear());
  renderNav();

  $(document).on("click", "#logoutBtn", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/api/auth/logout",
      method: "POST",
      complete: function () {
        clearStoredUser();
        window.location.href = "/";
      },
    });
  });
});
