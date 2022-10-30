<script>
    import NavbarBrand from "./NavbarBrand.svelte";
    import NavbarGetStarted from "./NavbarGetStarted.svelte";
    import NavbarLogin from "./NavbarLogin.svelte";
</script>

<nav>
  <NavbarBrand />
  <NavbarLogin />
  <NavbarGetStarted />
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