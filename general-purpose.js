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
            async generateCopies() {
                console.log('Generating copies...');
                try {
                    const batch = await this.createBatch('G0');
                    const original = this.copysets.generalContent.original

                    // Set original copy payloads
                    const commonPayload = {
                        copy_batch: batch.id,
                        avatar: this.avatar.data.id,
                        solution: this.solution.data.id
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
            this.inputInit();
        }
    }).mount('#app')
}