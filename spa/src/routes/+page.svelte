<script>
  import TierContainer from "../components/tiers/TierContainer.svelte"
  import Account from "../components/account/Account.svelte"
  import { user, isAuthenticated } from "../store"
</script>

<main>
  {#if $isAuthenticated}
    <Account />
  {:else}
    <div class="tiers">
      <TierContainer price={0} blurb="Our free tier." bullets={[
        ""
      ]} />
      <TierContainer price={5} blurb="Our premium tier." bullets={[
        "Everything included in the free tier, plus...",
        "Enhanced Speech-to-Text"
      ]} />
    </div>
  {/if}
</main>

<style>
  .tiers {
    display: flex;
    justify-content: space-around;
    padding: 6rem;
    flex-wrap: wrap;
    height: 100%;
  }
</style>