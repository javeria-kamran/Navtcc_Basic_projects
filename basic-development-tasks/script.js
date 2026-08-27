const learningTopics = [
  "HTML structure",
  "CSS styling",
  "JavaScript arrays",
  "Responsive design"
];

const assignmentList = document.getElementById("assignmentList");

if (assignmentList) {
  const topicItems = learningTopics
    .map((topic) => `<li class="topic-item">${topic}</li>`)
    .join("");
  assignmentList.innerHTML = topicItems;
}
