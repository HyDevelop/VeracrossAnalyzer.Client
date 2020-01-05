import {FormatUtils} from '@/logic/utils/format-utils';
import pWaitFor from 'p-wait-for';
import App from '@/components/app/app';

export interface Index
{
    hash: string
    title?: string
    identifier: string
    info?: any
}

export default class NavController
{
    // Current index
    index: Index;

    // Callback
    updateCallback?: () => void;

    constructor()
    {
        // Create history state listener
        window.onpopstate = (e: any) =>
        {
            if (e.state)
            {
                // Restore previous tab
                //console.log(`onPopState: Current: ${this.index.hash}, Previous: ${e.state.hash}`);
                this.updateIndex(e.state, false);
            }
        };

        // Initialize
        this.init()
    }

    /**
     * Initialize from last location
     */
    private init()
    {
        if (window.location.hash == '#info') return;

        // Check history from last session
        if (window.history.state != undefined && window.history.state.hash != undefined)
        {
            // Last history exists
            this.index = window.history.state;
            return;
        }

        // Last history doesn't exist but hash url might exist
        let hash = window.location.hash.replace('#', '');

        // Check hash
        if (hash == '')
        {
            // No location info in url, set page to overall
            window.history.replaceState(this.convertIndex('overall'), '', '/#overall');
            this.updateIndex('overall', false);
            return;
        }

        // There is hash info in url
        let split = hash.split('/');

        // Not course -> don't know what to do with this url, so just refresh
        if (split[0] != 'course')
        {
            this.initClear();
            return;
        }

        // Is course -> Update index with placeholder title
        this.updateIndex({hash: hash, title: `Loading...`, identifier: 'course', info: {id: +split[1]}}, false);

        // Wait for courses to finish loading
        pWaitFor(() => App.instance != undefined && App.instance.assignmentsReady).then(() =>
        {
            // Find course
            let course = App.instance.courses.find(c => c.id == +split[1]);

            // This person has no such course, refresh to overall
            if (course == null)
            {
                this.initClear();
                return;
            }

            window.history.replaceState(course.urlIndex, '', '/#' + course.urlHash);
            this.updateIndex(course.urlIndex, false);
        })
    }

    private initClear()
    {
        window.location.hash = '';
        window.location.reload();
    }

    /**
     * Update index
     *
     * @param index Hash and title | Hash only
     * @param history Record in history or not (Default true)
     */
    updateIndex(index: Index | string, history: boolean = true)
    {
        index = this.convertIndex(index);

        // Call custom event
        if (this.updateCallback != null) this.updateCallback();

        // Record history or not
        if (history)
        {
            //console.log(`history: Current: ${this.index.hash}, New: ${index.hash}`);

            // Check url
            let url = `/#${index.hash}`;

            // Push history state
            window.history.pushState(index, '', url);
        }

        // Update title
        document.title = 'Veracross Analyzer - ' + index.title;

        // Scroll to top
        window.scrollTo(0, 0);

        // Update selected index
        this.index = index;
    }

    /**
     * Check index conversion
     *
     * @param index Hash and title | Hash only
     * @return Index Hash and title
     */
    private convertIndex(index: Index | string): Index
    {
        // Convert index format if it is hash only
        if (typeof index == 'string') index = {hash: index, identifier: index};
        if (index.title == null) index.title = FormatUtils.toTitleCase(index.hash);
        return index;
    }

    get id(): string
    {
        return this.index.identifier
    }

    get info(): any
    {
        return this.index.info
    }
}
