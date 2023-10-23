(async function main() {
    try {
        const user = await preInit();
        const avatars = await axios.get(endpoints.avatars);
        const solutions = await axios.get(endpoints.solutions);
        input.vForSelectAvatar();
        runVue(user, avatars.data, solutions.data);
    } catch (error) {
        console.error('Error initializing Jax AI:', error.message);
    }
})();

function runVue(user, avatars, solutions) {
    const { createApp } = Vue
    createApp({
        data() {
            return {
                user: user, // For displaying the user's name in the top right corner
                avatars: avatars, // For displaying the avatars in the avatar select field
                solution: { data: solutions[0] }, 
                ...input.data,
                ...copies.data,
                copysets: {
                    text1: new Copyset(endpoints.facebookAdsText),
                    text2: new Copyset(endpoints.facebookAdsText),
                    text3: new Copyset(endpoints.facebookAdsText),
                    text4: new Copyset(endpoints.facebookAdsText),
                    text5: new Copyset(endpoints.facebookAdsText),
                    text6: new Copyset(endpoints.facebookAdsText),
                    text7: new Copyset(endpoints.facebookAdsText),
                    text8: new Copyset(endpoints.facebookAdsText),
                    headlines: new Copyset(endpoints.facebookAdsHeadlines),
                    descriptions: new Copyset(endpoints.facebookAdsHeadlines),
                    captions: new Copyset(endpoints.facebookAdsHeadlines)
                }
            }
        },
        watch: {
            ...input.watch,
        },
        computed: {
            ...copies.computed,
            ...input.computed,
        },
        methods: {
            ...authentication.methods,
            ...util.methods,
            ...copies.methods,
            ...input.methods,
            async generateCopies() {
                console.log('Generating copies...');
                try {
                    const batch = await this.createBatch('F0');

                    // Set original copy payloads
                    const commonPayload = {
                        copy_batch: batch.id,
                        avatar: this.avatar.data.id,
                        solution: this.solution.data.id
                    }
                    this.copysets.text1.original.payload = {
                        ...commonPayload,
                        label: 'Classic Ad',
                        prompt_id: 5
                    }
                    this.copysets.text2.original.payload = {
                        ...commonPayload,
                        label: 'Pain Ad',
                        prompt_id: 0
                    }
                    this.copysets.text3.original.payload = {
                        ...commonPayload,
                        label: 'Benefit Ad',
                        prompt_id: 2
                    }
                    this.copysets.text3.original.payload = {
                        ...commonPayload,
                        label: 'Did-you-know Ad',
                        prompt_id: 8
                    }
                    this.copysets.text8.original.payload = {
                        ...commonPayload,
                        label: 'Myth-buster Ad',
                        prompt_id: 9
                    }
                    this.copysets.text4.original.payload = {
                        ...commonPayload,
                        label: 'Story Ad',
                        prompt_id: 6
                    }
                    this.copysets.text5.original.payload = {
                        ...commonPayload,
                        label: 'Villain Ad',
                        prompt_id: 3
                    }
                    this.copysets.text6.original.payload = {
                        ...commonPayload,
                        label: 'Identity Transformation Ad',
                        prompt_id: 1
                    }
                    this.copysets.text7.original.payload = {
                        ...commonPayload,
                        label: 'Testimonial Ad',
                        prompt_id: 7
                    }
                    this.copysets.text8.original.payload = {
                        ...commonPayload,
                        label: 'Objection-killer Ad',
                        prompt_id: 4
                    }
                    this.copysets.headlines.original.payload = {
                        ...commonPayload,
                        label: 'Headlines',
                        no_of_headlines: 20,
                        max_characters: 40
                    }
                    this.copysets.descriptions.original.payload = {
                        ...commonPayload,
                        label: 'Descriptions',
                        no_of_headlines: 20,
                        max_characters: 20
                    }
                    this.copysets.captions.original.payload = {
                        ...commonPayload,
                        label: 'Image/Video Captions',
                        no_of_headlines: 20,
                        max_characters: 80
                    }

                    // Generate copies and their transformations
                    for (const key in this.copysets) {
                        const copyset = this.copysets[key];
                        let copy = await this.generateCopy(copyset.original);

                        if (this.solution.data.spin) {
                            copy = await this.transformCopy(batch, this.solution.data.spin, transformation.spin, copy, copyset.spun);
                        }
                        if (this.solution.data.style) {
                            copy = await this.transformCopy(batch, this.solution.data.style, transformation.style, copy, copyset.styled, 0);
                        }
                        if (this.solution.data.translation) {
                            copy = await this.transformCopy(batch, this.solution.data.translation, transformation.translation, copy, copyset.translated, 0);
                        }
                    }
                } catch (error) {
                    console.error('Error generating copies:', error.message);
                }
            },
            async transformCopy(batch, transformation, transformationType, transformFrom, transformTo, temperature=null) {
                transformTo.payload = { 
                    copy_batch: batch.id,
                    transformation: transformation,
                    transformation_type: transformationType,
                    transform_from: transformFrom.data.id,
                    label: transformFrom.data.label
                }
                if (temperature) {
                    transformTo.payload.temperature = temperature;
                }
                return await this.generateCopy(transformTo);
            }
        },
        mounted() {
            this.init();
            this.inputInit();
        }
    }).mount('#app')
}