(function () {
    "use strict";

    var toTop = document.getElementById("toTop");
    var ids = ["home", "about", "services", "work", "contact"];
    var sections = ids.map(function (id) { return document.getElementById(id); });
    var links = document.querySelectorAll("#navbarSupportedContent .nav-link");
    var menu = document.getElementById("navbarSupportedContent");

    // Active link while scrolling + back-to-top button
    function onScroll() {
        var y = window.scrollY || window.pageYOffset;
        var mark = y + window.innerHeight * 0.35;
        var current = ids[0];
        sections.forEach(function (s) { if (s && s.offsetTop <= mark) current = s.id; });
        if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = "contact";
        links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + current); });
        toTop.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    // Close mobile menu after choosing a link
    links.forEach(function (link) {
        link.addEventListener("click", function () {
            if (menu.classList.contains("show")) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });

    // Count-up numbers
    var counters = document.querySelectorAll(".count");
    function runCount(el) {
        var target = parseInt(el.dataset.target, 10) || 0;
        var start = null;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 1000, 1);
            el.textContent = Math.round(target * p);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { runCount(entry.target); io.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { io.observe(c); });
    } else {
        counters.forEach(function (c) { c.textContent = c.dataset.target; });
    }

    // Contact form: opens the visitor's email app with the message filled in
    var form = document.getElementById("contactForm");
    var note = document.getElementById("formNote");
    var TO = "mohamed.eidalatony1744@gmail.com";

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = document.getElementById("cName");
        var email = document.getElementById("cEmail");
        var subject = document.getElementById("cSubject");
        var message = document.getElementById("cMessage");
        var ok = true;

        [name, email, message].forEach(function (f) {
            var valid = f.value.trim() !== "" && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value.trim()));
            f.classList.toggle("is-invalid", !valid);
            if (!valid) ok = false;
        });

        note.classList.remove("error");
        if (!ok) {
            note.textContent = "Please fill in your name, a valid email and a message.";
            note.classList.add("error");
            return;
        }

        var subj = subject.value.trim() || "Portfolio message from " + name.value.trim();
        var body = message.value.trim() + "\n\n— " + name.value.trim() + " (" + email.value.trim() + ")";
        window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
        note.textContent = "Opening your email app... if nothing opens, write to " + TO;
    });
})();
