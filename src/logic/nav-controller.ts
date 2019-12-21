import {FormatUtils} from '@/logic/utils/format-utils';

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
        // Set history state
        let url = '/' + window.location.hash;
        if (url == '/' || url == '') url = '/#overall';
        window.history.replaceState(this.convertIndex('overall'), '', url);

        // Update initial index after loading is done
        // TODO: Test this
        //pWaitFor(() => this.courses.length > 1 && App.instance.loading != '').then(() =>
        this.updateIndex(url.substring(2), false);

        // Create history state listener
        window.onpopstate = (e: any) =>
        {
            if (e.state)
            {
                // Restore previous tab
                console.log(`onPopState: Current: ${JSON.stringify(this.index)}, Previous: ${JSON.stringify(e.state)}`);
                this.updateIndex(e.state, false);
            }
        };
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
