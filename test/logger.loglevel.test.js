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

  const allMethods = ['log', 'info', 'debug', 'warn', 'error', 'trace'];
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
