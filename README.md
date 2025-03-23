# CBT Exam System

This project is a comprehensive Computer-Based Test (CBT) exam system with registration, login, admin user functionalities, a timer, and submission features. The project is built using Node.js, Express, MongoDB for the backend, and React for the frontend.

## Project Structure

```
cbt-exam-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
└── README.md
```

## Backend

### User Model

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' } // 'admin' or 'student'
});

module.exports = mongoose.model('User', userSchema);
```

### Exam Model

```javascript
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String
});

const examSchema = new mongoose.Schema({
    title: String,
    questions: [questionSchema]
});

module.exports = mongoose.model('Exam', examSchema);
```

### Server Setup and Routes

```javascript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/cbt_exam', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### User Routes

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registration
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, password: await bcrypt.hash(password, 10), role });
    await user.save();
    res.status(201).send('User registered');
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).send({ username: user.username, role: user.role });
    } else {
        res.status(400).send('Invalid credentials');
    }
});

module.exports = router;
```

### Exam Routes

```javascript
const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// Create Exam
router.post('/create', async (req, res) => {
    const { title, questions } = req.body;
    const exam = new Exam({ title, questions });
    await exam.save();
    res.status(201).send('Exam created');
});

// Get Exams
router.get('/', async (req, res) => {
    const exams = await Exam.find();
    res.status(200).send(exams);
});

// Submit Exam
router.post('/submit', (req, res) => {
    const { answers } = req.body;
    // Logic to evaluate answers
    res.status(200).send('Exam submitted');
});

module.exports = router;
```

## Frontend

### Registration and Login Forms

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ type }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/users/${type}`, { username, password });
            alert(response.data);
        } catch (error) {
            alert('Error: ' + error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{type === 'register' ? 'Register' : 'Login'}</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">{type === 'register' ? 'Register' : 'Login'}</button>
        </form>
    );
};

export default Auth;
```

### Admin Dashboard for Managing Questions

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const handleAddQuestion = () => {
        setQuestions([...questions, { question, options, correctAnswer }]);
        setQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
    };

    const handleSaveExam = async () => {
        try {
            await axios.post('http://localhost:5000/api/exams/create', { title, questions });
            alert('Exam created');
        } catch (error) {
            alert('Error: ' + error.response.data);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Exam Title" required />
            <div>
                <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" required />
                {options.map((option, index) => (
                    <input key={index} type="text" value={option} onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                    }} placeholder={`Option ${index + 1}`} required />
                ))}
                <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} placeholder="Correct Answer" required />
                <button onClick={handleAddQuestion}>Add Question</button>
            </div>
            <button onClick={handleSaveExam}>Save Exam</button>
        </div>
    );
};

export default AdminDashboard;
```

### Exam Interface with Timer

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exam = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour

    useEffect(() => {
        const fetchExams = async () => {
            const response = await axios.get('http://localhost:5000/api/exams');
            setExams(response.data);
        };
        fetchExams();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSelectExam = (exam) => {
        setSelectedExam(exam);
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers({ ...answers, [questionIndex]: answer });
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:5000/api/exams/submit', { answers });
            alert('Exam submitted');
        } catch (error) {
            alert('Error: ' + error.response.data);
        }
    };

    return (
        <div>
            <h2>Exam</h2>
            {selectedExam ? (
                <div>
                    <h3>{selectedExam.title}</h3>
                    <div>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
                    {selectedExam.questions.map((question, index) => (
                        <div key={index}>
                            <p>{question.question}</p>
                            {question.options.map((option, i) => (
                                <label key={i}>
                                    <input type="radio" name={`question-${index}`} value={option} onChange={() => handleAnswerChange(index, option)} />
                                    {option}
                                </label>
                            ))}
                        </div>
                    ))}
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            ) : (
                <div>
                    <h3>Select an Exam</h3>
                    {exams.map((exam, index) => (
                        <button key={index} onClick={() => handleSelectExam(exam)}>{exam.title}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Exam;
```

### Application Entry Point

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import Exam from './components/Exam';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/register" component={() => <Auth type="register" />} />
                <Route path="/login" component={() => <Auth type="login" />} />
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/exam" component={Exam} />
                <Route path="/" component={() => <h1>Welcome to CBT Exam System</h1>} />
            </Switch>
        </Router>
    );
};

export default App;
```

### Frontend Package Configuration

```json
{
  "name": "cbt-exam-frontend",
  "version": "1.0.0",
  "main": "src/index.js",
  "dependencies": {
    "axios": "^0.21.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-router-dom": "^5.2.0",
    "react-scripts": "4.0.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Running the Project

1. **Backend:**
   - Navigate to the `backend` directory and install dependencies:
     ```bash
     cd backend
     npm install
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

2. **Frontend:**
   - Navigate to the `frontend` directory and install dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Start the frontend development server:
     ```bash
     npm start
     ```

### Sample `index.html` for CBT Exam

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CBT Exam</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .question {
            margin-bottom: 20px;
        }
        .question h3 {
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        .options {
            list-style: none;
            padding: 0;
        }
        .options li {
            margin-bottom: 10px;
        }
        .submit-btn {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: #fff;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CBT Exam</h1>
        <form id="exam-form">
            <!-- Questions will be dynamically inserted here by JavaScript -->
        </form>
        <button type="submit" class="submit-btn" onclick="submitExam()">Submit Exam</button>
    </div>

    <script>
        const questions = [
            {
                question: "What is the capital of France?",
                options: ["Paris", "London", "Berlin", "Madrid"]
            },
            {
                question: "What is the largest planet in our solar system?",
                options: ["Earth", "Mars", "Jupiter", "Saturn"]
            },
            {
                question: "What is the chemical symbol for water?",
                options: ["H2O", "O2", "CO2", "NaCl"]
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["William Shakespeare", "Charles Dickens", "J.K. Rowling", "Mark Twain"]
            },
            {
                question: "What is the speed of light?",
                options: ["299,792 km/s", "150,000 km/s", "1,000 km/s", "100,000 km/s"]
            }
        ];

        function loadQuestions() {
            const form = document.getElementById('exam-form');
            questions.forEach((q, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question');

                const questionTitle = document.createElement('h3');
                questionTitle.innerText = `Q${index + 1}. ${q.question}`;
                questionDiv.appendChild(questionTitle);

                const optionsUl = document.createElement('ul');
                optionsUl.classList.add('options');

                q.options.forEach((option, i) => {
                    const optionLi = document.createElement('li');

                    const optionInput = document.createElement('input');
                    optionInput.type = 'radio';
                    optionInput.name = `question-${index}`;
                    optionInput.value = option;
                    optionInput.id = `question-${index}-option-${i}`;

                    const optionLabel = document.createElement('label');
                    optionLabel.htmlFor = optionInput.id;
                    optionLabel.innerText = option;

                    optionLi.appendChild(optionInput);
                    optionLi.appendChild(optionLabel);
                    optionsUl.appendChild(optionLi);
                });

                questionDiv.appendChild(optionsUl);
                form.appendChild(questionDiv);
            });
        }

        function submitExam() {
            const form = document.getElementById('exam-form');
            const formData = new FormData(form);
            const answers = {};
            formData.forEach((value, key) => {
                answers[key] = value;
            });
            console.log('Exam submitted:', answers);
            alert('Exam submitted');
        }

        // Load questions on page load
        window.onload = loadQuestions;
    </script>
</body>
</html>
```

This setup provides a basic structure for a CBT exam system with registration, login, admin functionalities, a timer, and submission handling. You can further enhance it with additional features and security measures as needed.
