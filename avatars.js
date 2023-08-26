function runVue(data) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                avatars: data
            }
        },
        methods: {
        },
        mounted() {
        }
    }).mount('#app')
}

axios.get(endpoints.avatars)
    .then(response => runVue(response.data))
    .catch(error => console.error('Error fetching data:', error.message));