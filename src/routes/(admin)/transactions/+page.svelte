<script lang="ts">
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  export let data: {
    transactions: {
      id: string;
      type: string;
      totalAmount: string;
      createdAt: string;
      cashierId: string;
      storeId: string;
      payments: { id: string; method: string; amount: string; status: string }[];
    }[];
  };

  const currentPath = derived(page, ($page) => $page.url.pathname);

  function logout() {
    window.location.href = '/login';
  }
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">
  <!-- Sidebar -->
  <aside class="md:flex flex-col bg-gradient-to-b from-pink-600 to-purple-700 text-white p-6 w-64 hidden md:block">
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
    <h1 class="text-2xl font-bold mb-6 text-white">📊 Transaction History</h1>

    <div class="bg-white rounded-xl shadow-lg p-6">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm uppercase tracking-wide">
            <th class="p-3">ID</th>
            <th class="p-3">Type</th>
            <th class="p-3">Amount</th>
            <th class="p-3">Cashier</th>
            <th class="p-3">Store</th>
            <th class="p-3">Date</th>
            <th class="p-3">Payments</th>
          </tr>
        </thead>
        <tbody>
          {#each data.transactions as t}
            <tr class="border-b last:border-none hover:bg-gray-50 transition">
              <td class="p-3 text-xs text-gray-500">{t.id}</td>
              <td class="p-3 font-medium text-gray-700">{t.type}</td>
              <td class="p-3 font-semibold text-green-600">₱{t.totalAmount}</td>
              <td class="p-3 text-sm text-gray-600">{t.cashierId}</td>
              <td class="p-3 text-sm text-gray-600">{t.storeId}</td>
              <td class="p-3 text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</td>
              <td class="p-3">
                <ul class="space-y-1">
                  {#each t.payments as p}
                    <li class="flex items-center gap-2 text-xs">
                      <span class="font-medium">{p.method}</span>
                      <span class="text-gray-600">₱{p.amount}</span>
                      <span
                        class={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                          ${p.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            p.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}`}
                      >
                        {p.status}
                      </span>
                    </li>
                  {/each}
                </ul>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </main>
</div>
