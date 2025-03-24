const express = require('express');
const examController = require('../controllers/examController');

const router = express.Router();

router.post('/', examController.createExam);
router.get('/', examController.getExams);

module.exports = router;
