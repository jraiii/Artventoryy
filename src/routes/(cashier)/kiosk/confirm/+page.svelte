<script lang="ts">
  export let data: {
    lastTransaction: {
      id: string;
      transactionType: string;
      totalAmount: string;
      createdAt: string;
      items: { productId: string; quantity: number; price: string }[];
      payments: { method: string; amount: string; status: string }[];
    } | null;
  };
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
    <h1 class="text-xl font-bold text-center text-gray-800 mb-4">🧾 Receipt</h1>

    {#if data.lastTransaction}
      <!-- Header -->
      <div class="text-center border-b pb-2 mb-4">
        <p class="text-sm text-gray-600">Transaction ID: {data.lastTransaction.id}</p>
        <p class="text-sm text-gray-600">Date: {new Date(data.lastTransaction.createdAt).toLocaleString()}</p>
        <p class="text-sm text-gray-600">Type: {data.lastTransaction.transactionType}</p>
      </div>

      <!-- Items -->
      <h2 class="text-md font-semibold mb-2">Items</h2>
      <table class="w-full text-sm border-collapse mb-4">
        <thead>
          <tr class="border-b">
            <th class="text-left p-1">Product</th>
            <th class="text-right p-1">Qty</th>
            <th class="text-right p-1">Price</th>
            <th class="text-right p-1">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {#each data.lastTransaction.items as item}
            <tr class="border-b">
              <td class="p-1">{item.productId}</td>
              <td class="p-1 text-right">{item.quantity}</td>
              <td class="p-1 text-right">₱{item.price}</td>
              <td class="p-1 text-right">₱{Number(item.price) * item.quantity}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Payments -->
      <h2 class="text-md font-semibold mb-2">Payment</h2>
      <ul class="space-y-1 mb-4">
        {#each data.lastTransaction.payments as p}
          <li class="flex justify-between text-sm">
            <span>{p.method} ({p.status})</span>
            <span>₱{p.amount}</span>
          </li>
        {/each}
      </ul>

      <!-- Total -->
      <div class="border-t pt-2 text-right font-bold">
        Total: ₱{data.lastTransaction.totalAmount}
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-xs text-gray-500">
        Thank you for shopping at Artventory!
      </div>

      <!-- Back button -->
      <div class="flex justify-center mt-4">
        <a href="/(cashier)/kiosk" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Kiosk
        </a>
      </div>
    {:else}
      <p class="text-gray-600 text-center">No transactions found.</p>
    {/if}
  </div>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 1s ease forwards; }
</style>
