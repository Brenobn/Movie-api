const knex = require("../database/knex");

class MoviesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;

    const [movieNotes_id] = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return {
        movieNotes_id,
        name,
        user_id
      }
    });

    await knex("tags").insert(tagsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const movieNotes = await knex("movieNotes").where({ id }).first();

    return response.json(movieNotes);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movieNotes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, description, tags } = request.query;

    const user_id = request.user.id;
 
    let movieNotes;

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());
      
      movieNotes = await knex("tags")
        .select([
          "movieNotes.id",
          "movieNotes.title",
          "movieNotes.description",
          "movieNotes.user_id",
        ])
        .where("movieNotes.user_id", user_id)
        .whereLike("movieNotes.title", `%${title}%`)
        .whereLike("movieNotes.description", `%${description}%`)
        .whereIn("name", filterTags)
        .innerJoin("movieNotes", "movieNotes.id", "tags.movieNotes_id")
        .orderBy("movieNotes.title")

    } else {
      movieNotes = await knex("movieNotes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    const movieNotesWithTags = movieNotes.map(note => {
      const movieNotesTags = userTags.filter(tag => tag.movieNotes_id === note.id);

      return{
        ...note,
        tags: movieNotesTags
      }
    });


    return response.json(movieNotesWithTags);
  }
}

module.exports = MoviesController;