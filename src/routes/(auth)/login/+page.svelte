<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  let status: { success?: boolean; error?: string; role?: 'admin' | 'cashier' } | null = null;
  let role: 'admin' | 'cashier' = 'admin';
  let showPassword = false;
</script>

<div class="min-h-screen flex items-center justify-center animated-gradient p-6">
  <form
    method="POST"
    action="?/login"
    use:enhance={(input) => {
      // input has { action, formData, formElement, controller, submitter, cancel }
      // return a handler for the result
      return async ({ result }: { result: any }) => {
        status = result?.data;
        if (status?.success && status.role === 'cashier') goto('/kiosk');
        if (status?.success && status.role === 'admin') goto('/dashboard');
      };
    }}
    class="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl opacity-0 animate-fadeIn"
  >
    <h1 class="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
      ARTVENTORY
    </h1>

    <!-- Role switcher -->
    <div class="flex justify-center gap-2 text-sm">
      <button
        type="button"
        on:click={() => role = 'admin'}
        class="px-3 py-1 rounded border font-medium transition-colors duration-300"
        class:bg-pink-500={role === 'admin'}
        class:text-white={role === 'admin'}
        class:text-gray-700={role !== 'admin'}
      >
        Admin
      </button>
      <button
        type="button"
        on:click={() => role = 'cashier'}
        class="px-3 py-1 rounded border font-medium transition-colors duration-300"
        class:bg-blue-500={role === 'cashier'}
        class:text-white={role === 'cashier'}
        class:text-gray-700={role !== 'cashier'}
      >
        Cashier
      </button>
    </div>

    <!-- Hidden role input -->
    <input type="hidden" name="role" bind:value={role} />

    <!-- Email -->
    <div class="space-y-2">
      <label for="email" class="text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
        required
      />
    </div>

    <!-- Password with toggle -->
    <div class="space-y-2">
      <label for="password" class="text-sm font-medium text-gray-700">Password</label>
      <input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
        required
      />
      <label class="flex items-center gap-2 text-sm text-gray-600 mt-1 select-none">
        <input type="checkbox" bind:checked={showPassword} />
        Show Password
      </label>
    </div>

    <button
      type="submit"
      class="w-full py-2 rounded bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold hover:opacity-90 transition duration-300"
    >
      Log In
    </button>

    {#if status?.error}
      <p class="text-sm text-red-600 text-center">{status.error}</p>
    {/if}
  </form>
</div>

<style>
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animated-gradient {
    background: linear-gradient(-45deg, #ec4899, #8b5cf6, #3b82f6, #f59e0b);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 1s ease forwards;
  }
</style>
