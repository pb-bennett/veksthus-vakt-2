const express = require('express');

const logRequest = require('../middleware/requestLogMiddleware');

const readingsRouter = require('./readingsRouter');
const sensorsRouter = require('./sensorsRouter');
const unitsRouter = require('./unitsRouter');
const handshakeRouter = require('./handshakeRouter');
const usersRouter = require('./usersRouter');
const authRouter = require('./authRouter');
const rolesRouter = require('./rolesRouter');
const requestLogsRouter = require('./requestLogsRouter');

const router = express.Router();

router.use(logRequest);
router.get('/', (req, res) => {
  res.json({ success: true });
});

router.use('/readings', readingsRouter);
router.use('/sensors', sensorsRouter);
router.use('/units', unitsRouter);
router.use('/handshake', handshakeRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/roles', rolesRouter);
router.use('/requestlogs', requestLogsRouter);

module.exports = router;
