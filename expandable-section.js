import {LitElement, html, css} from 'lit-element';

customElements.define("expandable-section", class extends LitElement {
    static get styles() {
        return [css`
        :host([hidden]) { display: none; }
        :host {
            display: block;
            overflow-y: hidden;
            transition: height 0.3s ease-in;
            height: 0;
        }
        `];
    }
    render() {
        return html`
        <slot></slot>
        `;
    }
    static get properties() {
        return {
            opened: {type: Boolean, attribute: true},
        }
    }
    attributeChangedCallback(name, oldval, newval) {
        if (name !== 'opened' || oldval === newval) return;
        if (oldval != null) this.collapse();
        else this.expand();
    }
    collapse() {
        // To handle the case of starting out open, we must make sure an
        // explicit height is set before collapsing.
        if (this.style.height === 'unset') {
            // Temporarily disable the transition.
            const transition = this.style.transition;
            this.style.transition = '';
            requestAnimationFrame(() => {
                this.expand();
                // And then re-enable it.
                requestAnimationFrame(() => {
                    this.style.transition = transition;
                    requestAnimationFrame(() => this.style.height = 0);
                });
            });
        } else this.style.height = 0;
    }
    expand() {
        // Have the element transition to the height of its inner content.
        this.style.height = this.scrollHeight + 'px';
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.getAttribute('opened') !== null) this.style.height = 'unset';
    }
});
