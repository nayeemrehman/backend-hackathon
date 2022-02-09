const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/engagement.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const { createEngagement } = require('../../validations/engagement.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('engagementId', controller.load);

router.route('/todaysengagement').get(authorize(), controller.todaysengagement);

router.route('/saveResponse').post(authorize(), controller.saveResponse);

router.route('/getScoreAndRecentActivities').get(authorize(), controller.getScoreAndRecentActivities);

router.route('/getScoreAndAllActivities').get(authorize(), controller.getScoreAndAllActivities);

router.route('/dashboardDetails').get(authorize(ADMIN), controller.dashboardDetails);

router
  .route('/')
  .get(authorize(ADMIN), controller.list)
  .post(authorize(ADMIN), validate(createEngagement), controller.create);

router
  .route('/:engagementId')
  /**
   * @api {get} v1/users/:id Get User
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize(), controller.get);
//   /**
//    * @api {put} v1/users/:id Replace User
//    * @apiDescription Replace the whole user document with a new one
//    * @apiVersion 1.0.0
//    * @apiName ReplaceUser
//    * @apiGroup User
//    * @apiPermission user
//    *
//    * @apiHeader {String} Authorization   User's access token
//    *
//    * @apiParam  {String}             email     User's email
//    * @apiParam  {String{6..128}}     password  User's password
//    * @apiParam  {String{..128}}      [name]    User's name
//    * @apiParam  {String=user,admin}  [role]    User's role
//    * (You must be an admin to change the user's role)
//    *
//    * @apiSuccess {String}  id         User's id
//    * @apiSuccess {String}  name       User's name
//    * @apiSuccess {String}  email      User's email
//    * @apiSuccess {String}  role       User's role
//    * @apiSuccess {Date}    createdAt  Timestamp
//    *
//    * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
//    * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
// eslint-disable-next-line max-len
//    * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
//    * @apiError (Not Found 404)    NotFound     User does not exist
//    */
//   .put(authorize(LOGGED_USER), validate(replaceUser), controller.replace)
//   /**
//    * @api {patch} v1/users/:id Update User
//    * @apiDescription Update some fields of a user document
//    * @apiVersion 1.0.0
//    * @apiName UpdateUser
//    * @apiGroup User
//    * @apiPermission user
//    *
//    * @apiHeader {String} Authorization   User's access token
//    *
//    * @apiParam  {String}             email     User's email
//    * @apiParam  {String{6..128}}     password  User's password
//    * @apiParam  {String{..128}}      [name]    User's name
//    * @apiParam  {String=user,admin}  [role]    User's role
//    * (You must be an admin to change the user's role)
//    *
//    * @apiSuccess {String}  id         User's id
//    * @apiSuccess {String}  name       User's name
//    * @apiSuccess {String}  email      User's email
//    * @apiSuccess {String}  role       User's role
//    * @apiSuccess {Date}    createdAt  Timestamp
//    *
//    * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
//    * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
// eslint-disable-next-line max-len
//    * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
//    * @apiError (Not Found 404)    NotFound     User does not exist
//    */
//   .patch(authorize(LOGGED_USER), validate(updateUser), controller.update)
//   /**
//    * @api {patch} v1/users/:id Delete User
//    * @apiDescription Delete a user
//    * @apiVersion 1.0.0
//    * @apiName DeleteUser
//    * @apiGroup User
//    * @apiPermission user
//    *
//    * @apiHeader {String} Authorization   User's access token
//    *
//    * @apiSuccess (No Content 204)  Successfully deleted
//    *
//    * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
// eslint-disable-next-line max-len
//    * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
//    * @apiError (Not Found 404)    NotFound      User does not exist
//    */
//   .delete(authorize(LOGGED_USER), controller.remove);
// router
//   .route('/:engagementId/guesswho')
//   .get(authorize(), controller.guesswho);

module.exports = router;
