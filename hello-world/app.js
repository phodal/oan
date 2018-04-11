class HelloElement extends HTMLElement {
    constructor() {
        super();
        console.log(this)
        var shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML += `
		<style>
			#tabs { background-color: red; }
			span { color: purple; }
		</style>
		<div id="tabs">
			hello
		</div>
		<span>there</span>
		`;
    }
}

// Define the new element with the CustomElementsRegistry
customElements.define('hello-element', HelloElement);