export function fcfs(requests, initialHead) {
  const states = [];
  let currentHead = initialHead;
  let totalSeek = 0;
  let remainingRequests = [...requests];
  let completed = [];
  let path = [initialHead];
  const totalSteps = requests.length;

  states.push({
    currentHead,
    queue: [...remainingRequests],
    completed: [...completed],
    totalSeek,
    targetTrack: null,
    moveDistance: 0,
    path: [...path],
    totalSteps
  });

  for (let track of requests) {
    const moveDistance = Math.abs(track - currentHead);
    totalSeek += moveDistance;
    currentHead = track;
    
    // Remove from remaining
    remainingRequests.shift();
    completed.push(track);
    path.push(track);

    states.push({
      currentHead,
      queue: [...remainingRequests],
      completed: [...completed],
      totalSeek,
      targetTrack: track,
      moveDistance,
      path: [...path],
      totalSteps
    });
  }

  return states;
}
