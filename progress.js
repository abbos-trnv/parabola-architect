const CourseProgress = (() => {
  const goals = {points:['left','right'], line:['slope','offset'], arch:['a','b','c','lab']};
  const memory = new Set();
  function has(lesson, step) {
    const key = 'bureau.course.v1.' + lesson + '.' + step;
    try { return memory.has(key) || localStorage.getItem(key) === 'done'; }
    catch { return memory.has(key); }
  }
  function mark(lesson, step) {
    if (!goals[lesson]?.includes(step)) return;
    const key = 'bureau.course.v1.' + lesson + '.' + step;
    memory.add(key);
    try { localStorage.setItem(key, 'done'); } catch {}
  }
  function count(lesson) { return goals[lesson].filter(step => has(lesson, step)).length; }
  return { goals, has, mark, count, finished: lesson => count(lesson) === goals[lesson].length };
})();
