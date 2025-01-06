// test/errors.test.js
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

test('Log an error with multiple arguments', t => {
  configureLog({ verbose: 3 });
  const logger = getLogger('errors-test');

  const myError = new Error('Something went wrong');
  const userContext = { userId: 123 };

  const captured = captureConsole('error', () => {
    logger.error('Error occurred while processing user:', myError, userContext);
  });

  t.true(
    captured.includes('Error occurred while processing user:'),
    'Should contain the initial message'
  );
  t.true(
    captured.includes('Something went wrong'),
    'Should contain the error message'
  );
  t.true(
    captured.includes('"userId": 123'),
    'Should contain the leftover object context'
  );
});

test('Check that stack trace is included for errors', t => {
  configureLog({ verbose: 3 });
  const logger = getLogger('errors-test-stack');

  const myError = new Error('Stack trace test');

  const captured = captureConsole('error', () => {
    logger.error('Stack test: %?', myError);
  });

  t.true(captured.includes('Stack trace test'), 'Should see the error message');
  t.truthy(captured.match(/at\s+.*/), 'Should see a stack trace line');
});
