// Handles registration submission, my-registrations list, cancellation, organizer view

function submitRegistration(payload) {
  $.ajax({
    url: "/api/registrations",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: function () {
      $("#registerModal").modal("hide");
      showAlert("Registration successful! Redirecting to your dashboard...", "success");
      setTimeout(() => (window.location.href = "/dashboard"), 1200);
    },
    error: function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : "Registration failed";
      showAlert(msg, "danger", "#regFormAlert");
    },
  });
}

function loadMyRegistrations() {
  $.ajax({
    url: "/api/registrations/my",
    method: "GET",
    success: function (res) {
      const active = res.registrations.filter((r) => r.status === "confirmed");
      if (!active.length) {
        $("#myRegistrationsList").html(
          `<div class="col-12 text-center text-muted py-5">You have no active registrations. <a href="/events">Browse events</a> to get started.</div>`
        );
        return;
      }

      const html = active
        .map((r) => {
          const ev = r.event;
          if (!ev) return "";
          return `
          <div class="col-md-6">
            <div class="card event-card p-3">
              <h5>${ev.title}</h5>
              <p class="text-muted small mb-1">📅 ${new Date(ev.date).toLocaleDateString()} · ${ev.time}</p>
              <p class="text-muted small mb-2">📍 ${ev.location}</p>
              <p class="mb-2"><strong>Registered as:</strong> ${r.fullName} (${r.email})</p>
              <div class="d-flex justify-content-between">
                <a href="/events/${ev._id}" class="btn btn-sm btn-outline-primary">View Event</a>
                <button class="btn btn-sm btn-outline-danger cancel-reg-btn" data-id="${r._id}">Cancel Registration</button>
              </div>
            </div>
          </div>`;
        })
        .join("");
      $("#myRegistrationsList").html(html);
    },
    error: function () {
      $("#myRegistrationsList").html(
        `<div class="col-12 text-center text-danger py-5">Failed to load your registrations.</div>`
      );
    },
  });
}

$(document).on("click", ".cancel-reg-btn", function () {
  const id = $(this).data("id");
  if (!confirm("Cancel this registration?")) return;
  $.ajax({
    url: `/api/registrations/${id}`,
    method: "DELETE",
    success: function () {
      loadMyRegistrations();
    },
    error: function (xhr) {
      alert(xhr.responseJSON ? xhr.responseJSON.message : "Failed to cancel registration");
    },
  });
});

function loadEventRegistrations(eventId) {
  $.ajax({
    url: `/api/registrations/event/${eventId}`,
    method: "GET",
    success: function (res) {
      if (!res.registrations.length) {
        $("#eventRegistrationsBody").html(
          `<tr><td colspan="5" class="text-center text-muted py-4">No registrations yet.</td></tr>`
        );
        return;
      }
      const rows = res.registrations
        .map(
          (r) => `
        <tr>
          <td>${r.fullName}</td>
          <td>${r.email}</td>
          <td>${r.phone}</td>
          <td>${r.notes || "-"}</td>
          <td>${new Date(r.createdAt).toLocaleString()}</td>
        </tr>`
        )
        .join("");
      $("#eventRegistrationsBody").html(rows);
    },
    error: function () {
      $("#eventRegistrationsBody").html(
        `<tr><td colspan="5" class="text-center text-danger py-4">Failed to load registrations.</td></tr>`
      );
    },
  });
}
