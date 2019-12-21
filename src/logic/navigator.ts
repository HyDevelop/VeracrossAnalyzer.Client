export default class Navigator
{
    private activeIndex: string;
    private updateCallback: (() => void) | undefined;
    
    /**
     * Update index
     *
     * @param newIndex
     * @param title
     * @param history Record in history or not (Default true)
     */
    updateIndex(newIndex: string, title: string, history?: boolean)
    {
        // Call custom event
        if (this.updateCallback != null) this.updateCallback();

        // Null case
        if (history == null) history = true;

        // Record history or not
        if (history)
        {
            // Check url
            let url = `/#${newIndex}`;

            // Push history state
            window.history.pushState({lastTab: newIndex}, '', url);
        }

        // Update title
        document.title = 'Veracross Analyzer - ' + title;

        // Scroll to top
        window.scrollTo(0, 0);
    }
}
