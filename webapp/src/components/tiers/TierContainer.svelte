<script>
  export let price;
  export let blurb;
  export let bullets;
</script>

<div class="tier-container">
  <div class="price-container">
    <span class="tier-price"><span>$</span>{price}</span>
  </div>
  <hr>
  <p>{blurb}</p>
  <ul>
    {#each bullets as bullet}
      <li>{bullet}</li>
    {/each}
  </ul>
  <button>{price > 0 ? "Subscribe" : "Sign Up"}</button>
</div>

<style> 
  h3 {
    text-transform: uppercase;
    font-weight: initial;
    font-size: larger;
  }

  hr {
    width: 80%;
  }

  p {
    text-align: center;
  }

  ul {
    width: 100%;
    max-width: 300px;
    padding: 1rem 2rem;
    margin: auto;
  }

  button {
    margin: 3rem auto;
    justify-self: end;
    border-radius: 5000px;
    background-color: var(--ltpurple);
    border: none;
    padding: 0.5rem;
    min-width: 100px;
    color: #fff;
    font-weight: bold;
  }

  button:hover {
    background-color: var(--pink);
    box-shadow: 0px 3px 5px #333; 
  }

  button:active {
    transform: translateY(3px);
  }

  .tier-container {
    background-color: #72767a1c;
    box-shadow: 0px 10px 30px rgb(26 26 26);
    min-width: 400px;
    display: flex;
    flex-direction: column;
  }

  .price-container {
    position: relative;
    text-align: center;
  }

  .tier-price {
    font-size: 6rem;
    cursor: default;
    font-weight: bold;
  }

  .tier-price > span {
    font-size: 2rem;
  }
</style>