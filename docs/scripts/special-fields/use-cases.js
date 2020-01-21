import useCaseTemplate from '../templates/use-case.js';
/**
 * All the things that deals with the use cases dynamic 'special' field.
 */

// NOTE: Just in case it's needed in the future. 
// Maximum is already implemented and will alert when reached.
const maximumUseCases = 1000;

// Globals 

function addUseCase(){

}

export default {
    setup(){
        document.getElementById('btn-add-useCase')
        .addEventListener('click', function(){
            addUseCase();
        });
    },
    
}   