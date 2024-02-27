const express = require('express');
const controller = require('../controller/page');
const router = express.Router();

router.get('/', controller.main);
router.get('/start', controller.start);
router.get('/start/login', controller.login);
router.get('/start/signup', controller.signup);
router.get('/header', controller.header);
router.get('/header/project', controller.projectheader);
router.get('/project', controller.project);
module.exports = router;
