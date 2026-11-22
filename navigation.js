function revealLinkedProject() {
  const project = document.getElementById(location.hash.slice(1));
  if (project instanceof HTMLDetailsElement) {
    project.open = true;
    project.scrollIntoView({ block: "nearest" });
  }
}
window.addEventListener("hashchange", revealLinkedProject);
revealLinkedProject();

const list = document.querySelector(".project-scroll");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let frame = 0;
let target = 0;
let previousTime = 0;
let position = 0;

function stopGlide() {
  cancelAnimationFrame(frame);
  frame = 0;
}

function glide(time) {
  const elapsed = Math.min(time - previousTime, 64);
  previousTime = time;
  target = Math.min(target, list.scrollHeight - list.clientHeight);
  const distance = target - position;
  const done = Math.abs(distance) < 1;
  position = done ? target : position + distance * (1 - Math.exp(-elapsed / 145));
  list.scrollTo({ top: position, behavior: "instant" });
  frame = done ? 0 : requestAnimationFrame(glide);
}

list.addEventListener("wheel", event => {
  if (reducedMotion.matches || event.ctrlKey || !event.cancelable ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  const unit = [1, 16, list.clientHeight][event.deltaMode] || 1;
  const limit = list.scrollHeight - list.clientHeight;
  if (!limit) return;
  event.preventDefault();
  target = Math.max(0, Math.min(limit, (frame ? target : list.scrollTop) + event.deltaY * unit * .65));
  if (!frame) {
    position = list.scrollTop;
    previousTime = performance.now();
    frame = requestAnimationFrame(glide);
  }
}, { passive: false });

for (const action of ["pointerdown", "keydown", "touchstart"]) {
  list.addEventListener(action, stopGlide, { passive: true });
}
reducedMotion.addEventListener("change", stopGlide);
window.addEventListener("hashchange", stopGlide);
