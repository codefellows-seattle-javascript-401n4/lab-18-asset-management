'use strict';

const basicHttp = require(__dirname + '/../lib/basic-http');

describe('basic HTTP', () => {
  it('should parse basic http authentication', () => {
    let testBuffer = new Buffer('testUsername:testPassword');
    let req = {headers:
      {
        authorization: `Basic ${testBuffer.toString('base64')}`,
      }
    };
    basicHttp(req, null, function() {
      // 0 meaning catching no error object in the success case, next(e); testing line 18 in basic-http.js
      expect(arguments.length).toBe(0);
      expect(req.auth.username).toBe('testUsername');
      expect(req.auth.password).toBe('testPassword');
    });
  });

  it('should fail with bad httpBasic', () => {
    basicHttp({}, null, function() {
      // 1 meaning catching 1 error object in the failure case, next(e); testing line 18 in basic-http.js
      expect(arguments.length).toBe(1);
      expect(arguments[0] instanceof Error).toBe(true);
    });
  });
});
