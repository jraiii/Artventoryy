<script lang="ts">
  type Product = { id: string; name: string; price: string; imageUrl?: string };
  type CartItem = Product & { qty: number };

  export let data: { products: Product[] };

  let cart: CartItem[] = [];
  let searchTerm = '';

  function addToCart(product: Product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart = [...cart, { ...product, qty: 1 }];
    }
  }

  function removeFromCart(id: string) {
    cart = cart.filter(item => item.id !== id);
  }

  $: total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  $: filtered = data.products.filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $: featured = filtered.slice(0, 3);
  $: latest = filtered.slice(3);
</script>

<div class="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-500 p-6">
  <!-- Header -->
  <header class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-extrabold text-white tracking-wide">🎨 Welcome to Artventory</h1>
    <div class="text-white font-semibold">Cart Total: ₱{total}</div>
  </header>

  <!-- Search bar -->
  <div class="mb-6 flex justify-center">
    <input
      type="text"
      placeholder="Search products..."
      bind:value={searchTerm}
      class="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-400 w-full max-w-md"
    />
  </div>

  <!-- Main content split: products left, cart right -->
  <div class="flex gap-6">
    <!-- Products section -->
    <div class="flex-1 space-y-10">
      <!-- Featured Products -->
      <div>
        <h2 class="text-white text-xl font-semibold mb-4">🌟 Featured Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each featured as p}
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              {#if p.imageUrl}
                <img src={p.imageUrl} alt={p.name} class="w-full h-40 object-cover" />
              {:else}
                <div class="w-full h-40 bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400 text-sm">No Image</span>
                </div>
              {/if}
              <div class="p-4 flex flex-col gap-2">
                <p class="font-semibold text-gray-800">{p.name}</p>
                <p class="text-sm text-gray-600">₱{p.price}</p>
                <button
                  on:click={() => addToCart(p)}
                  class="mt-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-1 rounded text-sm hover:opacity-90 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Latest Products -->
      <div>
        <h2 class="text-white text-xl font-semibold mb-4">✨ Latest Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each latest as p}
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              {#if p.imageUrl}
                <img src={p.imageUrl} alt={p.name} class="w-full h-40 object-cover" />
              {:else}
                <div class="w-full h-40 bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400 text-sm">No Image</span>
                </div>
              {/if}
              <div class="p-4 flex flex-col gap-2">
                <p class="font-semibold text-gray-800">{p.name}</p>
                <p class="text-sm text-gray-600">₱{p.price}</p>
                <button
                  on:click={() => addToCart(p)}
                  class="mt-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-1 rounded text-sm hover:opacity-90 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Cart sidebar (fixed on right side) -->
    <div class="w-80 bg-white rounded-xl shadow-lg p-6 h-fit">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">🛒 Cart</h2>
      {#if cart.length === 0}
        <p class="text-gray-500 text-sm">No items yet.</p>
      {:else}
        <ul class="space-y-2">
          {#each cart as item}
            <li class="flex justify-between items-center border-b pb-2">
              <div>
                <p class="font-medium">{item.name}</p>
                <p class="text-xs text-gray-500">₱{item.price} × {item.qty}</p>
              </div>
              <p class="font-semibold">₱{Number(item.price) * item.qty}</p>
            </li>
          {/each}
        </ul>
        <div class="mt-4 border-t pt-2">
          <p class="font-semibold">Total: ₱{total}</p>
          <button
            class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded hover:opacity-90 transition">
            Proceed to Checkout
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
