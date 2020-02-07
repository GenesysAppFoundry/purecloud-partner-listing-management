import config from '../../../config/config.js';

let t = document.createElement('template');
t.innerHTML =
`<div class="hero-head">
<nav class="navbar">
  <div class="container">
    <div class="navbar-brand">
      <a href="${config.redirectUriBase}" class="navbar-item">
        <img src="${config.globalAssetsURL}img/logo.png" alt="Logo" id="logo">
      </a>
      <span class="navbar-burger burger" data-target="navbarMenuHeroB">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>
    <div id="navbarMenuHeroB" class="navbar-menu">
      <div class="navbar-end">
        <span class="navbar-item">
          <a href="${window.location.href}">
            <i class="fas fa-sync-alt"></i>
          </a>
        </span>
      </div>
    </div>
  </div>
</nav>
</div>
`;

export default {
    new(){
      let el = document.importNode(t.content, true);
      return el;
    }
};