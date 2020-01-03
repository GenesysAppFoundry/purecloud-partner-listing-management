let t = document.createElement('template');
t.innerHTML =
`
<div class="box">
    <article class="media">
    <div class="media-content">
        <div class="content">
        <p>
            On Queue: <small><span class="email-duration">31m</span></small>
            <br>
            From: <strong><span class="sender-name">John Smith</span></strong> <small><span class="sender-email">email@email.com</span></small> 
            <br>
            Subject: <strong><span class="email-subject">Subject</span></strong>
            <br>
            <div class="email-body">
                Description of Listing
            </div>
        </p>
        </div>
        <div>
            <a class="button is-dark btn-assign" onclick="assignEmailToAgent()">Assign To Me</a>
        </div>
    </div>
    </article>
</div>
`;

export default {
    new(){
        return document.importNode(t.content, true);
    }
};;