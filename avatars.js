(async function main() {
    try {
        const user = await preInit();
        const avatars = await axios.get(apiEndpoints.avatars);
        runVue(user, avatars.data);
    } catch (error) {
        console.error('Error initializing Jax AI:', error.message);
    }
})();

function runVue(user, avatars) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user,
                ...copies.data,
                copies: {
                },
                avatars: avatars
            }
        },
        watch: {
        },
        computed: {
            ...copies.computed,
        },
        methods: {
            ...copies.methods,
            ...util.methods,
        },
        mounted() {
            this.init();
        }
    }).mount('#app')
}


// function runVue(data) {
//   const { createApp } = Vue
//   createApp({
//     data() {
//       return {
//         avatars: data
//       }
//     },
//     methods: {
//     },
//     mounted() {
//     }
//   }).mount('#app')
// }

// axios.get(apiEndpoints.avatars)
//   .then(response => runVue(response.data))
//   .catch(error => console.error('Error fetching data:', error.message));