<script>
  import { isAuthenticated, user } from "../../store"
</script>

{#if $isAuthenticated}
<a href="/">
  Account
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