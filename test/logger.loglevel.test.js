import test from 'ava';
import { configureLog, getLogger } from '../src/index.js';

function captureConsole(method, fn) {
  const original = console[method];
  let output = '';

  console[method] = (...args) => {
    output += args.join(' ') + '\n';
  };

  try {
    fn();
  } finally {
    console[method] = original;
  }
  return output;
}

test('Default (info level) logs info but not debug', t => {
  // The default is info level
  configureLog();

  const logger = getLogger('test-default');

  const infoOutput = captureConsole('info', () => {
    logger.info('Hello Info World');
  });

  const debugOutput = captureConsole('debug', () => {
    logger.debug('Hello Debug World');
  });

  t.true(infoOutput.includes('Hello Info World'), 'Should log info messages');
  t.false(
    debugOutput.includes('Hello Debug World'),
    'Should not log debug messages at default info level'
  );
});

test('Silent mode should log nothing', t => {
  configureLog({ silent: true });

  const logger = getLogger('test-silent');

  const allMethods = ['log', 'info', 'debug', 'warning', 'error', 'trace'];
  let capturedAnything = false;

  for (const m of allMethods) {
    const out = captureConsole(m, () => {
      logger.info('Should not appear');
      logger.error('Should not appear');
    });
    if (out.trim().length > 0) {
      capturedAnything = true;
      break;
    }
  }

  t.false(capturedAnything, 'No output should appear in silent mode');
});

test('Verbose=1 allows debug logs', t => {
  configureLog({ verbose: 1 });

  const logger = getLogger('test-verbose-1');

  const debugOutput = captureConsole('debug', () => {
    logger.debug('This is debug level');
  });

  t.true(
    debugOutput.includes('This is debug level'),
    'Should see debug at verbose=1'
  );
});

test('Verbose=3 allows trace logs', t => {
  configureLog({ verbose: 3 });

  const logger = getLogger('test-verbose-3');

  const traceOutput = captureConsole('trace', () => {
    logger.trace('This is a trace log');
  });

  t.true(
    traceOutput.includes('This is a trace log'),
    'Should see trace logs at verbose=3'
  );
});

test('Setting log level to "error" only logs error (and above)', t => {
  configureLog({ level: 'error' });

  const logger = getLogger('test-error-level');

  const warningOutput = captureConsole('warning', () => {
    logger.warning('Should not log at error level');
  });

  t.false(
    warningOutput.includes('Should not log at error level'),
    'Warning messages should not appear at error level'
  );

  const infoOutput = captureConsole('info', () => {
    logger.info('Should not log info at error level');
  });

  t.false(
    infoOutput.includes('Should not log info at error level'),
    'Info messages should not appear at error level'
  );

  const debugOutput = captureConsole('debug', () => {
    logger.debug('Should not log debug at error level');
  });

  t.false(
    debugOutput.includes('Should not log debug at error level'),
    'Debug messages should not appear at error level'
  );

  const errorOutput = captureConsole('error', () => {
    logger.error('We are now at error level');
  });

  t.true(
    errorOutput.includes('We are now at error level'),
    'Error messages should be logged at error level'
  );
});

test('Test all log levels', t => {
  configureLog({ level: 'trace' });
  const logger = getLogger('test-all-levels');

  const traceOutput = captureConsole('trace', () => {
    logger.trace('Should log at trace level');
  });

  const debugOutput = captureConsole('debug', () => {
    logger.debug('Should log at debug level');
  });

  const verboseOutput = captureConsole('log', () => {
    logger.verbose('Should log at verbose level');
  });

  const infoOutput = captureConsole('info', () => {
    logger.info('Should log at info level');
  });

  const warningOutput = captureConsole('warn', () => {
    logger.warning('Should log at warning level');
  });

  const warnOutput = captureConsole('warn', () => {
    logger.warn('Should log at warning level');
  });

  const errorOutput = captureConsole('error', () => {
    logger.error('Should log at error level');
  });

  const criticalOutput = captureConsole('error', () => {
    logger.critical('Should log at critical level');
  });

  t.true(
    traceOutput.includes('Should log at trace level'),
    'Trace messages should be logged at trace level'
  );

  t.true(
    debugOutput.includes('Should log at debug level'),
    'Debug messages should be logged at trace level'
  );

  t.true(
    verboseOutput.includes('Should log at verbose level'),
    'Verbose messages should be logged at trace level'
  );

  t.true(
    infoOutput.includes('Should log at info level'),
    'Info messages should be logged at info level'
  );

  t.true(
    warningOutput.includes('Should log at warning level'),
    'Warning messages should be logged at warning level'
  );

  t.true(
    warnOutput.includes('Should log at warning level'),
    'Warning messages should be logged at trace level'
  );

  t.true(
    errorOutput.includes('Should log at error level'),
    'Error messages should be logged at error level'
  );

  t.true(
    criticalOutput.includes('Should log at critical level'),
    'Critical messages should be logged at critical level'
  );
});
