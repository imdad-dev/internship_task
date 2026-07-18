function showToast(message, type) {
  type = type || "success";
  var $stack = $("#toastStack");
  if ($stack.length === 0) return;
  var $toast = $('<div class="toast toast-' + type + '">' + message + "</div>");
  $stack.append($toast);
  setTimeout(function () {
    $toast.fadeOut(250, function () { $(this).remove(); });
  }, 3200);
}
