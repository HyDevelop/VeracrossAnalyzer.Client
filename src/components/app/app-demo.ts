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

                app.$alert(
                    'This demo analyzes an offline snapshot of my data from Jun 6, 2020, ' +
                    'which displays my academic results from Junior year.<br/>' +
                    '<br/>' +
                    'Feel free to click around! 😇<br/>' +
                    '<br/>' +
                    '-- The Veracross Analyzer Team (YGui)<br/>' +
                    '-- Made with 🧡 in SJP',
                    '🥳 Welcome to VeracrossAnalyzer Demo!',
                    {dangerouslyUseHTMLString: true, confirmButtonText: 'OK'});
            })
        })
    }
}
