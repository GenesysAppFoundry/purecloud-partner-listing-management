/**
 * Helper function to fill the fields. Yep
 */

export default {
    inputTextFill(el_id, text){
        document
            .getElementById(el_id)
            .querySelectorAll('input')[0].value = text;
    },

    textAreaFill(el_id, text){
        document
        .getElementById(el_id)
        .querySelectorAll('textarea')[0].value = text;
    },

    checkBoxesFill(cb_class, items){
        let cbs = document.getElementsByClassName(cb_class);
        for(let i = 0; i < cbs.length; i++){
            let cb = cbs.item(i);
            if(items.includes(cb.value)){
                cb.checked = true;
            } else {
                cb.checked = false;
            }
        }
    }

}