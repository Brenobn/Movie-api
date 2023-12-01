const knex = require("../database/knex");

class MoviesController {
  async create(request, response) {
    const { title, description, rating } = request.body;
    const { user_id } = request.params;

    const [movieNotes_id] = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id
    });

    response.json();
  }
}

module.exports = MoviesController;