<script lang="ts">
  import { enhance } from '$app/forms';

  type CartItem = { id: string; name: string; price: string; qty: number; imageUrl?: string };

  let status: {
    success?: boolean;
    error?: string;
    message?: string;
    txId?: string;
    items?: CartItem[];
    payAmount?: number;
    payMethod?: string;
  } | null = null;

  let showToast = false;

  const enhanceOptions = {
    onResult: ({ result }: any) => {
      status = result?.data;
      if (status?.success) {
        showToast = true;
        setTimeout(() => (showToast = false), 3000);
      }
    }
  };
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
  <form method="POST" action="?/checkout" use:enhance={enhanceOptions}
    class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 animate-fadeIn">
    <h1 class="text-xl font-bold text-center text-blue-600">Finalize Checkout</h1>

    <div>
      <label for="payMethod" class="block text-sm font-medium">Payment Method</label>
      <select id="payMethod" name="payMethod" class="w-full border rounded px-3 py-2">
        <option value="Cash">Cash</option>
        <option value="GCash">GCash</option>
        <option value="CreditCard">Credit Card</option>
      </select>
    </div>

    <div>
      <label for="payAmount" class="block text-sm font-medium">Payment Amount</label>
      <input id="payAmount" name="payAmount" type="number" class="w-full border rounded px-3 py-2" />
    </div>

    <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
      Complete Transaction
    </button>

    {#if status?.error}
      <p class="text-red-600 text-sm">{status.error}</p>
    {/if}

    {#if status?.success}
      <div class="mt-4 space-y-2">
        <p class="text-green-600 text-sm">{status.message}</p>
        <p class="text-sm">Transaction ID: {status.txId}</p>
        <p class="text-sm">Payment Method: {status.payMethod}</p>
        <p class="text-sm">Amount Paid: ₱{status.payAmount}</p>

        <h2 class="text-md font-semibold mt-4">Items Purchased:</h2>
        <ul class="space-y-2">
          {#each status.items as item}
            <li class="flex justify-between text-sm border-b pb-1">
              <span>{item.name} × {item.qty}</span>
              <span>₱{Number(item.price) * item.qty}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </form>
</div>

<!-- Success Toast -->
{#if showToast}
  <div class="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fadeIn">
    ✅ Checkout successful!
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 1s ease forwards; }
</style>
