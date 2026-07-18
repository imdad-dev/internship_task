$(function () {
  function timeAgo(dateStr) {
    var diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    return Math.floor(diff / 86400) + "d ago";
  }

  function loadNotifications() {
    $.get("/api/notifications", function (res) {
      if (res.unreadCount > 0) {
        $("#notifDot").text(res.unreadCount).show();
      } else {
        $("#notifDot").hide();
      }
      if (res.data.length === 0) {
        $("#notifDropdown").html('<div class="notif-empty">No notifications yet.</div>');
        return;
      }
      var html = "";
      res.data.forEach(function (n) {
        html += '<div class="notif-item ' + (n.isRead ? "" : "unread") + '">' +
          "<div>" + n.message + "</div>" +
          '<div style="color:var(--text-muted); font-size:0.72rem; margin-top:4px;">' + timeAgo(n.createdAt) + "</div>" +
        "</div>";
      });
      $("#notifDropdown").html(html);
    });
  }

  $("#notifBtn").on("click", function (e) {
    e.stopPropagation();
    $("#notifDropdown").toggleClass("open");
    if ($("#notifDropdown").hasClass("open")) {
      $.ajax({ url: "/api/notifications/mark-read", method: "PATCH", success: loadNotifications });
    }
  });
  $(document).on("click", function () { $("#notifDropdown").removeClass("open"); });
  $("#notifDropdown").on("click", function (e) { e.stopPropagation(); });

  loadNotifications();
  setInterval(loadNotifications, 20000);
});
