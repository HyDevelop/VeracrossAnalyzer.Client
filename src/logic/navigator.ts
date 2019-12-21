
export interface Index
{
    hash: string
    title?: string
}

export default class Navigator
{
    private activeIndex: Index;
    private updateCallback?: () => void;

    /**
     * Update index
     *
     * @param index Hash and title
     * @param history Record in history or not (Default true)
     */
    updateIndex(index: Index, history?: boolean)
    {
        // Call custom event
        if (this.updateCallback != null) this.updateCallback();

        // Null case
        if (history == null) history = true;

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
