(async function main() {
    try {
        const user = await preInit();
        const avatars = await axios.get(endpoints.avatars);
        const solutions = await axios.get(endpoints.solutions);
        modifyAttributes();
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
                    const batchTime = new Date().toISOString(); 

                    // Set original copy payloads
                    const commonPayload = {
                        avatar: this.avatar.data.id,
                        batch_time: batchTime,
                        ...this.avatar.data,
                        ...this.solution.data
                    }
                    this.copysets.text1.original.payload = {
                        ...commonPayload,
                        prompt_id: 0
                    }
                    this.copysets.text2.original.payload = {
                        ...commonPayload,
                        prompt_id: 2
                    }
                    this.copysets.text3.original.payload = {
                        ...commonPayload,
                        prompt_id: 3
                    }
                    this.copysets.text4.original.payload = {
                        ...commonPayload,
                        prompt_id: 1
                    }
                    this.copysets.text5.original.payload = {
                        ...commonPayload,
                        prompt_id: 4
                    }
                    this.copysets.headlines.original.payload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 40
                    }
                    this.copysets.descriptions.original.payload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 20
                    }
                    this.copysets.captions.original.payload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 120
                    }

                    // Generate copies and their transformations
                    for (const key in this.copysets) {
                        const copyset = this.copysets[key];
                        let copy = await this.generateCopy(copyset.original);

                        if (this.solution.data.spin) {
                            copy = await this.transformCopy(batchTime, this.solution.data.spin, transformation.spin, copy, copyset.spun);
                        }
                        if (this.solution.data.style) {
                            copy = await this.transformCopy(batchTime, this.solution.data.style, transformation.style, copy, copyset.styled, 0);
                        }
                        if (this.solution.data.translation) {
                            copy = await this.transformCopy(batchTime, this.solution.data.translation, transformation.translation, copy, copyset.translated, 0);
                        }
                    }
                } catch (error) {
                    console.error('Error generating copies:', error.message);
                }
            },
            async transformCopy(batchTime, transformation, transformationType, transformFrom, transformTo, temperature=null) {
                transformTo.payload = { 
                    batch_time: batchTime,
                    transformation: transformation,
                    transformation_type: transformationType,
                    transform_from: transformFrom.data.id
                }
                if (temperature) {
                    transformTo.payload.temperature = temperature;
                }
                return await this.generateCopy(transformTo);
            }
        },
        mounted() {
            this.init();
            this.avatarSelection = (this.avatars && this.avatars.length) ? this.avatars[0].id : this.avatarSelection; // Select the first avatar by default
        }
    }).mount('#app')
}

// Hack for adding or modifying attributes where Webflow doesn't allow directly
function modifyAttributes() {
    const option = document.querySelector('#avatar-select-field').options[1]; // The option after 'Select one...' in the avatar select field
    option.setAttribute('v-for', 'avatar in avatars');
    option.setAttribute(':key', 'avatar.id');
    option.removeAttribute('value'); // Webflow adds this attribute automatically, which prevents Vue from binding the value
    option.setAttribute(':value', 'avatar.id');
}