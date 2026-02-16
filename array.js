const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());


let students = [
    { id: 1, name: "A", mobileno: 8978735498, address: "ABC", age: 20 },
    { id: 2, name: "B", mobileno: 7873547890, address: "BCD", age: 25 }
];


app.post("/students", (req, res) => {
    const student = req.body;
    students.push(student);
    res.json({ message: "Student added", students });
});


app.get("/students", (req, res) => {
    res.json(students);
});


app.get("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
});


app.put("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    students[index] = { ...students[index], ...req.body };
    res.json({ message: "Student updated", students });
});


app.delete("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    students = students.filter(s => s.id !== id);
    res.json({ message: "Student deleted", students });
});


app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Student CRUD</title>
    </head>
    <body>
        <h2>Student CRUD Operations</h2>

        <h3>Add Student</h3>
        <input id="id" placeholder="ID" />
        <input id="name" placeholder="Name" />
        <input id="mobileno" placeholder="Mobile" />
        <input id="address" placeholder="Address" />
        <input id="age" placeholder="Age" />
        <button onclick="addStudent()">Add</button>

        <h3>All Students</h3>
        <button onclick="getStudents()">Load Students</button>
        <pre id="output"></pre>

        <script>
            const api = "http://localhost:${PORT}/students";

            async function addStudent() {
                const student = {
                    id: Number(document.getElementById("id").value),
                    name: document.getElementById("name").value,
                    mobileno: Number(document.getElementById("mobileno").value),
                    address: document.getElementById("address").value,
                    age: Number(document.getElementById("age").value)
                };

                await fetch(api, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(student)
                });

                alert("Student Added");
                getStudents();
            }

            async function getStudents() {
                const res = await fetch(api);
                const data = await res.json();
                document.getElementById("output").innerText = JSON.stringify(data, null, 2);
            }
        </script>
    </body>
    </html>
    `);
});


app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});