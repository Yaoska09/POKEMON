const playerModel = require('../models/playerModel');

const playerController = {
  getAll: async (req, res) => {
    try {
      const players = await playerModel.getAll();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const player = await playerModel.getById(req.params.id);
      if (!player) {
        return res.status(404).json({ error: 'player not found' });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: 'Error finding player ' });
    }
  },

  create: async (req, res) => {
    try {
      const { name, location } = req.body;

      const id = await playerModel.create({
        name,
        location
      });

      res.status(201).json({ id });
    } catch (error) {
      res.status(500).json({ error: 'Error creating player' });
    }
  },

  update: async (req, res) => {
    try {
      await playerModel.update(req.params.id, {
        name: req.body.name,
        location: req.body.location
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error updating player' });
    }
  },

  delete: async (req, res) => {
    try {
      await playerModel.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting player' });
    }
  }
};

module.exports = playerController;