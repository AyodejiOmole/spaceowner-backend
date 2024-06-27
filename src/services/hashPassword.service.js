const argon2 = require("argon2");

function createPasswordHasher() {
  return {
    async hashPassword(password) {
      const hash = await argon2.hash(password);
      return hash;
    },
    async verifyPassword(password, hash) {
      const isValid = await argon2.verify(password, hash);
      console.log("isValid");
      return isValid;
    },
    async hashPasswordRaw(password) {
      const hash = await argon2.hashRaw(password);
      return hash;
    },
    async verifyPasswordRaw(password, hash) {
      const isValid = await argon2.verifyRaw(password, hash);
      return isValid;
    },
    generateSalt() {
      const salt = argon2.generateSalt();
      return salt;
    },
    generateHashConfiguration(options) {
      const config = argon2.hashConfiguration(options);
      return config;
    },
  };
}

module.exports = createPasswordHasher;
