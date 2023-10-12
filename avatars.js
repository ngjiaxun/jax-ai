(async function main() {
    try {
        const user = await preInit();
        const avatars = await axios.get(endpoints.avatars);
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
            ...authentication.methods,
            ...util.methods,
            ...copies.methods,
            deleteAvatar(avatar) {
                const copy = new Copy(endpoints.avatars, endpoints.avatars);
                copy.data = avatar;
                this.deleteCopy(copy);
            }
        },
        mounted() {
            this.init();
        }
    }).mount('#app')
}