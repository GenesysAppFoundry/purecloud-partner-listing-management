let t = document.createElement('template');
t.innerHTML =
`
<div id="listing-creation-modal" class="modal">
<div class="modal-background"></div>
<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">Create New Listing</p>
    <button class="delete" aria-label="close" onclick="hideCreationModal()"></button>
  </header>
  <section class="modal-card-body">
    <p>App Name</p>
    <div class="control has-icons-right">
      <input id="new-listing-name" class="input" type="text" placeholder="My Amazing App">
      <span class="icon is-small is-right">
        <i class="fas fa-check"></i>
      </span>
    </div>
  </section>
  <footer class="modal-card-foot">
    <button class="button is-success" id="btn-create-listing">
      Create
    </button>
    <button class="button" onclick="hideCreationModal()">
      Cancel
    </button>
  </footer>
</div>
</button>
</div>
`;

export default {
    new(){
        // Crete element
        const element = document.importNode(t.content, true);

        // Child references
        const createBtn = element.getElementById('btn-create-listing');
        const inputName = element.getElementById('new-listing-name');

        // Create a new listing
        createBtn.addEventListener('click', function(){
            createNewListing(inputName.value);
        });

        return element;
    }
};