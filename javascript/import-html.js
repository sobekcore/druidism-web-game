// Javascript file to import HTML files into HTML

class HTMLInclude extends HTMLElement
{
  constructor()
  { super(); this.loadContent(); }

  async loadContent()
  {
    const source = this.getAttribute("src");
    if (!source)
    { throw new Error("No source attribute given."); }

    const response = await fetch(source);
    if (response.status !== 200)
    { throw new Error(`Could not load resource: ${source}`); }

    const content = await response.text();
    this.innerHTML = content;
  }
}

window.customElements.define("html-include", HTMLInclude);
