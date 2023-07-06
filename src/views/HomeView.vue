<template>
  <div>
    <div class="container">
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.key">
            <td>{{ item.key }}</td>
            <td>{{ item.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <button @click="previousPage" :disabled="currentPage === 1">
        Previous
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { generateJWT } from '@/utils/generateToken';
import axios from 'axios';

export default {
  data() {
    return {
      data: {},
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const keys = Object.keys(this.data).slice(startIndex, endIndex);
      return keys.map((key) => ({ key, value: this.data[key] }));
    },
    totalPages() {
      const totalKeys = Object.keys(this.data).length;
      return Math.ceil(totalKeys / this.perPage);
    },
  },
  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    async fetchData() {
      try {
        const token = generateJWT();
        console.log('Token: ', token);
        const response = await axios.get('http://localhost:3000/api', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.data = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
