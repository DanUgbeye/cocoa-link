import bcrypt from "bcrypt";

export class PasswordUtil {
  /**
   * returns a hash for a given password
   * @param password the password to be hashed
   */
  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  /**
   * returns a hash for a given password
   * @param {string} plainPassword the plain text password to compare
   * @param {string} hash the already hashed password to compare with
   */
  static async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
