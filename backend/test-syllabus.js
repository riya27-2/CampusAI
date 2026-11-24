// Server chalta rehna chahiye (npm run dev, doosre terminal mein).
// Chalane ke liye: node test-syllabus.js

const BASE = "http://localhost:5000/api/ai";

const syllabus = `
Course: Data Structures
Unit 1: Introduction - Arrays, Linked Lists (singly, doubly, circular)
Unit 2: Stacks and Queues - operations, applications, expression evaluation
Unit 3: Trees - Binary trees, BST, traversals, AVL trees
Unit 4: Graphs - representation, BFS, DFS, shortest path
Unit 5: Sorting and Searching - bubble, merge, quick sort, binary search, hashing
`;

const form = new FormData();
form.append("file", new Blob([syllabus], { type: "text/plain" }), "syllabus.txt");
form.append("course", "Data Structures");
form.append("totalSessions", "8");
form.append("minutesPerSession", "60");

console.log("Session plan ban raha hai... (10-30 second lag sakte hain)");

try {
  const res = await fetch(`${BASE}/syllabus`, { method: "POST", body: form });
  const data = await res.json();
  console.log("Status:", res.status);

  if (!data.sessions) {
    console.log("Error:", data);
  } else {
    console.log(`\n${data.course}: ${data.sessions.length} sessions\n`);
    for (const s of data.sessions) {
      console.log(`Session ${s.sessionNo}: ${s.topic}`);
      console.log(`   Subtopics: ${(s.subtopics || []).join(", ")}`);
    }
  }
} catch (err) {
  console.log("Request fail hua:", err.cause?.code || err.message);
}