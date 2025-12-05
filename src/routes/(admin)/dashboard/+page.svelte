<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  type Product = { id: string; name: string; price: string; description?: string; imageUrl?: string };
  type Store = { id: string; name: string };

  export let data: { products: Product[]; stores: Store[]; transactions?: any[] };

  let mobileMenuOpen = false;

  // Track current path for active link highlighting
  const currentPath = derived(page, ($page) => $page.url.pathname);

  function logout() {
    window.location.href = '/login';
  }

  let chartCanvas: HTMLCanvasElement;

  onMount(() => {
    if (chartCanvas) {
      new Chart(chartCanvas, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Sales (₱)',
              data: [12000, 15000, 10000, 18000, 22000, 17000], // sample data
              borderColor: '#ec4899',
              backgroundColor: 'rgba(236,72,153,0.2)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  });
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">
  <!-- Sidebar -->
  <aside class={`md:flex flex-col bg-gradient-to-b from-pink-600 to-purple-700 text-white p-6 w-64 ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
    <div class="flex items-center gap-2 mb-8">
      <div class="bg-white text-pink-500 font-bold rounded-full w-10 h-10 flex items-center justify-center">🎨</div>
      <h1 class="text-xl font-extrabold tracking-wide">Artventory</h1>
    </div>

    <nav class="flex-1 space-y-2">
      <a href="/dashboard"
         class="block px-4 py-2 rounded transition hover:bg-pink-500"
         class:bg-pink-500={$currentPath === '/dashboard'}>Dashboard</a>
      <a href="/products"
         class="block px-4 py-2 rounded transition hover:bg-pink-500"
         class:bg-pink-500={$currentPath === '/products'}>Products</a>
      <a href="/transactions"
         class="block px-4 py-2 rounded transition hover:bg-pink-500"
         class:bg-pink-500={$currentPath === '/transactions'}>Transactions</a>
      <a href="/stores"
         class="block px-4 py-2 rounded transition hover:bg-pink-500"
         class:bg-pink-500={$currentPath === '/stores'}>Stores</a>
    </nav>

    <!-- ✅ Logout button restored -->
    <button on:click={logout}
      class="mt-8 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold">
      Logout
    </button>
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-8 overflow-y-auto">
    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-lg p-6 text-center">
        <p class="text-gray-500">Total Products</p>
        <p class="text-2xl font-bold text-gray-800">{data.products.length}</p>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 text-center">
        <p class="text-gray-500">Transactions</p>
        <p class="text-2xl font-bold text-gray-800">{data.transactions ? data.transactions.length : '--'}</p>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 text-center">
        <p class="text-gray-500">Sales</p>
        <p class="text-2xl font-bold text-gray-800">--</p>
      </div>
    </div>

    <!-- Sales Graph -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Sales Tracking</h2>
      <canvas bind:this={chartCanvas} class="w-full h-64"></canvas>
    </div>

    <!-- Products overview table -->
    <div class="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Products Overview</h2>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left border-b">
            <th>Image</th><th>Name</th><th>Price</th><th>Description</th>
          </tr>
        </thead>
        <tbody>
          {#each data.products as p}
            <tr class="border-b hover:bg-gray-50">
              <td>
                {#if p.imageUrl}
                  <img src={p.imageUrl} alt={p.name} class="w-16 h-16 object-cover rounded" />
                {:else}
                  <span class="text-gray-400">No image</span>
                {/if}
              </td>
              <td>{p.name}</td>
              <td>₱{p.price}</td>
              <td>{p.description}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </main>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
</style>
