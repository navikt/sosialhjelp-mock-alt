import { defineConfig } from 'orval';

export default defineConfig({
    'mock-alt-api': {
        input: './mock-alt-api.json',
        output: {
            mode: 'tags-split',
            target: 'src/generated/mock-alt-api-axios.ts',
            schemas: 'src/generated/model',
            client: 'react-query',
            override: {
                mutator: {
                    path: './src/lib/orval/mock-alt-api-axios.ts',
                    name: 'axiosInstance',
                },
            },
            // Vi bruker ikke mocks enda, og avventer ny versjon av orval
            // som støtter msw v2.
            mock: false,
        },

        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
});
