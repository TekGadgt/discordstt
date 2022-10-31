<script>
  import { isAuthenticated, user } from "../../store"
  
</script>

<main>
  {#if $isAuthenticated}
    {$user.name}
  {/if}
</main>