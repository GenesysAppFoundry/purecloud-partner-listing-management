let t = document.createElement('template');
t.innerHTML =
`
<div id="info-modal" class="modal">
<div class="modal-background"></div>
<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">Confirmation</p>
    <button class="delete" aria-label="close" onclick="hideCreationModal()"></button>
  </header>
  <section class="modal-card-body">
    <p class='modal-text'>Question</p>
  </section>
  <footer class="modal-card-foot">
    <button class="button is-success ok-btn">
      Ok
    </button>
  </footer>
</div>
</button>
</div>
`;

export default {
    new(){
        return document.importNode(t.content, true);
    },

    show(title, message, cb){
        let el = document.getElementById('info-modal');
        el.classList.add('is-active');

        let okBtn = el.querySelectorAll('.ok-btn')[0];
        let titleEl = el.querySelectorAll('.modal-card-title')[0];
        let messageEl = el.querySelectorAll('.modal-text')[0];

        titleEl.innerText = title;
        messageEl.innerText = message;
        okBtn.onclick = cb;
    },

    hide(){
        let el = document.getElementById('info-modal');
        el.classList.remove('is-active');
    }
};