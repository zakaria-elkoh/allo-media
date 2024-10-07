// // Need to use the React-specific entry point to import createApi
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// // import type { Pokemon } from "./types";
// interface User {
//   name: string;
//   id: number;
//   sprites: {
//     front_default: string;
//   };
// }

// // Define a service using a base URL and expected endpoints
// export const usersApi = createApi({
//   reducerPath: "users",
//   baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
//   endpoints: (builder) => ({
//     getPokemonByName: builder.query<User, string>({
//       query: () => `/test`,
//     }),
//   }),
// });

// // Export hooks for usage in functional components, which are
// // auto-generated based on the defined endpoints
// export const { useGetPokemonByNameQuery } = usersApi;
