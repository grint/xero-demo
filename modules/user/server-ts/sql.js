// Helpers
import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';
import bcrypt from 'bcryptjs';
import { knex, returnId } from '@gqlapp/database-server-ts';

// Actual query fetching and transformation in DB
class User {
  async getUsers(orderBy, filter) {
    const queryBuilder = knex
      .select(
        'u.id as id',
        'u.username as username',
        'u.role',
        'u.is_active',
        'u.email as email',
        'up.first_name as first_name',
        'up.last_name as last_name',
        'ca.serial'
      )
      .from('user AS u')
      .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
      .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id');

    // add order by
    if (orderBy && orderBy.column) {
      let column = orderBy.column;
      let order = 'asc';
      if (orderBy.order) {
        order = orderBy.order;
      }

      queryBuilder.orderBy(decamelize(column), order);
    }

    // add filter conditions
    if (filter) {
      if (has(filter, 'role') && filter.role !== '') {
        queryBuilder.where(function() {
          this.where('u.role', filter.role);
        });
      }

      if (has(filter, 'isActive') && filter.isActive !== null) {
        queryBuilder.where(function() {
          this.where('u.is_active', filter.isActive);
        });
      }

      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder.where(function() {
          this.where(knex.raw('LOWER(??) LIKE LOWER(?)', ['username', `%${filter.searchText}%`]))
            .orWhere(knex.raw('LOWER(??) LIKE LOWER(?)', ['email', `%${filter.searchText}%`]))
            .orWhere(knex.raw('LOWER(??) LIKE LOWER(?)', ['first_name', `%${filter.searchText}%`]))
            .orWhere(knex.raw('LOWER(??) LIKE LOWER(?)', ['last_name', `%${filter.searchText}%`]));
        });
      }
    }

    return camelizeKeys(await queryBuilder);
  }

  async getUser(id) {
    return camelizeKeys(
      await knex
        .select(
          'u.id',
          'u.username',
          'u.role',
          'u.is_active',
          'u.email',
          'up.first_name',
          'up.last_name',
          'ca.serial'
        )
        .from('user AS u')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithPassword(id) {
    return camelizeKeys(
      await knex
        .select(
          'u.id',
          'u.username',
          'u.password_hash',
          'u.role',
          'u.is_active',
          'u.email',
          'up.first_name',
          'up.last_name'
        )
        .from('user AS u')
        .where('u.id', '=', id)
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .first()
    );
  }

  async getUserWithSerial(serial) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.role', 'u.is_active', 'ca.serial', 'up.first_name', 'up.last_name')
        .from('user AS u')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .where('ca.serial', '=', serial)
        .first()
    );
  }

  register({ username, email, role = 'user', isActive }, passwordHash) {
    return knex('user')
      .returning('id')
      .insert(decamelizeKeys({ username, email, role, passwordHash, isActive }));
  }

  editUser({ id, username, email, role, isActive }, passwordHash) {
    const localAuthInput = passwordHash ? { email, passwordHash } : { email };
    return knex('user')
      .update(decamelizeKeys({ username, role, isActive, ...localAuthInput }))
      .where({ id });
  }

  async isUserProfileExists(userId) {
    return !!(await knex('user_profile')
      .count('id as count')
      .where(decamelizeKeys({ userId }))
      .first()).count;
  }

  editUserProfile({ id, profile }, isExists) {
    if (isExists) {
      return knex('user_profile')
        .update(decamelizeKeys(profile))
        .where({ user_id: id });
    } else {
      return returnId(knex('user_profile')).insert({ ...decamelizeKeys(profile), user_id: id });
    }
  }

  async editAuthCertificate({
    id,
    auth: {
      certificate: { serial }
    }
  }) {
    const userProfile = await knex
      .select('id')
      .from('auth_certificate')
      .where({ user_id: id })
      .first();

    if (userProfile) {
      return knex('auth_certificate')
        .update({ serial })
        .where({ user_id: id });
    } else {
      return returnId(knex('auth_certificate')).insert({ serial, user_id: id });
    }
  }

  deleteUser(id) {
    return knex('user')
      .where('id', '=', id)
      .del();
  }

  async updatePassword(id, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 12);

    return knex('user')
      .update({ password_hash: passwordHash })
      .where({ id });
  }

  updateActive(id, isActive) {
    return knex('user')
      .update({ is_active: isActive })
      .where({ id });
  }

  async getUserByEmail(email) {
    return camelizeKeys(
      await knex
        .select(
          'u.id',
          'u.username',
          'u.password_hash',
          'u.role',
          'u.is_active',
          'u.email',
          'up.first_name',
          'up.last_name'
        )
        .from('user AS u')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .where({ email })
        .first()
    );
  }

  async getUserByUsername(username) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.role', 'u.is_active', 'u.email', 'up.first_name', 'up.last_name')
        .from('user AS u')
        .where('u.username', '=', username)
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .first()
    );
  }

  async getUserByUsernameOrEmail(usernameOrEmail) {
    return camelizeKeys(
      await knex
        .select(
          'u.id',
          'u.username',
          'u.password_hash',
          'u.role',
          'u.is_active',
          'u.email',
          'up.first_name',
          'up.last_name'
        )
        .from('user AS u')
        .where('u.username', '=', usernameOrEmail)
        .orWhere('u.email', '=', usernameOrEmail)
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .first()
    );
  }
}
const userDAO = new User();

export default userDAO;
