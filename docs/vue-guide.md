# Vue Integration Guide

Complete guide for using FHEVM SDK in Vue 3 applications.

---

## Setup

### 1. Install Dependencies

```bash
npm install fhevm-sdk vue@^3
```

### 2. Plugin Setup

```javascript
// main.js
import { createApp } from 'vue';
import { createFhevmPlugin } from 'fhevm-sdk/vue';
import App from './App.vue';

const app = createApp(App);

app.use(createFhevmPlugin({
  network: 'sepolia',
  contractAddress: '0xYourContractAddress',
}));

app.mount('#app');
```

---

## Composables

### `useFhevmClient()`

```vue
<script setup>
import { useFhevmClient } from 'fhevm-sdk/vue';

const client = useFhevmClient();

const encrypt = async (value) => {
  const encrypted = await client.encrypt64(value);
  console.log('Encrypted:', encrypted);
};
</script>

<template>
  <button @click="encrypt(42)">Encrypt</button>
</template>
```

### `useEncrypt()`

```vue
<script setup>
import { ref } from 'vue';
import { useEncrypt } from 'fhevm-sdk/vue';

const value = ref('');
const { encrypt, isEncrypting, error } = useEncrypt();

const handleSubmit = async () => {
  const encrypted = await encrypt(parseInt(value.value), 'uint64');
  // Use encrypted value...
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="value" type="number" />
    <button :disabled="isEncrypting">
      {{ isEncrypting ? 'Encrypting...' : 'Submit' }}
    </button>
    <div v-if="error">Error: {{ error.message }}</div>
  </form>
</template>
```

### `useDecrypt()`

```vue
<script setup>
import { ref } from 'vue';
import { useDecrypt } from 'fhevm-sdk/vue';

const props = defineProps(['encryptedData', 'contractAddress']);
const decrypted = ref(null);
const { decrypt, isDecrypting } = useDecrypt();

const handleDecrypt = async () => {
  const value = await decrypt(props.encryptedData, props.contractAddress);
  decrypted.value = value;
};
</script>

<template>
  <div>
    <button @click="handleDecrypt" :disabled="isDecrypting">
      {{ isDecrypting ? 'Decrypting...' : 'Decrypt' }}
    </button>
    <p v-if="decrypted">Value: {{ decrypted.toString() }}</p>
  </div>
</template>
```

---

## Complete Example

```vue
<script setup>
import { ref } from 'vue';
import { useEncrypt, useContract, useFhevmTransaction } from 'fhevm-sdk/vue';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';

const value = ref('');
const { encrypt, isEncrypting } = useEncrypt();
const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
const { send, isLoading, txHash } = useFhevmTransaction(contract, 'submitValue');

const handleSubmit = async () => {
  // Step 1: Encrypt
  const encrypted = await encrypt(parseInt(value.value), 'uint64');

  // Step 2: Submit
  const receipt = await send(encrypted);

  console.log('Success!', receipt);
  value.value = '';
};

const isBusy = computed(() => isEncrypting.value || isLoading.value);
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="value" type="number" placeholder="Enter value" />
    <button :disabled="isBusy">
      {{ isBusy ? 'Processing...' : 'Submit' }}
    </button>
    <p v-if="txHash">Transaction: {{ txHash }}</p>
  </form>
</template>
```

---

For more details, see [API Reference](./api-reference.md).
