import { getAll, removeStudent, updateInfo, getInfo } from '../controllers/activityController.js';
import { login, register, loginRequired } from '../controllers/userControllers.js';

const routes = (app) => {
    //Restricted routes, you have to login first
    app.route('/activity')
        .get(loginRequired, getAll)
        .delete(loginRequired, removeStudent)

    app.route('/activity/:id')
        .put(loginRequired, updateInfo)
        .get(loginRequired, getInfo)
  

    // open routes
    app.route('/auth/register')
        .post(register);

    app.route('/auth/login')
        .post(login);


};
export default routes;