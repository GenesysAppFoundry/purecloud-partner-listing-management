let t = document.createElement('template');
t.innerHTML =
`
<div id="loading-modal" class="modal">
<div class="modal-background"></div>
<div class="modal-content has-text-centered">
    <div class="fa-5x">
        <i class="fas fa-spinner fa-spin genOrange"></i>
    </div>
    <p class="loading-text genOrange">
        Testing
    </p>
</div>
</div>
`;

export default {
    new(){
        return document.importNode(t.content, true);
    },

    show(message){
        let el = document.getElementById('loading-modal');
        el.querySelectorAll('.loading-text')[0].innerText = message;
        el.classList.add('is-active');
    },

    hide(){
        let el = document.getElementById('loading-modal');
        el.classList.remove('is-active');
    }
};