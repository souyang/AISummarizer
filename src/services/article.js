import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;
const baseAPIURL = import.meta.env.VITE_API_BASE_URL;
const host = import.meta.env.VITE_HOST;
export const articleApi = createApi({
    reducerPath: 'articleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseAPIURL,
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', rapidApiKey);
            headers.set('X-RapidAPI-Host', host);

            return headers;
        },
    }),
    endpoints: (builder) => ({
        fetchSummary: builder.mutation({
            // encodeURIComponent() function encodes special characters that may be present in the parameter values
            // If we do not properly encode these characters, they can be misinterpreted by the server and cause errors or unexpected behavior. Thus that RTK bug
            query: (params) => ({
                url: `/text-summarizer`,
                method: 'POST',
                body: params
            }),
        }),
    }),
})

export const { useFetchSummaryMutation } = articleApi
