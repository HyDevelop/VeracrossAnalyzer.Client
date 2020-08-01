import LoginUser from '@/logic/login-user';
import App from '@/components/app/app';
import pWaitFor from 'p-wait-for';

export default class AppDemo
{
    static loadDemo(app: App)
    {
        app.logLoading('1. Logging in...')
        App.http.get('./demo-data/token.json').then(response =>
        {
            app.user = new LoginUser(response.data)
            app.courses = app.user.courses

            app.logLoading('1. Loading assignments...')
            app.courses.forEach(course =>
            {
                App.http.get(`./demo-data/assignments-${course.assignmentsId}.json`).then(response =>
                {
                    course.loadAssignments(response.data);
                })
            })

            pWaitFor(() => app.courses.every(c => c.rawAssignments)).then(() =>
            {
                app.gradedCourses = app.courses.filter(c => c.isGraded)
                app.gradedCourses.forEach(c => [0, 1, 2, 3].forEach(i => c.termGrading[i] = {method: 'TOTAL_MEAN', weightingMap: {}}))
                app.logLoading('');
                app.assignmentsReady = true
                app.showRating = true
            })
        })
    }
}
