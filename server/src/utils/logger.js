const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  // Ensure sensitive fields are never leaked in logs
  const sanitizedMeta = { ...meta };
  delete sanitizedMeta.password;
  delete sanitizedMeta.token;
  delete sanitizedMeta.authorization;
  delete sanitizedMeta.jwt;
  delete sanitizedMeta.secret;

  const metaString = Object.keys(sanitizedMeta).length ? ` ${JSON.stringify(sanitizedMeta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
};

const logger = {
  info: (msg, meta) => console.log(formatLog('info', msg, meta)),
  warn: (msg, meta) => console.warn(formatLog('warn', msg, meta)),
  error: (msg, meta) => console.error(formatLog('error', msg, meta)),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('debug', msg, meta));
    }
  }
};

module.exports = logger;
