// Handles event listing, details, and organizer event management via AJAX

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function eventCardHtml(ev) {
  const seatsBadge =
    ev.seatsLeft <= 0
      ? `<span class="badge bg-danger badge-seats">Fully Booked</span>`
      : `<span class="badge bg-success badge-seats">${ev.seatsLeft} seats left</span>`;

  return `
    <div class="col-md-4">
      <div class="card event-card p-3">
        <span class="badge bg-primary-subtle text-primary mb-2 align-self-start">${ev.category}</span>
        <h5>${ev.title}</h5>
        <p class="text-muted small mb-1">📅 ${formatDate(ev.date)} · ${ev.time}</p>
        <p class="text-muted small mb-2">📍 ${ev.location}</p>
        <p class="mb-3">${ev.description.substring(0, 90)}${ev.description.length > 90 ? "..." : ""}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          ${seatsBadge}
          <a href="/events/${ev._id}" class="btn btn-sm eh-btn-primary">View Details</a>
        </div>
      </div>
    </div>`;
}

function loadEvents(target, params = {}) {
  $.ajax({
    url: "/api/events",
    method: "GET",
    data: params,
    success: function (res) {
      let events = res.events;
      if (params.limit) events = events.slice(0, params.limit);
      if (!events.length) {
        $(target).html(`<div class="col-12 text-center text-muted py-5">No events found.</div>`);
        return;
      }
      $(target).html(events.map(eventCardHtml).join(""));
    },
    error: function () {
      $(target).html(`<div class="col-12 text-center text-danger py-5">Failed to load events.</div>`);
    },
  });
}

function loadEventDetails(eventId) {
  $.ajax({
    url: `/api/events/${eventId}`,
    method: "GET",
    success: function (res) {
      const ev = res.event;
      const user = getStoredUser();
      const full = ev.seatsLeft <= 0;

      let actionHtml = "";
      if (!user) {
        actionHtml = `<a href="/login" class="btn eh-btn-primary">Login to Register</a>`;
      } else if (full) {
        actionHtml = `<button class="btn btn-secondary" disabled>Fully Booked</button>`;
      } else {
        actionHtml = `<button class="btn eh-btn-primary" data-bs-toggle="modal" data-bs-target="#registerModal">Register Now</button>`;
      }

      $("#eventDetailsBox").html(`
        <span class="badge bg-primary-subtle text-primary mb-2">${ev.category}</span>
        <h2>${ev.title}</h2>
        <p class="text-muted">📅 ${formatDate(ev.date)} · ${ev.time} &nbsp; | &nbsp; 📍 ${ev.location}</p>
        <p class="mb-4">${ev.description}</p>
        <p><strong>Organizer:</strong> ${ev.organizer ? ev.organizer.name : "N/A"}</p>
        <p><strong>Seats:</strong> ${ev.registeredCount}/${ev.capacity} registered</p>
        ${actionHtml}
      `);
    },
    error: function () {
      $("#eventDetailsBox").html(`<div class="text-center text-danger py-5">Event not found.</div>`);
    },
  });
}

// ---------- Organizer: Manage Events ----------

function loadMyEvents() {
  $.ajax({
    url: "/api/events/organizer/mine",
    method: "GET",
    success: function (res) {
      if (!res.events.length) {
        $("#myEventsTableBody").html(
          `<tr><td colspan="5" class="text-center text-muted py-4">You haven't created any events yet.</td></tr>`
        );
        return;
      }
      const rows = res.events
        .map(
          (ev) => `
        <tr>
          <td>${ev.title}</td>
          <td>${formatDate(ev.date)}</td>
          <td>${ev.location}</td>
          <td>${ev.registeredCount}/${ev.capacity}</td>
          <td>
            <a href="/admin/events/${ev._id}/registrations" class="btn btn-sm btn-outline-secondary">Registrations</a>
            <a href="/admin/events/${ev._id}/edit" class="btn btn-sm btn-outline-primary">Edit</a>
            <button class="btn btn-sm btn-outline-danger delete-event-btn" data-id="${ev._id}">Delete</button>
          </td>
        </tr>`
        )
        .join("");
      $("#myEventsTableBody").html(rows);
    },
    error: function () {
      $("#myEventsTableBody").html(
        `<tr><td colspan="5" class="text-center text-danger py-4">Failed to load events.</td></tr>`
      );
    },
  });
}

$(document).on("click", ".delete-event-btn", function () {
  const id = $(this).data("id");
  if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
  $.ajax({
    url: `/api/events/${id}`,
    method: "DELETE",
    success: function () {
      loadMyEvents();
    },
    error: function (xhr) {
      alert(xhr.responseJSON ? xhr.responseJSON.message : "Failed to delete event");
    },
  });
});

// ---------- Organizer: Create / Edit Event Form ----------

function initEventForm() {
  const editId = $("#editEventId").val();

  if (editId) {
    $.ajax({
      url: `/api/events/${editId}`,
      method: "GET",
      success: function (res) {
        const ev = res.event;
        $("#evTitle").val(ev.title);
        $("#evDescription").val(ev.description);
        $("#evCategory").val(ev.category);
        $("#evCapacity").val(ev.capacity);
        $("#evDate").val(new Date(ev.date).toISOString().split("T")[0]);
        $("#evTime").val(ev.time);
        $("#evLocation").val(ev.location);
      },
    });
  }

  $("#eventForm").on("submit", function (e) {
    e.preventDefault();
    const payload = {
      title: $("#evTitle").val(),
      description: $("#evDescription").val(),
      category: $("#evCategory").val(),
      capacity: $("#evCapacity").val(),
      date: $("#evDate").val(),
      time: $("#evTime").val(),
      location: $("#evLocation").val(),
    };

    const url = editId ? `/api/events/${editId}` : "/api/events";
    const method = editId ? "PUT" : "POST";

    $.ajax({
      url,
      method,
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function () {
        window.location.href = "/admin/events";
      },
      error: function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : "Failed to save event";
        showAlert(msg, "danger", "#eventFormAlert");
      },
    });
  });
}
