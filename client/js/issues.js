// ===== CATEGORY ICONS =====
function getCategoryIcon(cat) {
  const icons = {
    Plumbing: "🚿",
    Electrical: "💡",
    Security: "🚨",
    Internet: "🌐",
    Cleanliness: "🧹",
    Furniture: "🪑",
    Emergency: "🆘"
  };
  return icons[cat] || "📌";
}

// ===== ON LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = "/login.html";
    return;
  }

  fetch("/api/issues", {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(issues => {
      window.currentIssues = issues;
      const filtered = filterByRole(issues, user);
      renderIssues(filtered, user);
      updateSummary(filtered);
    })
    .catch(() => alert("Failed to load issues"));
});

// ===== ROLE FILTER =====
function filterByRole(issues, user) {
  switch (user.role) {
    case "student":
      return issues.filter(i => i.reported_by === user.id);

    case "warden":
      return issues.filter(i => i.status === "Reported");

    case "maintenance":
    case "security":
      return issues.filter(i =>
        ["Verified", "In Progress"].includes(i.status)
      );

    case "admin":
      return issues;

    default:
      return [];
  }
}

// ===== RENDER TABLE =====
function renderIssues(issues, user) {
  const table = document.getElementById("issuesTable");
  const count = document.getElementById("issueCount");

  table.innerHTML = "";
  count.innerText = issues.length;

  if (issues.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:30px;">
          🎉 No issues to show
        </td>
      </tr>`;
    return;
  }

  issues.forEach(issue => {
    table.innerHTML += `
      <tr>
        <td title="Reported on ${new Date(issue.created_at).toLocaleString()}">
          #${issue.id}
        </td>
        <td>${getCategoryIcon(issue.category)} ${issue.category}</td>
        <td>
          <span class="status ${issue.status.toLowerCase().replace(" ", "-")}">
            ${issue.status}
          </span>
        </td>
        <td>
          <span class="priority ${issue.priority.toLowerCase()}">
            ${issue.priority}
          </span>
        </td>
        <td>${getActionButtons(issue, user)}</td>
      </tr>`;
  });
}

// ===== ACTION BUTTONS =====
function getActionButtons(issue, user) {
  switch (user.role) {
    case "student":
      return `<button class="btn-view" onclick="viewIssue(${issue.id})">View</button>`;

    case "warden":
      return `
        <button class="btn-view" onclick="verifyIssue(${issue.id})">Verify</button>
        <button class="btn-view" onclick="rejectIssue(${issue.id})">Reject</button>
      `;

    case "maintenance":
    case "security":
      return `
        <button class="btn-view" onclick="startWork(${issue.id})">Start</button>
        <button class="btn-view" onclick="resolveIssue(${issue.id})">Resolve</button>
      `;

    case "admin":
      return `<button class="btn-view" onclick="viewIssue(${issue.id})">Audit</button>`;

    default:
      return "-";
  }
}

// ===== SUMMARY CARDS =====
function updateSummary(issues) {
  document.getElementById("totalIssues").innerText = issues.length;
  document.querySelector(".warn").innerText =
    issues.filter(i => i.status !== "Resolved").length;
  document.querySelector(".ok").innerText =
    issues.filter(i => i.status === "Resolved").length;
}

// ===== ACTION HANDLERS =====
function viewIssue(id) {
  const i = window.currentIssues.find(x => x.id === id);
  alert(`
Category: ${i.category}
Status: ${i.status}
Priority: ${i.priority}
Location: ${i.location}
Description: ${i.description}
`);
}

function verifyIssue(id) { alert("Issue #" + id + " verified ✔"); }
function rejectIssue(id) { alert("Issue #" + id + " rejected ❌"); }
function startWork(id) { alert("Work started on issue #" + id); }
function resolveIssue(id) { alert("Issue #" + id + " resolved ✅"); }
