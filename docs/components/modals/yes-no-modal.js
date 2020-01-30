let t = document.createElement('template');
t.innerHTML =
`
<div id="yes-no-modal" class="modal">
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
    <button class="button is-success" id="yes-btn">
      Yes
    </button>
    <button class="button" id="no-btn">
      No
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

    show(title, question, yesCb, noCb){
        let el = document.getElementById('yes-no-modal');
        el.classList.add('is-active');

        let yesBtn = el.querySelectorAll('#yes-btn')[0];
        let noBtn = el.querySelectorAll('#no-btn')[0];
        let titleEl = el.querySelectorAll('.modal-card-title')[0];
        let questionEl = el.querySelectorAll('.modal-text')[0];

        console.log('yesCb');

        titleEl.innerText = title;
        questionEl.innerText = question;
        yesBtn.onclick = yesCb;
        noBtn.onclick = noCb;
    },

    hide(){
        let el = document.getElementById('yes-no-modal');
        el.classList.remove('is-active');
    }
};