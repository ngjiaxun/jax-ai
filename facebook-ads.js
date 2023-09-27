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
                user: user,
                ...input.data,
                ...copies.data,

                solution: { data: solutions[0] },
                avatar: { ...copies.copy },
                copies: {
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy },
                    captions: { ...copies.copy }
                },
                spun: {
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy },
                    captions: { ...copies.copy }
                },
                styled: {
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy },
                    captions: { ...copies.copy }
                },
                translated: {
                    text1: { ...copies.copy },
                    text2: { ...copies.copy },
                    text3: { ...copies.copy },
                    text4: { ...copies.copy },
                    text5: { ...copies.copy },
                    headlines: { ...copies.copy },
                    descriptions: { ...copies.copy },
                    captions: { ...copies.copy }
                }
            }
        },
        watch: {
            avatarSelection: 'avatarSelectionChanged'
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
            generateClicked() {
                this.generateCopies();
                this.updateCopy(this.avatar, endpoints.avatars);
                this.updateCopy(this.solution, endpoints.solutions);
            },
            async generateCopies() {
                console.log('Generating copies...');
                try {
                    const batchTime = new Date().toISOString(); 
                    const commonPayload = {
                        avatar: this.avatar.data.id,
                        batch_time: batchTime,
                        ...this.avatar.data,
                        ...this.solution.data
                    }
                    const text1Payload = {
                        ...commonPayload,
                        prompt_id: 0
                    }
                    const text2Payload = {
                        ...commonPayload,
                        prompt_id: 2
                    }
                    const text3Payload = {
                        ...commonPayload,
                        prompt_id: 3
                    }
                    const text4Payload = {
                        ...commonPayload,
                        prompt_id: 1
                    }
                    const text5Payload = {
                        ...commonPayload,
                        prompt_id: 4
                    }
                    const headlinesPayload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 40
                    }
                    const descriptionsPayload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 20
                    }
                    const captionsPayload = {
                        ...commonPayload,
                        no_of_headlines: 20,
                        max_characters: 120
                    }
    
                    // Original
                    const copies = {
                        text1: await this.generateCopy(this.copies.text1, endpoints.facebookAdsText, text1Payload),
                        text2: await this.generateCopy(this.copies.text2, endpoints.facebookAdsText, text2Payload),
                        text3: await this.generateCopy(this.copies.text3, endpoints.facebookAdsText, text3Payload),
                        text4: await this.generateCopy(this.copies.text4, endpoints.facebookAdsText, text4Payload),
                        text5: await this.generateCopy(this.copies.text5, endpoints.facebookAdsText, text5Payload),
                        headlines: await this.generateCopy(this.copies.headlines, endpoints.facebookAdsHeadlines, headlinesPayload),
                        descriptions: await this.generateCopy(this.copies.descriptions, endpoints.facebookAdsHeadlines, descriptionsPayload),
                        captions: await this.generateCopy(this.copies.captions, endpoints.facebookAdsHeadlines, captionsPayload)
                    }

                    // Spin
                    if (this.solution.data.spin) {
                        await this.transformCopies(batchTime, this.solution.data.spin, transformation.spin, copies, this.spun);
                    }

                    // Style
                    if (this.solution.data.style) {
                        await this.transformCopies(batchTime, this.solution.data.style, transformation.style, copies, this.styled, 0);
                    }

                    // Translate
                    if (this.solution.data.translation) {
                        await this.transformCopies(batchTime, this.solution.data.translation, transformation.translation, copies, this.translated, 0);
                    }
                } catch (error) {
                    console.error('Error generating copies:', error.message);
                }
            },
            async transformCopies(batchTime, transformation, transformationType, from, to, temperature=null) {
                const payload = { 
                    batch_time: batchTime,
                    transformation: transformation,
                    transformation_type: transformationType
                }
                if (temperature) {
                    payload.temperature = temperature;
                }
                from.text1 = await this.generateCopy(to.text1, endpoints.transform, { ...payload, transform_from: from.text1.data.id });
                from.text2 = await this.generateCopy(to.text2, endpoints.transform, { ...payload, transform_from: from.text2.data.id });
                from.text3 = await this.generateCopy(to.text3, endpoints.transform, { ...payload, transform_from: from.text3.data.id });
                from.text4 = await this.generateCopy(to.text4, endpoints.transform, { ...payload, transform_from: from.text4.data.id });
                from.text5 = await this.generateCopy(to.text5, endpoints.transform, { ...payload, transform_from: from.text5.data.id });
                from.headlines = await this.generateCopy(to.headlines, endpoints.transform,  { ...payload, transform_from: from.headlines.data.id });
                from.descriptions = await this.generateCopy(to.descriptions, endpoints.transform, { ...payload, transform_from: from.descriptions.data.id });
                from.captions = await this.generateCopy(to.captions, endpoints.transform, { ...payload, transform_from: from.captions.data.id });
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