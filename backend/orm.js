const { getPool } = require('./db');

/**
 * Simple ORM for User model
 * Provides abstraction layer for database operations
 */
class UserORM {
    constructor() {
        this.tableName = 'users';
    }

    /**
     * Find all users
     * @returns {Promise<Array>} Array of user objects
     */
    async findAll() {
        try {
            const pool = getPool();
            const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
            return rows;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    /**
     * Find user by ID
     * @param {number} id - User ID
     * @returns {Promise<Object|null>} User object or null if not found
     */
    async findById(id) {
        try {
            const pool = getPool();
            const [rows] = await pool.query(
                `SELECT * FROM ${this.tableName} WHERE id = ?`,
                [id]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    /**
     * Create a new user
     * @param {Object} userData - User data object
     * @param {string} userData.name - User name
     * @param {string} userData.class - User class
     * @param {string} userData.nationality - User nationality
     * @returns {Promise<Object>} Created user object with ID
     */
    async create(userData) {
        try {
            const pool = getPool();
            const { name, class: userClass, nationality } = userData;

            const [result] = await pool.query(
                `INSERT INTO ${this.tableName} (name, class, nationality) VALUES (?, ?, ?)`,
                [name, userClass, nationality]
            );

            return {
                id: result.insertId,
                name,
                class: userClass,
                nationality
            };
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    /**
     * Update user by ID
     * @param {number} id - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise<Object|null>} Updated user object or null if not found
     */
    async update(id, userData) {
        try {
            const pool = getPool();
            const { name, class: userClass, nationality } = userData;

            const [result] = await pool.query(
                `UPDATE ${this.tableName} SET name = ?, class = ?, nationality = ? WHERE id = ?`,
                [name, userClass, nationality, id]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            return await this.findById(id);
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    }

    /**
     * Delete user by ID
     * @param {number} id - User ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        try {
            const pool = getPool();
            const [result] = await pool.query(
                `DELETE FROM ${this.tableName} WHERE id = ?`,
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    }

    /**
     * Find users by field value
     * @param {string} field - Field name
     * @param {any} value - Field value
     * @returns {Promise<Array>} Array of matching users
     */
    async findBy(field, value) {
        try {
            const pool = getPool();
            const [rows] = await pool.query(
                `SELECT * FROM ${this.tableName} WHERE ?? = ?`,
                [field, value]
            );
            return rows;
        } catch (error) {
            console.error('Error in findBy:', error);
            throw error;
        }
    }
}

module.exports = new UserORM();
