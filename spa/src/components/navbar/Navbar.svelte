<script>
	import NavbarAccount from "./NavbarAccount.svelte";
    import NavbarBrand from "./NavbarBrand.svelte";
    import NavbarLogin from "./NavbarLogin.svelte";
</script>

<nav>
  <NavbarBrand />
  <NavbarAccount />
  <NavbarLogin />
</nav>

<style>
  nav {
    display: flex;
    padding: 2rem;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
  }

</style>