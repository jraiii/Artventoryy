<script lang="ts">
  import {
    cart,
    subtotal,
    discount,
    total,
    change,
    discountType,
    paymentMethod,
    receivedAmount,
    orderNumber,
    timestamp,
    confirmOrder
  } from '$lib/stores/cart';

  let showNotif = false;
  let countdown = 10;
  let interval: NodeJS.Timeout;

  function handleConfirm() {
    confirmOrder();
    showNotif = true;

    countdown = 10;
    interval = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearInterval(interval);
        window.location.href = '/kiosk';
      }
    }, 1000);
  }

  function handleVoid() {
    window.location.href = '/kiosk';
  }

  function makeAnotherOrder() {
    clearInterval(interval);
    window.location.href = '/kiosk';
  }
</script>

<div class="flex min-h-screen w-full">
  <!-- Sidebar -->
  <aside class="w-64 bg-gradient-to-b from-purple-700 via-pink-600 to-indigo-600 text-white flex flex-col shadow-lg fixed h-screen">
    <div class="text-2xl font-bold p-6 text-center tracking-wide">ARTVENTORY</div>
    <nav class="flex-1 px-4 space-y-4">
      <a href="/kiosk" class="w-full block px-4 py-3 rounded-xl bg-white text-gray-900 hover:shadow-lg">🏠 Home</a>
      <a href="/kiosk/checkout" class="w-full block px-4 py-3 rounded-xl bg-white text-gray-900 hover:shadow-lg">💳 Checkout</a>
      <a href="/kiosk/confirm" class="w-full block px-4 py-3 rounded-xl bg-yellow-100 text-blue-600 border-l-4 border-yellow-400">✅ Confirm</a>
      <a href="/login" class="w-full block px-4 py-3 rounded-xl bg-white text-gray-900 hover:shadow-lg">🚪 Logout</a>
    </nav>
  </aside>

  <!-- Receipt Content -->
  <main class="flex-1 ml-64 bg-gray-100 p-8 min-h-screen overflow-y-auto flex justify-center items-center">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-6 font-mono border border-gray-300 animate-slideUp">
      <h1 class="text-2xl font-bold text-center mb-4 animate-fadeIn">🧾 Official Receipt</h1>
      <p class="text-center text-sm text-gray-600 animate-fadeIn">Order #: {$orderNumber ?? '---'}</p>
      <p class="text-center text-sm text-gray-600 mb-4 animate-fadeIn">Date: {$timestamp ?? new Date().toLocaleString()}</p>

      <hr class="border-dashed border-gray-400 mb-4" />

      <!-- Items -->
      <ul class="space-y-2 animate-fadeIn">
        {#each $cart as item (item.id)}
          <li class="flex justify-between text-sm">
            <span>{item.name} × {item.qty}</span>
            <span>₱{item.price * item.qty}</span>
          </li>
        {/each}
      </ul>

      <hr class="border-dashed border-gray-400 my-4" />

      <!-- Totals -->
      <div class="space-y-1 text-sm animate-fadeIn">
        <p class="flex justify-between"><span>Subtotal</span><span>₱{$subtotal}</span></p>
        <p class="flex justify-between"><span>Discount ({$discountType})</span><span>-₱{$discount}</span></p>
        <p class="flex justify-between font-bold text-lg"><span>Total</span><span>₱{$total}</span></p>
        {#if $paymentMethod === 'cash'}
          <p class="flex justify-between"><span>Received</span><span>₱{$receivedAmount}</span></p>
          <p class="flex justify-between"><span>Change</span><span>₱{$change}</span></p>
        {/if}
      </div>

      <hr class="border-dashed border-gray-400 my-4" />

      <!-- Payment Method -->
      <p class="text-sm text-gray-700 mb-4 animate-fadeIn">Payment Method: {$paymentMethod}</p>

      <!-- Actions -->
      {#if !showNotif}
        <div class="flex gap-4 mt-6 animate-fadeIn">
          <button
            on:click={handleConfirm}
            class="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            ✅ Confirm
          </button>
          <button
            on:click={handleVoid}
            class="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            ❌ Void
          </button>
        </div>
      {:else}
        <!-- Notification -->
        <div class="mt-6 bg-green-100 border-l-4 border-green-500 p-4 rounded text-center animate-pulse">
          <p class="text-lg font-semibold text-green-700">🎉 Thank you for your order!</p>
          <p class="text-sm text-gray-600">Redirecting to kiosk in {countdown} seconds...</p>
          <button
            on:click={makeAnotherOrder}
            class="mt-4 px-4 py-2 rounded-lg bg-pink-600 text-white font-semibold hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            🛒 Make Another Order
          </button>
        </div>
      {/if}

      <p class="text-center text-xs text-gray-500 mt-6 animate-fadeIn">Thank you for shopping at Artventory!</p>
    </div>
  </main>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }
  .animate-slideUp {
    animation: slideUp 0.8s ease-out forwards;
  }
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
</style>
