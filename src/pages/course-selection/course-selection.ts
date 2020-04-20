import {Component, Prop, Vue} from 'vue-property-decorator'
import App from '@/components/app/app';
import CourseInfo, {ClassInfo, UniqueCourse} from '@/logic/course-info';
import {GPAUtils} from '@/logic/utils/gpa-utils';
import SearchSettings from '@/pages/course-selection/search-settings/search-settings.vue';

@Component({components: {SearchSettings}})
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

                this.courseInfo.sort((one, two) => one.name.localeCompare(two.name))
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

    get settings(): SearchSettings
    {
        return <SearchSettings> this.$refs['settings'];
    }

    get filteredCourses()
    {
        let year = GPAUtils.getSchoolYear();

        return this.courseInfo.filter(c =>
            c.uniqueName.toLowerCase().includes(this.search.toLowerCase()) &&
            c.level != null && c.level !== 'Club' && c.level !== 'Sport' && c.level !== 'None' &&
            c.year == year && c.gradeLevels.includes(this.app.user.gradeLevel + 1));
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

        return list;
    }

    get nextYearGradeLevel()
    {
        return GPAUtils.gradeLevelName(this.app.user.gradeLevel + 1)
    }
}
