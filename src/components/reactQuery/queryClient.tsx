import { QueryClient } from 'react-query'

export const queryClient = new QueryClient()

// export const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: {
//         // suspense: true,
//         // useErrorBoundary: true,
//         keepPreviousData: true,
//         // refetchOnWindowFocus: false,
//         refetchOnMount: true,
//         // staleTime: 60000,
//         retry: (failureCount:number, error: any) => {
//           const res = error?.response;
//           return error?.message === "Network Error" ||
//             res?.status === 403 ||
//             res?.status === 500 ||
//             res?.status === 404
//             ? false
//             : failureCount > 2
//             ? false
//             : true;
//         },
//       },
//       mutations: {
//         // mutation options
//         // useErrorBoundary: true,
//       },
//     },
//   });