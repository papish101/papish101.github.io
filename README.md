<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CBT Exam</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        #quiz-container { max-width: 700px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 10px; }
        .question { margin-bottom: 15px; font-weight: bold; }
        .options { list-style: none; padding: 0; }
        .options li { margin: 8px 0; }
        #progress-bar { width: 100%; background: #f0f0f0; border-radius: 5px; margin: 20px 0; }
        #progress { height: 20px; background: #4caf50; border-radius: 5px; width: 0; }
        #timer { text-align: right; font-weight: bold; color: red; }
        button { padding: 10px 20px; margin-top: 20px; cursor: pointer; }
    </style>
</head>
<body>
    <div id="quiz-container">
        <h2>CBT Exam</h2>
        <div id="timer">Time Left: <span id="time-left">600</span> seconds</div>
        <div id="progress-bar"><div id="progress"></div></div>
        <div id="question-container"></div>
        <button onclick="nextQuestion()">Next</button>
        <button onclick="submitExam()" style="display: none;">Submit</button>
    </div>

    <script>
        const questions = [
            { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: 1 },
            { question: "What is the capital of France?", options: ["Paris", "Berlin", "Madrid", "Rome"], answer: 0 },
            { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
            { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
            { question: "Who wrote 'Romeo and Juliet'?", options: ["Shakespeare", "Hemingway", "Austen", "Orwell"], answer: 0 },
            { question: "which among this is fruit?", options: ["Yam", "Plantain", "Banana", "stone"], answer: 2},
            { question: "Add a number to 5 and divide by 2 and the result is 10 What is the number?", options: ["15", "100", "3", "20"], answer: 0}
        ];

        // Generate 100 questions by repeating base questions and randomizing
        while (questions.length < 100) {
            const baseQuestion = questions[questions.length % 7];
            questions.push({ ...baseQuestion, question: `${baseQuestion.question} (Q${questions.length + 1})` });
        }

        let currentQuestion = 0;
        let answers = Array(100).fill(null);
        let timeLeft = 600;
        const totalQuestions = questions.length;

        function loadQuestion() {
            const container = document.getElementById('question-container');
            const q = questions[currentQuestion];
            container.innerHTML = `<div class="question">${q.question}</div>`;
            const optionsHtml = q.options.map((opt, i) =>
                `<li><input type="radio" name="option" value="${i}" ${answers[currentQuestion] === i ? 'checked' : ''}> ${opt}</li>`).join('');
            container.innerHTML += `<ul class="options">${optionsHtml}</ul>`;
            document.querySelector('button[onclick="submitExam()"]').style.display =
                (currentQuestion === totalQuestions - 1) ? 'inline' : 'none';
            updateProgress();
        }

        function nextQuestion() {
            const selected = document.querySelector('input[name="option"]:checked');
            if (selected) {
                answers[currentQuestion] = parseInt(selected.value);
                if (currentQuestion < totalQuestions - 1) {
                    currentQuestion++;
                    loadQuestion();
                }
            } else alert('Please select an option.');
        }

        function submitExam() {
            clearInterval(timerInterval);
            let score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].answer ? 1 : 0), 0);
            alert(`You scored ${score} out of ${totalQuestions}`);
        }

        function updateProgress() {
            const progress = (currentQuestion + 1) / totalQuestions * 100;
            document.getElementById('progress').style.width = `${progress}%`;
        }

        const timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                document.getElementById('time-left').textContent = timeLeft;
            } else {
                clearInterval(timerInterval);
                submitExam();
            }
        }, 1000);

        loadQuestion();
    </script>
</body>
</html>
