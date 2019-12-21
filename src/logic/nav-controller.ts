import {FormatUtils} from '@/logic/utils/format-utils';

export interface Index
{
    hash: string
    title?: string
}

export default class NavController
{
    activeIndex: Index;
    updateCallback?: () => void;

    constructor()
    {
        // Set history state
        let url = '/' + window.location.hash;
        if (url == '/' || url == '') url = '/#overall';
        window.history.replaceState({lastTab: url.substring(1)}, '', url);

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
                console.log(`onPopState: Current: ${this.activeIndex}, Previous: ${e.state.lastTab}`);
                this.updateIndex(e.state.lastTab, false);
            }
        };
    }

    /**
     * Update index
     *
     * @param index Hash and title | Hash only
     * @param history Record in history or not (Default true)
     */
    updateIndex(index: Index | string, history?: boolean)
    {
        // Convert index format if it is hash only
        if (typeof index == 'string') index = {hash: index};

        // Call custom event
        if (this.updateCallback != null) this.updateCallback();

        // Null case
        if (history == null) history = true;
        if (index.title == null) index.title = FormatUtils.toTitleCase(index.hash);

        // Record history or not
        if (history)
        {
            // Check url
            let url = `/#${index.hash}`;

            // Push history state
            window.history.pushState({lastTab: index}, '', url);
        }

        // Update title
        document.title = 'Veracross Analyzer - ' + index.title;

        // Scroll to top
        window.scrollTo(0, 0);
    }
}
