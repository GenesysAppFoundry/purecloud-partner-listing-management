let t = document.createElement('template');
t.innerHTML =
`
<div class="box devfoundry-note">
    <article class="media">
    <div class="media-content">
        <em>From:</em> <span class="from"></span>
        <br>
        <em>Timestamp:</em> <span class="note-timestamp"></span>
        <br>
        <em>Message:</em><br>
        <span class="devfoundry-note-message"></span>
    </div>
    </article>
</div>
`;

export default {
    new(note){
        let el = document.importNode(t.content, true);
        let elFrom = el.querySelectorAll('.from')[0];
        let elTimestamp = el.querySelectorAll('.note-timestamp')[0];
        let elNoteMessage = el.querySelectorAll('.devfoundry-note-message')[0];

        elFrom.innerText = note.user;
        elTimestamp.innerText = note.timestamp;
        elNoteMessage.innerText = note.message;

        return el;
    }
};