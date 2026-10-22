import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

test('Auth Security: Constant-time hash verification', () => {
  function verifyPin(inputPin, expectedPin) {
    if (typeof inputPin !== 'string' || inputPin.length === 0) return false;
    const inputHash = crypto.createHash('sha256').update(inputPin.trim()).digest();
    const expectedHash = crypto.createHash('sha256').update(expectedPin.trim()).digest();
    return crypto.timingSafeEqual(inputHash, expectedHash);
  }

  assert.equal(verifyPin('9891', '9891'), true);
  assert.equal(verifyPin('0000', '9891'), false);
  assert.equal(verifyPin('1234', '9891'), false);
  assert.equal(verifyPin('', '9891'), false);
});

test('Auth Security: HMAC session token signature and verification', () => {
  const secret = 'super-secret-test-salt';

  function createToken(role) {
    const payload = { role, exp: Date.now() + 60000 };
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
    return `${payloadStr}.${signature}`;
  }

  function verifyToken(token) {
    if (!token) return false;
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return false;

    const expectedSig = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    return payload.role === 'owner' && payload.exp > Date.now();
  }

  const validToken = createToken('owner');
  assert.equal(verifyToken(validToken), true);

  const tamperedToken = validToken.slice(0, -4) + 'abcd';
  assert.equal(verifyToken(tamperedToken), false);

  const guestToken = createToken('guest');
  assert.equal(verifyToken(guestToken), false);
});
