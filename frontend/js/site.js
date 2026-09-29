/**
 * Shared portal helpers: active nav, live counter.
 */
(function () {
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (!path || path === "/") path = "index.html";
  if (path.indexOf(".") === -1) path += ".html";

  var links = document.querySelectorAll(".portal-nav a[data-nav]");
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("data-nav") === path) {
      links[i].className += " is-active";
    }
  }

  var el = document.getElementById("stat-online");
  if (!el) return;
  var base = 12847;
  setInterval(function () {
    var delta = Math.floor(Math.random() * 11) - 5;
    base = Math.max(9000, Math.min(25000, base + delta));
    el.textContent = base.toLocaleString();
  }, 3000);
})();
