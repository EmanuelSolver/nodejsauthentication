import { getData, addInfo, removeInfo, updateInfo, getInfo } from '../controllers/activityController.js';
import { login, register, loginRequired } from '../controllers/userControllers.js';

const routes = (app) => {
    //todo routes
    app.route('/activity')
        .get(loginRequired, getData)
        .post(loginRequired, addInfo);

    app.route('/activity/:id')
        .put(loginRequired, updateInfo)
        .get(loginRequired, getInfo)
        .delete(loginRequired, removeInfo);

    // auth routes
    app.route('/auth/register')
        .post(register);

    app.route('/auth/login')
        .post(login);


};
export default routes;