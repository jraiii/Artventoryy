<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';
  import type { ActionResult } from '@sveltejs/kit';

  export let data: {
    products: { id: string; productName: string; price: string; stockQty: number; categoryId: string; imageUrl?: string }[];
    categories: { id: string; name: string }[];
  };

  let status: { success?: boolean; error?: string } | null = null;
  let editing: string | null = null;
  let mobileMenuOpen = false;

  const currentPath = derived(page, ($page) => $page.url.pathname);

  function logout() {
    window.location.href = '/login';
  }

  function handleEnhance(form: HTMLFormElement) {
    return enhance(form, async (...args) => {
      const result = args[1] as ActionResult;
      if (result?.type === 'success') {
        status = result.data as typeof status;
        editing = null;
      }
    });
  }

  function getCategoryName(id: string) {
    return data.categories.find((c) => c.id === id)?.name ?? 'Unknown';
  }
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">
  <!-- Sidebar -->
  <aside class={`md:flex flex-col bg-gradient-to-b from-pink-600 to-purple-700 text-white p-6 w-64 ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
    <div class="flex items-center gap-2 mb-8">
      <div class="bg-white text-pink-500 font-bold rounded-full w-10 h-10 flex items-center justify-center">🖌</div>
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
    <h1 class="text-2xl font-bold mb-6 text-white">Manage Products</h1>

    <!-- Create product form -->
    <form method="POST" action="?/create" use:handleEnhance enctype="multipart/form-data"
      class="bg-white rounded-xl shadow-lg p-6 mb-6 space-y-4 max-w-lg">
      <div>
        <label for="productName" class="block text-sm font-medium">Product Name</label>
        <input id="productName" name="productName" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-pink-500" />
      </div>
      <div>
        <label for="price" class="block text-sm font-medium">Price</label>
        <input id="price" name="price" type="number" step="0.01" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label for="stockQty" class="block text-sm font-medium">Stock Quantity</label>
        <input id="stockQty" name="stockQty" type="number" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label for="categoryId" class="block text-sm font-medium">Category</label>
        <select id="categoryId" name="categoryId" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500">
          {#each data.categories as c}
            <option value={c.id}>{c.name}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="image" class="block text-sm font-medium">Product Image</label>
        <input id="image" name="image" type="file" accept="image/*"
          class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
      </div>
      <button type="submit" class="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded hover:opacity-90 transition">
        Add Product
      </button>
      {#if status?.error}
        <p class="text-red-600 text-sm">{status.error}</p>
      {/if}
      {#if status?.success}
        <p class="text-green-600 text-sm">Action successful!</p>
      {/if}
    </form>

    <!-- Product list -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Available Products</h2>
      <ul class="divide-y">
        {#each data.products as p}
          <li class="py-3">
            {#if editing === p.id}
              <!-- Edit form -->
              <form method="POST" action="?/update" use:handleEnhance enctype="multipart/form-data" class="flex flex-wrap gap-2 items-center">
                <input type="hidden" name="id" value={p.id} />
                <input name="productName" value={p.productName} class="border rounded px-2 py-1 focus:ring-2 focus:ring-pink-500" />
                <input name="price" type="number" step="0.01" value={p.price} class="border rounded px-2 py-1 w-24 focus:ring-2 focus:ring-purple-500" />
                <input name="stockQty" type="number" value={p.stockQty} class="border rounded px-2 py-1 w-20 focus:ring-2 focus:ring-blue-500" />
                <select name="categoryId" class="border rounded px-2 py-1 focus:ring-2 focus:ring-green-500">
                  {#each data.categories as c}
                    <option value={c.id} selected={c.id === p.categoryId}>{c.name}</option>
                  {/each}
                </select>
                <input name="image" type="file" accept="image/*" class="border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500" />
                <button type="submit" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Save</button>
                <button type="button" on:click={() => editing = null} class="bg-gray-300 px-2 py-1 rounded">Cancel</button>
              </form>
            {:else}
              <!-- Display product -->
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                  {#if p.imageUrl}
                    <img src={p.imageUrl} alt={p.productName} class="w-16 h-16 object-cover rounded" />
                  {:else}
                    <span class="text-gray-400">No image</span>
                  {/if}
                  <div>
                    <p class="font-medium">{p.productName}</p>
                    <p class="text-sm text-gray-500">₱{p.price} — Stock: {p.stockQty}</p>
                    <p class="text-xs text-gray-400">Category: {getCategoryName(p.categoryId)}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button type="button" on:click={() => editing = p.id}
                    class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <form method="POST" action="?/delete" use:handleEnhance class="inline">
                    <input type="hidden" name="id" value={p.id} />
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
