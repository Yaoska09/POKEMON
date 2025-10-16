const db = require('../database/db');

class playerModel {
  // Obtener todos los jugadores
  static async getAll() {
    const { rows } = await db.query(`
      SELECT id, name, location
      FROM player
    `);
    return rows;
  }

  // Obtener un jugador  por ID
  static async getById(id) {
    const { rows } = await db.query(
      'SELECT id, name, location FROM player WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  // Crear player 
  static async create({ name, location }) {
    const { rows } = await db.query(
      `INSERT INTO player (name, location)
       VALUES ($1, $2) RETURNING id`,
      [name, location]
    );
    return rows[0].id;
  }

  // Actualizar player
  static async update(id, { name, location }) {
    await db.query(
      `UPDATE player 
       SET name = $1, 
           location = $2, 
       WHERE id = $3`,
      [name, location, id]
    );
    return true;
  }

  // Eliminar player
  static async delete(id) {
    await db.query('DELETE FROM player WHERE id = $1', [id]);
    return true;
  }
}

module.exports = playerModel;