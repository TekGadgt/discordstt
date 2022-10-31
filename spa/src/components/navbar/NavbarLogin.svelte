<script>
    import { onMount } from "svelte"
    import auth from "../../authService"
    import { isAuthenticated, user } from "../../store"

    let authClient

    onMount(async () => {
      authClient = await auth.createClient()
      isAuthenticated.set(await authClient.isAuthenticated())
      user.set(await authClient.getUser())
    })

    async function login() {
      await auth.loginWithPopup(authClient)
    }

    function logout() {
      auth.logout(authClient)
    }
</script>

{#if !$isAuthenticated}
  <a href="/#" on:click={login}>
    Login
  </a>
{:else}
  <a href="/#" on:click={logout}>
    Logout
  </a>
{/if}

<style>
  a {
    color: #999;
    font-weight: bolder;
    
  }

  a:hover {
    color: #BBB;
  }

</style>