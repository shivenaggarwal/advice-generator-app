'use strict';

(function(){
    const button = document.querySelector('[data-action="refresh"]');
    const adviceId = document.querySelector('[data-bind="advice-id"]');
    const quote = document.querySelector('[data-bind="quote"]');

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ANIMATION_TIMEOUT = prefersReducedMotion.matches ? 0 : 600;

    function setNewAdvice({id, advice}){
        adviceId.textContent = id;
        quote.textContent = advice;

        animateIn();
    }

    function displayErrorMessage(errorMessage){
        quote.textContent= errorMessage;
        quote.classList.add("has-error");

        animateIn();
}

function hideErrorMessage() {
    quote.classList.remove("has-error");
  }

function animateIn() {
    quote.classList.replace("slide-out-x", "slide-in-x");
    adviceId.classList.replace("slide-out-y", "slide-in-y");

    setTimeout(() => {
      quote.classList.remove("slide-in-x");
      adviceId.classList.remove("slide-in-y");
    }, ANIMATION_TIMEOUT);
  }

function animateOut() {
    return new Promise((resolve) => {
      quote.classList.add("slide-out-x");
      adviceId.classList.add("slide-out-y");
      button.classList.add("spin");

      setTimeout(() => {
        resolve();
        button.classList.remove("spin");
      }, ANIMATION_TIMEOUT);
    });
  }


   async function fetchAdvice(){
       try {
        const response = await fetch('https://api.adviceslip.com/advice',{
            cache:"reload"
        });

        if(response.ok){
            const json= await response.json();
            console.log(json);

            hideErrorMessage();
            setNewAdvice(json.slip);
        }
            else {
                throw new Error(
                  `Could not fetch advice (${response.status} - ${response.statusText}). Please try again later.`
                );
            console.log('Failed to Load');
        }

       } catch (ex) {
        console.log(ex);
        displayErrorMessage(ex.message);
       }
    }

    function handleClick(){
        animateOut().then(fetchAdvice);        
    }

    button.addEventListener('click', handleClick);

    fetchAdvice();
})();