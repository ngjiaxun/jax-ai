main();

function runVue(user, avatars, solution) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user, 
                avatars: avatars, 
                solution: { data: solution }, 
                ...copies.data,
                ...input.data,
                copysets: {
                    generalContent: new Copyset(endpoints.generalContent),
                },
                userContentType: '',
                instructions: '',
                details: ''
            }
        },
        watch: {
            ...input.watch
        },
        computed: {
            ...copies.computed,
            ...input.computed
        },
        methods: {
            ...authentication.methods,
            ...util.methods,
            ...copies.methods,
            ...input.methods,
            generateCopies() {
                console.log('Generating copies...');
                try {
                    const batchTime = new Date().toISOString(); 
                    const original = this.copysets.generalContent.original

                    // Set original copy payloads
                    const commonPayload = {
                        avatar: this.avatar.data.id,
                        batch_time: batchTime,
                        ...this.avatar.data,
                        ...this.solution.data
                    }

                    original.payload = {
                        ...commonPayload,
                        user_content_type: this.userContentType,
                    }

                    if (this.instructions) {
                        original.payload.instructions = this.instructions;
                    }

                    if (this.details) {
                        original.payload.details = this.details;
                    }

                    this.generateCopysets();

                } catch (error) {
                    console.error(error);
                }
            }
        },
        mounted() {
            this.init();
            this.selectFirstAvatar();
        }
    }).mount('#app')
}