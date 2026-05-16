// test/format.test.js
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

test('Replace placeholders: %s, %d, %j, %O, %?', t => {
  configureLog({ verbose: 3 });

  const logger = getLogger('format-test');

  const sampleError = new Error('Test error');
  const sampleObject = { foo: 'bar' };
  const sampleString = 'Hello';
  const sampleNumber = 42;

  const captured = captureConsole('trace', () => {
    logger.trace(
      'Testing placeholders: %s, %d, %j, %O, %?',
      sampleString, // for %s
      sampleNumber, // for %d
      sampleObject, // for %j
      sampleError, // for %O
      sampleError // for %?
    );
  });

  t.true(captured.includes('format-test'), 'Should include logger name');
  t.true(
    captured.includes(`Testing placeholders:`),
    'Should include the message text'
  );
  t.true(captured.includes(sampleString), 'Should see the string');
  t.true(captured.includes(sampleNumber.toString()), 'Should see the number');
  t.true(captured.includes(`"foo": "bar"`), 'Should see JSON object from %j');
  t.true(
    captured.includes(`"message": "Test error"`),
    'Should see error details from %O'
  );
  t.true(
    captured.includes(`Error: Test error`),
    'Should see an inline error string from %?'
  );
});

test('Take care of leftover arguments', t => {
  configureLog({ verbose: 3 });
  const logger = getLogger('format-test');

  const err = new Error('LeftoverArg Error');
  const leftoverObj = { leftover: true };

  const captured = captureConsole('debug', () => {
    // Notice we have more args than placeholders
    logger.debug('Base message', err, leftoverObj, 123);
  });

  t.true(
    captured.includes('Base message'),
    'Should include the initial string'
  );
  t.true(
    captured.includes('LeftoverArg Error'),
    'Should include leftover error message'
  );
  t.true(
    captured.includes('"leftover": true'),
    'Should include leftover object in JSON'
  );
  t.true(captured.includes('123'), 'Should include leftover number');
});

test('Messages containing $-substitutions are emitted verbatim', t => {
  configureLog({ verbose: 3 });
  const logger = getLogger('format-test');

  const captured = captureConsole('info', () => {
    logger.info('price is $1 per unit ($$ raw, $& too)');
  });

  t.true(
    captured.includes('price is $1 per unit ($$ raw, $& too)'),
    'Should not interpret $1, $$, $& as String.replace specials'
  );
});

test('Logger name with $-substitutions is emitted verbatim', t => {
  configureLog({ verbose: 3 });
  const logger = getLogger('name-with-$1-and-$&');

  const captured = captureConsole('info', () => {
    logger.info('hello');
  });

  t.true(
    captured.includes('name-with-$1-and-$&'),
    'Should not interpret $-tokens in the logger name'
  );
});

test('%d formats as the numeric value', t => {
  configureLog({ verbose: 3 });
  const logger = getLogger('format-test');

  const captured = captureConsole('info', () => {
    logger.info('count=%d', 7);
  });

  t.true(captured.includes('count=7'), 'Should render the number');
  t.false(captured.includes('count=NaN'), 'Should not render NaN');
});
