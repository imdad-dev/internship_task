$(function () {
  var cart = JSON.parse(localStorage.getItem("savora_cart") || "[]");
  var selectedTableId = null;

  function saveCart() {
    localStorage.setItem("savora_cart", JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    var count = cart.reduce(function (sum, i) { return sum + i.quantity; }, 0);
    $("#cartCount").text(count);

    if (cart.length === 0) {
      $("#cartItemsWrap").html('<div class="empty-cart">Your cart is empty. Add a dish to get started.</div>');
      $("#drawerFoot").hide();
      return;
    }

    var html = "";
    var total = 0;
    cart.forEach(function (item, idx) {
      var lineTotal = item.price * item.quantity;
      total += lineTotal;
      html += '<div class="cart-item">' +
        '<div>' +
          '<div class="ci-name">' + item.name + '</div>' +
          '<div class="ci-price">₹' + item.price + ' × ' + item.quantity + ' = ₹' + lineTotal + '</div>' +
        '</div>' +
        '<div style="display:flex; align-items:center; gap:8px;">' +
          '<div class="qty-control">' +
            '<button class="dec-cart" data-idx="' + idx + '">−</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button class="inc-cart" data-idx="' + idx + '">+</button>' +
          '</div>' +
          '<button class="remove-item" data-idx="' + idx + '">Remove</button>' +
        '</div>' +
      '</div>';
    });
    $("#cartItemsWrap").html(html);
    $("#cartTotal").text("₹" + total);
    $("#drawerFoot").show();
  }

  // ---------- Category filter ----------
  $("#menuTabs").on("click", ".menu-tab", function () {
    $(".menu-tab").removeClass("active");
    $(this).addClass("active");
    var cat = $(this).data("cat");
    if (cat === "all") {
      $("#dishGrid .dish-card").show();
    } else {
      $("#dishGrid .dish-card").hide();
      $("#dishGrid .dish-card[data-category='" + cat + "']").show();
    }
  });

  // ---------- Add to cart ----------
  $("#dishGrid").on("click", ".add-btn", function () {
    var id = $(this).data("id");
    var name = $(this).data("name");
    var price = parseFloat($(this).data("price"));

    var existing = cart.find(function (i) { return i.menuItemId === id; });
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ menuItemId: id, name: name, price: price, quantity: 1 });
    }
    saveCart();
    showToast(name + " added to cart");
  });

  // ---------- Cart quantity controls ----------
  $("#cartItemsWrap").on("click", ".inc-cart", function () {
    var idx = $(this).data("idx");
    cart[idx].quantity += 1;
    saveCart();
  });
  $("#cartItemsWrap").on("click", ".dec-cart", function () {
    var idx = $(this).data("idx");
    cart[idx].quantity -= 1;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    saveCart();
  });
  $("#cartItemsWrap").on("click", ".remove-item", function () {
    var idx = $(this).data("idx");
    cart.splice(idx, 1);
    saveCart();
  });

  // ---------- Drawer open/close ----------
  function openDrawer() { $("#cartDrawer, #drawerOverlay").addClass("open"); }
  function closeDrawer() { $("#cartDrawer, #drawerOverlay").removeClass("open"); }
  $("#cartFab").on("click", openDrawer);
  $("#drawerClose, #drawerOverlay").on("click", closeDrawer);

  function openCheckout() {
    closeDrawer();
    $("#checkoutDrawer, #checkoutOverlay").addClass("open");
    loadTables();
  }
  function closeCheckout() { $("#checkoutDrawer, #checkoutOverlay").removeClass("open"); }
  $("#checkoutBtn").on("click", function () {
    if (cart.length === 0) { showToast("Your cart is empty", "error"); return; }
    openCheckout();
  });
  $("#checkoutClose, #checkoutOverlay").on("click", closeCheckout);

  // ---------- Order type toggle ----------
  $("#orderTypeSelect").on("change", function () {
    if ($(this).val() === "dine-in") {
      $("#tableGroup").show();
    } else {
      $("#tableGroup").hide();
      selectedTableId = null;
    }
  });

  function loadTables() {
    $.get("/api/tables/available", function (res) {
      if (!res.success || res.data.length === 0) {
        $("#tablePickerWrap").html('<div style="color:var(--danger);">No tables currently available. Try takeaway instead.</div>');
        return;
      }
      var html = '<div class="table-picker">';
      res.data.forEach(function (t) {
        html += '<label class="table-chip" data-id="' + t._id + '">' +
          '<input type="radio" name="tableId" value="' + t._id + '" />' +
          '<strong>T' + t.tableNumber + '</strong><span>' + t.capacity + ' seats</span>' +
        '</label>';
      });
      html += '</div>';
      $("#tablePickerWrap").html(html);
    }).fail(function () {
      $("#tablePickerWrap").html('<div style="color:var(--danger);">Could not load tables. Please try again.</div>');
    });
  }

  $("#tablePickerWrap").on("click", ".table-chip", function () {
    $(".table-chip").removeClass("selected");
    $(this).addClass("selected");
    $(this).find("input").prop("checked", true);
    selectedTableId = $(this).data("id");
  });

  // ---------- Submit order ----------
  $("#checkoutForm").on("submit", function (e) {
    e.preventDefault();
    var orderType = $("#orderTypeSelect").val();

    if (orderType === "dine-in" && !selectedTableId) {
      showToast("Please select a table", "error");
      return;
    }

    var payload = {
      customerName: $("input[name='customerName']").val(),
      phone: $("input[name='phone']").val(),
      orderType: orderType,
      tableId: orderType === "dine-in" ? selectedTableId : undefined,
      notes: $("textarea[name='notes']").val(),
      items: cart.map(function (i) { return { menuItemId: i.menuItemId, quantity: i.quantity }; }),
    };

    var $btn = $(this).find("button[type='submit']");
    $btn.prop("disabled", true).text("Placing order...");

    $.ajax({
      url: "/api/orders",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function (res) {
        localStorage.removeItem("savora_cart");
        window.location.href = "/order-success/" + res.data._id;
      },
      error: function (xhr) {
        var msg = (xhr.responseJSON && xhr.responseJSON.message) || "Something went wrong. Please try again.";
        showToast(msg, "error");
        $btn.prop("disabled", false).text("Place Order");
      },
    });
  });

  renderCart();
});
