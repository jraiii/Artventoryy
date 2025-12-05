<script lang="ts">
  type CartItem = { id: string; name: string; price: number; qty: number };

  // Example cart data (replace with store/session or pass from kiosk)
  let cart: CartItem[] = [
    { id: '1', name: 'Watercolor Set', price: 499, qty: 2 },
    { id: '5', name: 'Acrylic Paint Set', price: 899, qty: 1 }
  ];

  let discountType: 'none' | 'senior' | 'pwd' | 'vat' = 'none';
  let paymentMethod: 'gcash' | 'maya' | 'card' | 'cash' = 'gcash';

  let receivedAmount: number = 0;

  $: subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  $: discount = (() => {
    switch (discountType) {
      case 'senior': return subtotal * 0.20; // 20% senior discount
      case 'pwd': return subtotal * 0.20;    // 20% PWD discount
      case 'vat': return subtotal * 0.12;    // VAT exempt (12%)
      default: return 0;
    }
  })();

  $: total = subtotal - discount;

  $: change = paymentMethod === 'cash' ? receivedAmount - total : 0;

  function updateQuantity(item: CartItem, qty: number) {
    item.qty = qty;
    if (item.qty <= 0) {
      cart = cart.filter(c => c.id !== item.id);
    }
  }
</script>

<div class="flex min-h-screen w-full">
  <!-- Sidebar -->
  <aside class="w-64 bg-gradient-to-b from-purple-700 via-pink-600 to-indigo-600 text-white flex flex-col shadow-lg fixed h-screen">
    <div class="text-2xl font-bold p-6 text-center tracking-wide">ARTVENTORY</div>
    <nav class="flex-1 px-4 space-y-4">
      <a href="/" class="w-full block px-4 py-3 rounded-xl bg-white text-gray-900 hover:shadow-lg">🏠 Home</a>
      <a href="/checkout" class="w-full block px-4 py-3 rounded-xl bg-yellow-100 text-blue-600 border-l-4 border-yellow-400">💳 Checkout</a>
      <a href="/confirm" class="w-full block px-4 py-3 rounded-xl bg-white text-gray-900 hover:shadow-lg">✅ Confirm</a>
      <a href="/login" class="w-full block px-4 py-3 rounded-xl bg-white text-gray-900 hover:shadow-lg">🚪 Logout</a>
    </nav>
  </aside>

  <!-- Checkout Content -->
  <main class="flex-1 ml-64 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-8 min-h-screen overflow-y-auto">
    <h1 class="text-3xl font-extrabold text-white mb-6">💳 Checkout</h1>

    {#if cart.length === 0}
      <p class="text-white text-lg">Your cart is empty.</p>
    {:else}
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        <ul class="space-y-4">
          {#each cart as item}
            <li class="flex justify-between items-center border-b pb-2">
              <div>
                <p class="font-medium">{item.name}</p>
                <p class="text-xs text-gray-500">₱{item.price} each</p>
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  bind:value={item.qty}
                  on:change={(e) => updateQuantity(item, +e.target.value)}
                  class="w-16 border rounded px-2 py-1 text-center"
                />
                <p class="font-semibold">₱{item.price * item.qty}</p>
              </div>
            </li>
          {/each}
        </ul>

        <!-- Discounts -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">Available Discounts</h3>
          <select bind:value={discountType} class="w-full border rounded px-3 py-2">
            <option value="none">No Discount</option>
            <option value="senior">Senior Citizen (20%)</option>
            <option value="pwd">PWD (20%)</option>
            <option value="vat">VAT Exempt (12%)</option>
          </select>
        </div>

        <!-- Payment Options -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">Payment Method</h3>
          <select bind:value={paymentMethod} class="w-full border rounded px-3 py-2">
            <option value="gcash">GCash</option>
            <option value="maya">Maya</option>
            <option value="card">Credit/Debit Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <!-- Totals -->
        <div class="mt-6 border-t pt-4 space-y-2">
          <p class="text-lg">Subtotal: ₱{subtotal}</p>
          <p class="text-lg text-green-600">Discount: -₱{discount}</p>
          <p class="text-xl font-bold text-pink-600">Total: ₱{total}</p>

          <!-- Amount to Pay -->
          <div class="mt-4 bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded">
            <p class="text-lg font-semibold text-gray-800">
              💵 Amount to Pay: <span class="text-pink-600 font-bold">₱{total}</span>
            </p>
          </div>
        </div>

        <!-- Received Amount (only for Cash) -->
        {#if paymentMethod === 'cash'}
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-2">Received Amount</h3>
            <input
              type="number"
              min="0"
              bind:value={receivedAmount}
              class="w-full border rounded px-3 py-2"
              placeholder="Enter amount received"
            />
            <p class="mt-2 text-lg font-semibold text-gray-800">
              Change: <span class="text-green-600">₱{change}</span>
            </p>
          </div>
        {/if}

        <!-- Confirm button -->
        <div class="mt-6">
          <a
            href="/confirm"
            class="w-full block text-center px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            ✅ Confirm Order
          </a>
        </div>
      </div>
    {/if}
  </main>
</div>
