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

                    // Loop through this.copies and generate the copy
                    // const toBeTransformed = {};
                    // for (const key in this.copies) {
                    //     toBeTransformed[key] = await this.generateCopy(this.copies[key], endpoints.facebookAdsText, eval(`${key}Payload`));
                    // }
    
                    // Original
                    const copies = {
                        text1: await this.generateCopy(this.copysets.text1.original, text1Payload),
                        text2: await this.generateCopy(this.copysets.text2.original, text2Payload),
                        text3: await this.generateCopy(this.copysets.text3.original, text3Payload),
                        text4: await this.generateCopy(this.copysets.text4.original, text4Payload),
                        text5: await this.generateCopy(this.copysets.text5.original, text5Payload),
                        headlines: await this.generateCopy(this.copysets.headlines.original, headlinesPayload),
                        descriptions: await this.generateCopy(this.copysets.descriptions.original, descriptionsPayload),
                        captions: await this.generateCopy(this.copysets.captions.original, captionsPayload)
                    }

                    // Spin
                    if (this.solution.data.spin) {
                        await this.transformCopies(batchTime, this.solution.data.spin, transformation.spin, copies);
                    }

                    // Style
                    if (this.solution.data.style) {
                        await this.transformCopies(batchTime, this.solution.data.style, transformation.style, copies, 0);
                    }

                    // Translate
                    if (this.solution.data.translation) {
                        await this.transformCopies(batchTime, this.solution.data.translation, transformation.translation, copies, 0);
                    }
                } catch (error) {
                    console.error('Error generating copies:', error.message);
                }
            },
            async transformCopies(batchTime, transformation, type, from, temperature=null) {
                const payload = { 
                    batch_time: batchTime,
                    transformation: transformation,
                    transformation_type: type.code
                }
                if (temperature) {
                    payload.temperature = temperature;
                }

                from.text1 = await this.generateCopy(this.copysets.text1[type.property], { ...payload, transform_from: from.text1.data.id });
                from.text2 = await this.generateCopy(this.copysets.text2[type.property], { ...payload, transform_from: from.text2.data.id });
                from.text3 = await this.generateCopy(this.copysets.text3[type.property], { ...payload, transform_from: from.text3.data.id });
                from.text4 = await this.generateCopy(this.copysets.text4[type.property], { ...payload, transform_from: from.text4.data.id });
                from.text5 = await this.generateCopy(this.copysets.text5[type.property], { ...payload, transform_from: from.text5.data.id });
                from.headlines = await this.generateCopy(this.copysets.headlines[type.property], { ...payload, transform_from: from.headlines.data.id });
                from.descriptions = await this.generateCopy(this.copysets.descriptions[type.property], { ...payload, transform_from: from.descriptions.data.id });
                from.captions = await this.generateCopy(this.copysets.captions[type.property], { ...payload, transform_from: from.captions.data.id });
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