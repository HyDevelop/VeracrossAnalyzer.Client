import {Component, Prop, Vue} from 'vue-property-decorator'
import App from '@/components/app/app';
import CourseInfo, {ClassInfo, UniqueCourse} from '@/logic/course-info';
import {GPAUtils} from '@/logic/utils/gpa-utils';
// @ts-ignore
import SearchSettingsComponent, {SearchSettings} from '@/pages/course-selection/pages/search-settings.vue';
import Welcome from '@/pages/course-selection/pages/welcome.vue';
import CourseDetail from '@/pages/course-selection/pages/course-detail.vue';

@Component({components: {SearchSettings: SearchSettingsComponent, Welcome, CourseDetail}})
export default class CourseSelection extends Vue
{
    @Prop({required: true}) app: App

    search: string = ''
    courseInfo: CourseInfo[] = []
    courseIdIndex: any = {} // Map<CourseID, index in courseInfo>
    directory: {gradeLevel: number, classes: string}[] = []
    classes: ClassInfo[] = []
    loading = true

    courseListHeight: number = 0;
    cardsHeight: number = 0;

    openedPage: string = '';
    settings: SearchSettings = new SearchSettings();
    activeCourse: UniqueCourse = new UniqueCourse('', [], -1);

    /**
     * Called before rendering
     */
    created()
    {
        // Update width dynamically
        window.addEventListener('resize', this.updateHeight);

        // Get courses
        App.http.post('/course-info', {}).then(result =>
        {
            if (result.success)
            {
                // Parse data
                this.classes = result.data.classes.map((json: any) => new ClassInfo(json));
                this.courseInfo = result.data.courseInfos.map((json: any, index: number) =>
                {
                    let info = new CourseInfo(json);

                    // Index
                    info.courseIds.forEach(id =>
                    {
                        this.courseIdIndex[id] = index;

                        // Add class info into course
                        let classInfo = this.classes.find(c => c.id == id)
                        if (classInfo == null) return;
                        info.classes.push(classInfo);
                    });
                    return info;
                });
                this.directory = result.data.studentInfos;

                // Use directory data
                this.directory.forEach(d =>
                {
                    d.classes.split('|').forEach(classId =>
                    {
                        // Get info by class id
                        let info = this.courseInfo[this.courseIdIndex[+classId]];
                        if (info as any != null)
                        {
                            // Add grade level
                            if (!info.gradeLevels.includes(d.gradeLevel))
                            {
                                info.gradeLevels.push(d.gradeLevel);
                            }

                            // Count enrollments
                            info.enrollments ++;
                        }
                    })
                })
            }
        });
    }

    /**
     * Called on destroy
     */
    destroyed()
    {
        // Remove width updater
        window.removeEventListener('resize', this.updateHeight);
    }

    /**
     * Called on vue update
     */
    updated()
    {
        this.updateHeight()
    }

    /**
     * Update header height. (CSS doesn't work)
     */
    updateHeight()
    {
        // Get element
        let cl = this.$refs.cl as Vue;
        if (cl as any == null) return;
        let el = cl.$el;

        // Calculate height
        this.cardsHeight = window.innerHeight - el.getBoundingClientRect().top - 20;
        this.courseListHeight = this.cardsHeight - 15 - 102;
    }

    /**
     * Open the settings page.
     */
    openSettings()
    {
        this.openedPage = this.openedPage == 'settings' ? '' : 'settings';
    }

    /**
     * Open course page.
     */
    openCourse(course: UniqueCourse)
    {
        if (this.activeCourse == course)
        {
            this.openedPage = '';
            this.activeCourse = null as any as UniqueCourse;
        }
        else
        {
            this.activeCourse = course;
            this.openedPage = 'course'
        }
    }

    get filteredCourses()
    {
        let year = GPAUtils.getSchoolYear();

        return this.courseInfo.filter(c =>
            c.uniqueName.toLowerCase().includes(this.search.toLowerCase()) &&
            c.level != null && this.settings.levels.includes(c.level) &&
            c.year == year &&
            (this.settings.showAllCourses || c.gradeLevels.includes(this.app.user.gradeLevel + 1))
        )
    }

    /**
     * Gets unique courses by name, even though many different teachers might teach it.
     */
    get uniqueCourses(): UniqueCourse[]
    {
        let names: string[] = [];
        let list: UniqueCourse[] = [];

        this.filteredCourses.forEach(c =>
        {
            // Create the course list if doesn't exist
            if (!names.includes(c.uniqueName))
            {
                names.push(c.uniqueName);
                list.push(new UniqueCourse(c.uniqueName, [], 0))
            }

            // Add the course
            list[names.indexOf(c.uniqueName)].courses.push(c);
            list[names.indexOf(c.uniqueName)].enrollments += c.enrollments;
        })

        // Sorting
        switch (this.settings.sortBy)
        {
            case 'Popularity':
            {
                list.sort((a, b) => b.enrollments - a.enrollments);
                break
            }
            default:
            {
                list.sort((a, b) => a.name.localeCompare(b.name));
                break
            }
        }

        return list;
    }
}
