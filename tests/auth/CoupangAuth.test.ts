import { CoupangAuth } from '../../src/auth/CoupangAuth';

describe('CoupangAuth', () => {
  const validCredentials = {
    accessKey: 'test-access-key-123',
    secretKey: 'test-secret-key-456',
  };

  describe('constructor', () => {
    it('should create instance with valid credentials', () => {
      const auth = new CoupangAuth(validCredentials);
      expect(auth).toBeInstanceOf(CoupangAuth);
    });

    it('should throw error with invalid credentials', () => {
      expect(() => {
        new CoupangAuth({ accessKey: '', secretKey: 'test' });
      }).toThrow('Invalid credentials');

      expect(() => {
        new CoupangAuth({ accessKey: 'test', secretKey: '' });
      }).toThrow('Invalid credentials');

      expect(() => {
        new CoupangAuth({ accessKey: 'short', secretKey: 'short' });
      }).toThrow('Invalid credentials');
    });
  });

  describe('generateHmacSignature', () => {
    let auth: CoupangAuth;

    beforeEach(() => {
      auth = new CoupangAuth(validCredentials);
    });

    it('should generate signature in correct format', () => {
      const signature = auth.generateHmacSignature('GET', '/api/test');
      
      expect(signature).toMatch(/^CEA algorithm=HmacSHA256, access-key=.+, signed-date=.+, signature=.+$/);
      expect(signature).toContain('access-key=test-access-key-123');
    });

    it('should generate different signatures for different URLs', () => {
      const sig1 = auth.generateHmacSignature('GET', '/api/test1');
      const sig2 = auth.generateHmacSignature('GET', '/api/test2');
      
      expect(sig1).not.toBe(sig2);
    });

    it('should generate different signatures for different methods', () => {
      const getSig = auth.generateHmacSignature('GET', '/api/test');
      const postSig = auth.generateHmacSignature('POST', '/api/test');
      
      expect(getSig).not.toBe(postSig);
    });

    it('should handle URLs with query parameters', () => {
      const signature = auth.generateHmacSignature('GET', '/api/test?param=value&another=test');
      expect(signature).toMatch(/^CEA algorithm=HmacSHA256/);
    });
  });

  describe('getAuthorizationHeader', () => {
    let auth: CoupangAuth;

    beforeEach(() => {
      auth = new CoupangAuth(validCredentials);
    });

    it('should return object with Authorization key', () => {
      const header = auth.getAuthorizationHeader('GET', '/api/test');
      
      expect(header).toHaveProperty('Authorization');
      expect(header.Authorization).toMatch(/^CEA algorithm=HmacSHA256/);
    });
  });

  describe('updateCredentials', () => {
    let auth: CoupangAuth;

    beforeEach(() => {
      auth = new CoupangAuth(validCredentials);
    });

    it('should update credentials successfully', () => {
      const newCredentials = {
        accessKey: 'new-access-key-789',
        secretKey: 'new-secret-key-012',
      };

      expect(() => {
        auth.updateCredentials(newCredentials);
      }).not.toThrow();

      // Verify new credentials are used
      const signature = auth.generateHmacSignature('GET', '/api/test');
      expect(signature).toContain('access-key=new-access-key-789');
    });

    it('should validate new credentials', () => {
      expect(() => {
        auth.updateCredentials({ accessKey: '', secretKey: 'test' });
      }).toThrow('Invalid credentials');
    });
  });
});