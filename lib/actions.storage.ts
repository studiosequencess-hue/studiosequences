// 'use server'
//
// import { createClient } from '@/lib/supabase.server'
// import { ServerResponse, User, UserInfo, UserRole } from '@/lib/models'
// import { DEFAULT_USER_INFO } from '@/lib/defaults'
// import deepmerge from 'deepmerge'
//
// export enum StoragePaths {
//   User = 'user/{id}',
// }
//
// type UploadFileProps = {
//   file: File
//   path: string
// }
// export async function uploadFile(
//   props: UploadFileProps,
// ): Promise<ServerResponse<string>> {
//   try {
//     const supabase = await createClient()
//     const { data, error } = await supabase.storage.getBucket(props.path)
//
//     if (error || !data || data.length == 0) {
//       return {
//         status: 'error',
//         message: 'No such user found.',
//       }
//     }
//
//     return {
//       status: 'success',
//       message: 'Successfully fetched user.',
//       data: deepmerge(DEFAULT_USER_INFO, data[0]),
//     }
//   } catch (e) {
//     console.log('getUser', e)
//     return {
//       status: 'error',
//       message: 'Failed to fetch user. Please try again later.',
//     }
//   }
// }
