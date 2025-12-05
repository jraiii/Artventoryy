<script lang="ts">
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  export let data: {
    stores: {
      id: string;
      storeName: string;
      address: string;
      contactNo: string;
    }[];
  };

  const currentPath = derived(page, ($page) => $page.url.pathname);

  let editing: string | null = null;
  let status: { success?: boolean; error?: string } | null = null;

  function logout() {
    window.location.href = '/login';
  }
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">
  <!-- Sidebar -->
  <aside class="md:flex flex-col bg-gradient-to-b from-pink-600 to-purple-700 text-white p-6 w-64 hidden md:block">
    <div class="flex items-center gap-2 mb-8">
      <div class="bg-white text-pink-500 font-bold rounded-full w-10 h-10 flex items-center justify-center">🏬</div>
      <h1 class="text-xl font-extrabold tracking-wide">Artventory</h1>
    </div>

    <nav class="flex-1 space-y-2">
      <a href="/dashboard" class="block px-4 py-2 rounded transition hover:bg-pink-500"
         class:bg-pink-500={$currentPath === '/dashboard'}>Dashboard</a>
      <a href="/products" class="block px-4 py-2 rounded transition hover:bg-pink-500"
         class:bg-pink-500={$currentPath === '/products'}>Products</a>
      <a href="/transactions" class="block px-4 py-2 rounded transition hover:bg-pink-500"
         class:bg-pink-500={$currentPath === '/transactions'}>Transactions</a>
      <a href="/stores" class="block px-4 py-2 rounded transition hover:bg-pink-500"
         class:bg-pink-500={$currentPath === '/stores'}>Stores</a>
    </nav>

    <button on:click={logout}
      class="mt-8 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold">
      Logout
    </button>
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-8 overflow-y-auto">
    <h1 class="text-2xl font-bold mb-6 text-white">🏬 Manage Stores</h1>

    <!-- Create store form -->
    <form method="POST" action="?/create" class="bg-white rounded-xl shadow-lg p-6 mb-6 space-y-4 max-w-lg">
      <div>
        <label for="storeName" class="block text-sm font-medium">Store Name</label>
        <input id="storeName" name="storeName" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-pink-500" />
      </div>
      <div>
        <label for="address" class="block text-sm font-medium">Address</label>
        <input id="address" name="address" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label for="contactNo" class="block text-sm font-medium">Contact Number</label>
        <input id="contactNo" name="contactNo" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" class="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded hover:opacity-90 transition">
        Add Store
      </button>
      {#if status?.error}
        <p class="text-red-600 text-sm">{status.error}</p>
      {/if}
      {#if status?.success}
        <p class="text-green-600 text-sm">Action successful!</p>
      {/if}
    </form>

    <!-- Store list -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Available Stores</h2>
      <ul class="divide-y">
        {#each data.stores as s}
          <li class="py-3">
            {#if editing === s.id}
              <!-- Edit form -->
              <form method="POST" action="?/update" class="flex flex-wrap gap-2 items-center">
                <input type="hidden" name="id" value={s.id} />
                <input name="storeName" value={s.storeName} class="border rounded px-2 py-1 focus:ring-2 focus:ring-pink-500" />
                <input name="address" value={s.address} class="border rounded px-2 py-1 focus:ring-2 focus:ring-purple-500" />
                <input name="contactNo" value={s.contactNo} class="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500" />
                <button type="submit" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Save</button>
                <button type="button" on:click={() => editing = null} class="bg-gray-300 px-2 py-1 rounded">Cancel</button>
              </form>
            {:else}
              <!-- Display store -->
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{s.storeName}</p>
                  <p class="text-sm text-gray-500">{s.address}</p>
                  <p class="text-xs text-gray-400">Contact: {s.contactNo}</p>
                </div>
                <div class="flex gap-2">
                  <button type="button" on:click={() => editing = s.id}
                    class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <form method="POST" action="?/delete" class="inline">
                    <input type="hidden" name="id" value={s.id} />
                    <button type="submit"
                      class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </main>
</div>
