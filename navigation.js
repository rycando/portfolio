function revealLinkedProject() {
  const project = document.getElementById(location.hash.slice(1));
  if (project instanceof HTMLDetailsElement) {
    project.open = true;
    project.scrollIntoView({ block: "nearest" });
  }
}
window.addEventListener("hashchange", revealLinkedProject);
revealLinkedProject();
