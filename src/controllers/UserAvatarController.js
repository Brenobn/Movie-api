const knex = require("../database/knex");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const user = await knex("users")
      .where({ id: user_id }).first();
  }

}

module.exports = UserAvatarController;